import { createServerFn } from "@tanstack/react-start";

export type ThesisScores = {
  market: number;
  opportunity: number;
  recommendation: number;
  overall: number;
  feedback: string;
  error?: string;
};

export const scoreThesis = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      sector: string;
      answers: {
        overview: string;
        problems: string;
        activity: string;
        risks: string;
        recommendation: string;
      };
    }) => input,
  )
  .handler(async ({ data }): Promise<ThesisScores> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return {
        market: 0,
        opportunity: 0,
        recommendation: 0,
        overall: 0,
        feedback: "Scoring service is not configured.",
        error: "missing_key",
      };
    }

    const systemPrompt = `You are a senior partner at an Indian early-stage accelerator (AIC × ISB). You evaluate accelerator investment theses from incoming program-manager interns. Be honest, specific, and constructive. Score on a 0-10 integer scale.`;

    const userPrompt = `Sector chosen: ${data.sector}

Q1 — The opportunity (what's happening that makes the sector impossible to ignore):
${data.answers.overview}

Q2 — Where startups should play (specific bet a founder should take):
${data.answers.problems}

Q3 — What the market is saying (active startups, investors, deals):
${data.answers.activity}

Q4 — Risks worth taking (bear case + why upside still wins):
${data.answers.risks}

Q5 — Recommendation to the AIC × ISB board:
${data.answers.recommendation}

Score the thesis on:
- market: depth of market understanding (signal, data, named companies / investors / deals)
- opportunity: clarity of the where-to-play bet (specific, underserved, solvable)
- recommendation: strength of the final board-level conviction statement

Then give a 2-4 line feedback paragraph addressed to the intern. Be direct.
Pass threshold is 6 overall. overall = round((market + opportunity + recommendation) / 3).`;

    try {
      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
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
                    market: { type: "integer", minimum: 0, maximum: 10 },
                    opportunity: { type: "integer", minimum: 0, maximum: 10 },
                    recommendation: { type: "integer", minimum: 0, maximum: 10 },
                    overall: { type: "integer", minimum: 0, maximum: 10 },
                    feedback: { type: "string" },
                  },
                  required: ["market", "opportunity", "recommendation", "overall", "feedback"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "submit_score" } },
        }),
      });

      if (!resp.ok) {
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
          market: 0,
          opportunity: 0,
          recommendation: 0,
          overall: 0,
          feedback: msg,
          error: code,
        };
      }

      const json = await resp.json();
      const call = json.choices?.[0]?.message?.tool_calls?.[0];
      const args = call?.function?.arguments;
      if (!args) throw new Error("No tool call returned");
      const parsed = JSON.parse(args) as Omit<ThesisScores, "error">;
      const clamp = (n: unknown) =>
        Math.max(0, Math.min(10, Math.round(Number(n) || 0)));
      const market = clamp(parsed.market);
      const opportunity = clamp(parsed.opportunity);
      const recommendation = clamp(parsed.recommendation);
      const overall = clamp(
        parsed.overall ?? Math.round((market + opportunity + recommendation) / 3),
      );
      return {
        market,
        opportunity,
        recommendation,
        overall,
        feedback: String(parsed.feedback || "").trim(),
      };
    } catch (e) {
      console.error("scoreThesis error", e);
      return {
        market: 0,
        opportunity: 0,
        recommendation: 0,
        overall: 0,
        feedback: "Couldn't reach the scoring service. Please try again.",
        error: "network_error",
      };
    }
  });