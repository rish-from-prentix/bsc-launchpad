import { createServerFn } from "@tanstack/react-start";
import JSZip from "jszip";

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

    const sectorLabelMap: Record<string, string> = {
      ai: "AI & SaaS (foundation models, vertical SaaS, agentic workflows)",
      climate:
        "ClimateTech & Sustainability (decarbonisation, circular economy, climate finance)",
      health:
        "HealthTech (digital health, diagnostics, care delivery models)",
    };
    const sectorLabel = sectorLabelMap[data.sector] ?? data.sector;

    const systemPrompt = `You are a strict and objective evaluator at a startup accelerator (AIC Mohali).
Your job is to evaluate an intern's investment thesis document AGAINST THE SECTOR THEY CHOSE.

THEME ALIGNMENT IS THE FIRST GATE — enforce it strictly:
- Read the document and determine what sector it is actually about.
- If the document's sector clearly does NOT match the chosen sector (for example, a fintech / payments / lending deck submitted for AI & SaaS, ClimateTech, or HealthTech), it is off-theme.
- Off-theme submissions must be scored 0-2 on EVERY parameter, overall around 1-2, and the feedback must clearly state which sector the deck is actually about and that it does not match the chosen theme.
- Adjacent/tangential overlap (e.g. an AI-powered health product for the HealthTech theme, or a climate-fintech for ClimateTech) can be on-theme — use judgement, but require the core thesis to serve the chosen sector.

GENERAL SCORING RULES:
- Do NOT default to high scores. A 9/10 should be rare and only given for truly exceptional work.
- Evaluate ONLY based on what is actually written / shown in the uploaded document.
- If the document is vague, generic, or lacks depth — score 3-5.
- If the document is partially structured but missing key elements — score 5-7.
- If the document is well-researched, specific, clearly argued, AND on-theme — score 7-9.
- A 10/10 should almost never be given.
- If the document is unreadable, empty, or not an investment thesis, score everything 0-2 and say so honestly in the feedback.

EVALUATE ON THESE PARAMETERS (score each out of 10 as an integer):
1. Clarity of thesis statement (for the CHOSEN sector)
2. Market understanding and research depth (of the CHOSEN sector)
3. Founder/team assessment quality
4. Risk identification
5. Originality of insight

For each parameter, provide ONE specific one-line justification citing actual content from the document. If off-theme, say so explicitly in the justification.
Then give 2-3 lines of overall feedback citing actual content from the document, and — if off-theme — call out what sector the deck is actually about.
Then give ONE clear area of improvement.
Do not be generous. Be honest.`;

    const userPromptText = `Sector chosen by the intern: ${sectorLabel}.

First check whether the attached document is actually about this sector. If it is off-theme, score it 0-2 on every parameter and explain in feedback what sector it is actually about. If it is on-theme, evaluate it strictly using the rubric.`;

    const isPdf = /pdf/i.test(data.mimeType) || /\.pdf$/i.test(data.fileName);
    const isImage = /^image\//i.test(data.mimeType);
    const isPptx =
      /\.pptx$/i.test(data.fileName) ||
      /presentationml\.presentation/i.test(data.mimeType);
    const isLegacyPpt =
      /\.ppt$/i.test(data.fileName) ||
      /ms-powerpoint/i.test(data.mimeType);

    if (isLegacyPpt && !isPptx) {
      return {
        clarity: 0,
        market: 0,
        team: 0,
        risk: 0,
        originality: 0,
        overall: 0,
        feedback:
          "Legacy .ppt files aren't supported. Please save your deck as .pptx or export it as a PDF and try again.",
        improvement: "",
        error: "unsupported_type",
      };
    }

    if (!isPdf && !isImage && !isPptx) {
      return {
        clarity: 0,
        market: 0,
        team: 0,
        risk: 0,
        originality: 0,
        overall: 0,
        feedback:
          "Unsupported file type. Please upload a PDF or a .pptx deck.",
        improvement: "",
        error: "unsupported_type",
      };
    }

    // For .pptx we extract slide text server-side (Worker-safe) and send as text.
    let pptxText = "";
    if (isPptx) {
      try {
        const bytes = Uint8Array.from(atob(data.fileBase64), (c) => c.charCodeAt(0));
        const zip = await JSZip.loadAsync(bytes);
        const slideFiles = Object.keys(zip.files)
          .filter((n) => /^ppt\/slides\/slide\d+\.xml$/i.test(n))
          .sort((a, b) => {
            const na = parseInt(a.match(/slide(\d+)\.xml/i)?.[1] ?? "0", 10);
            const nb = parseInt(b.match(/slide(\d+)\.xml/i)?.[1] ?? "0", 10);
            return na - nb;
          });
        const parts: string[] = [];
        for (const name of slideFiles) {
          const xml = await zip.files[name].async("string");
          const texts = Array.from(xml.matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g)).map(
            (m) =>
              m[1]
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'"),
          );
          const idx = name.match(/slide(\d+)/i)?.[1] ?? "?";
          parts.push(`--- Slide ${idx} ---\n${texts.join("\n")}`);
        }
        pptxText = parts.join("\n\n").trim();
        if (!pptxText) {
          return {
            clarity: 0,
            market: 0,
            team: 0,
            risk: 0,
            originality: 0,
            overall: 0,
            feedback:
              "We couldn't read any text from this .pptx. If the slides are mostly images, please export the deck as a PDF and try again.",
            improvement: "",
            error: "empty_pptx",
          };
        }
      } catch (e) {
        console.error("scoreThesis pptx parse error", e);
        return {
          clarity: 0,
          market: 0,
          team: 0,
          risk: 0,
          originality: 0,
          overall: 0,
          feedback:
            "We couldn't open that .pptx file. Please re-save it or export as PDF and try again.",
          improvement: "",
          error: "pptx_parse_error",
        };
      }
    }

    const userContent: Array<Record<string, unknown>> = [
      { type: "text", text: userPromptText },
    ];
    if (isPdf) {
      userContent.push({
        type: "file",
        file: {
          filename: data.fileName || "thesis.pdf",
          file_data: `data:application/pdf;base64,${data.fileBase64}`,
        },
      });
    } else if (isImage) {
      userContent.push({
        type: "image_url",
        image_url: { url: `data:${data.mimeType};base64,${data.fileBase64}` },
      });
    } else if (isPptx) {
      userContent.push({
        type: "text",
        text: `Extracted text from the uploaded .pptx deck "${data.fileName}" (slide by slide):\n\n${pptxText}`,
      });
    }

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
              content: userContent,
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