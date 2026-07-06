import { createServerFn } from "@tanstack/react-start";

export type ThesisScores = {
  clarity: number;
  market: number;
  team: number;
  risk: number;
  originality: number;
  overall: number;
  feedback: string;
  improvement: string;
  justifications?: {
    clarity?: string;
    market?: string;
    team?: string;
    risk?: string;
    originality?: string;
  };
  error?: string;
};

type LegacyAlias = {
  /** @deprecated kept so old call sites that referenced these names still type-check */
  opportunity?: number;
  /** @deprecated */
  recommendation: number;
};
// Back-compat: some older UI code reads `scores.opportunity` / `scores.recommendation`.
// They're no longer produced by the model; surface them as optional 0s if read.
export type ThesisScoresWithLegacy = ThesisScores & Partial<LegacyAlias>;

export const scoreThesis = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      sector: string;
      fileName: string;
      mimeType: string;
      fileBase64: string;
    }) => input,
  )
  .handler(async ({ data }): Promise<ThesisScores> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return {
        clarity: 0,
        market: 0,
        team: 0,
        risk: 0,
        originality: 0,
        overall: 0,
        feedback: "Scoring service is not configured.",
        improvement: "",
        error: "missing_key",
      };
    }

    const systemPrompt = `You are a strict and objective evaluator at a startup accelerator (AIC Mohali).
Your job is to evaluate an intern's investment thesis document.

IMPORTANT RULES:
- Do NOT default to high scores. A score of 9/10 should be rare and only given for truly exceptional work.
- Evaluate ONLY based on what is actually written in the uploaded document.
- If the document is vague, generic, or lacks depth — score it low (3-5).
- If the document is partially structured but missing key elements — score it mid-range (5-7).
- If the document is well-researched, specific, and clearly argued — score it high (7-9).
- A 10/10 should almost never be given.
- If the document is unreadable, empty, off-topic, or not an investment thesis, score everything 0-2 and say so honestly in the feedback.

EVALUATE ON THESE PARAMETERS (score each out of 10 as an integer):
1. Clarity of thesis statement
2. Market understanding and research depth
3. Founder/team assessment quality
4. Risk identification
5. Originality of insight

For each parameter, provide ONE specific one-line justification citing actual content from the document.
Then give 2-3 lines of overall feedback citing actual content from the document.
Then give ONE clear area of improvement.
Do not be generous. Be honest.`;

    const userPromptText = `Sector chosen by the intern: ${data.sector}.

Please evaluate the attached investment thesis document strictly using the rubric.`;

    const isPdf = /pdf/i.test(data.mimeType) || /\.pdf$/i.test(data.fileName);
    const isImage = /^image\//i.test(data.mimeType);
    if (!isPdf && !isImage) {
      return {
        clarity: 0,
        market: 0,
        team: 0,
        risk: 0,
        originality: 0,
        overall: 0,
        feedback:
          "Please upload your thesis as a PDF. PowerPoint files aren't supported directly — export your deck to PDF and try again.",
        improvement: "",
        error: "unsupported_type",
      };
    }

    const attachment = isPdf
      ? {
          type: "file" as const,
          file: {
            filename: data.fileName || "thesis.pdf",
            file_data: `data:application/pdf;base64,${data.fileBase64}`,
          },
        }
      : {
          type: "image_url" as const,
          image_url: {
            url: `data:${data.mimeType};base64,${data.fileBase64}`,
          },
        };

    try {
      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                { type: "text", text: userPromptText },
                attachment,
              ],
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "submit_score",
                description: "Return the thesis evaluation",
                parameters: {
                  type: "object",
                  properties: {
                    clarity: { type: "integer", minimum: 0, maximum: 10 },
                    market: { type: "integer", minimum: 0, maximum: 10 },
                    team: { type: "integer", minimum: 0, maximum: 10 },
                    risk: { type: "integer", minimum: 0, maximum: 10 },
                    originality: { type: "integer", minimum: 0, maximum: 10 },
                    clarity_justification: { type: "string" },
                    market_justification: { type: "string" },
                    team_justification: { type: "string" },
                    risk_justification: { type: "string" },
                    originality_justification: { type: "string" },
                    feedback: { type: "string" },
                    improvement: { type: "string" },
                  },
                  required: [
                    "clarity",
                    "market",
                    "team",
                    "risk",
                    "originality",
                    "clarity_justification",
                    "market_justification",
                    "team_justification",
                    "risk_justification",
                    "originality_justification",
                    "feedback",
                    "improvement",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "submit_score" } },
        }),
      });

      if (!resp.ok) {
        let detail = "";
        try {
          detail = await resp.text();
        } catch {}
        console.error("scoreThesis gateway error", resp.status, detail);
        const code =
          resp.status === 429
            ? "rate_limited"
            : resp.status === 402
              ? "credits_exhausted"
              : "gateway_error";
        const msg =
          resp.status === 429
            ? "AI is busy right now. Please try again in a minute."
            : resp.status === 402
              ? "AI credits are exhausted. Add credits in Settings → Workspace → Usage."
              : "The scoring service hit an unexpected error.";
        return {
          clarity: 0,
          market: 0,
          team: 0,
          risk: 0,
          originality: 0,
          overall: 0,
          feedback: msg,
          improvement: "",
          error: code,
        };
      }

      const json = await resp.json();
      const call = json.choices?.[0]?.message?.tool_calls?.[0];
      const args = call?.function?.arguments;
      if (!args) throw new Error("No tool call returned");
      const parsed = JSON.parse(args) as Record<string, unknown>;
      const clamp = (n: unknown) =>
        Math.max(0, Math.min(10, Math.round(Number(n) || 0)));
      const clarity = clamp(parsed.clarity);
      const market = clamp(parsed.market);
      const team = clamp(parsed.team);
      const risk = clamp(parsed.risk);
      const originality = clamp(parsed.originality);
      const avg = (clarity + market + team + risk + originality) / 5;
      const overall = Math.round(avg * 10) / 10;
      return {
        clarity,
        market,
        team,
        risk,
        originality,
        overall,
        feedback: String(parsed.feedback ?? "").trim(),
        improvement: String(parsed.improvement ?? "").trim(),
        justifications: {
          clarity: String(parsed.clarity_justification ?? "").trim(),
          market: String(parsed.market_justification ?? "").trim(),
          team: String(parsed.team_justification ?? "").trim(),
          risk: String(parsed.risk_justification ?? "").trim(),
          originality: String(parsed.originality_justification ?? "").trim(),
        },
      };
    } catch (e) {
      console.error("scoreThesis error", e);
      return {
        clarity: 0,
        market: 0,
        team: 0,
        risk: 0,
        originality: 0,
        overall: 0,
        feedback: "Couldn't reach the scoring service. Please try again.",
        improvement: "",
        error: "network_error",
      };
    }
  });