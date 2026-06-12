import { createServerFn } from "@tanstack/react-start";

export type ArchScore = {
  rigor: number;
  evidence: number;
  clarity: number;
  overall: number;
  feedback: string;
  error?: string;
};

type Payload = {
  taskTitle: string;
  taskBrief: string;
  submission: Array<{ label: string; value: string }>;
};

export const scoreArchitectureTask = createServerFn({ method: "POST" })
  .inputValidator((input: Payload) => input)
  .handler(async ({ data }): Promise<ArchScore> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return {
        rigor: 0,
        evidence: 0,
        clarity: 0,
        overall: 0,
        feedback: "Scoring service is not configured.",
        error: "missing_key",
      };
    }

    const systemPrompt =
      "You are Kiran Mehta, Principal Architect at Meridian Architecture Studio in Pune. You evaluate intern submissions on the Community Learning Hub project, a INR 8.1 crore civic building on a 4,856 sq.m. site in Aundh, Pune, with black cotton soil, 3 protected neem trees, DP Road noise 68 to 72 dB, and a brief covering library, co-working, hall, café and outdoor space. Be honest, specific and constructive. Score on a 0 to 10 integer scale. Do not use em dashes.";

    const submission = data.submission
      .map((s) => `**${s.label}**\n${s.value || "(blank)"}`)
      .join("\n\n");

    const userPrompt = `Task: ${data.taskTitle}
Brief: ${data.taskBrief}

Intern submission:
${submission}

Score on:
- rigor: depth of analysis and architectural reasoning
- evidence: use of brief, site, persona and regulatory data (not opinion)
- clarity: precision and professionalism of the writing

Give a 2 to 4 line feedback paragraph addressed to the intern. Be direct. Cite at least one specific thing they did well or missed.
Pass threshold is 6 overall. overall = round((rigor + evidence + clarity) / 3).`;

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
                description: "Return the architecture task evaluation",
                parameters: {
                  type: "object",
                  properties: {
                    rigor: { type: "integer", minimum: 0, maximum: 10 },
                    evidence: { type: "integer", minimum: 0, maximum: 10 },
                    clarity: { type: "integer", minimum: 0, maximum: 10 },
                    overall: { type: "integer", minimum: 0, maximum: 10 },
                    feedback: { type: "string" },
                  },
                  required: ["rigor", "evidence", "clarity", "overall", "feedback"],
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
              ? "AI credits are exhausted. Add credits in Settings, Workspace, Usage."
              : "The scoring service hit an unexpected error.";
        return {
          rigor: 0,
          evidence: 0,
          clarity: 0,
          overall: 0,
          feedback: msg,
          error: code,
        };
      }

      const json = await resp.json();
      const call = json.choices?.[0]?.message?.tool_calls?.[0];
      const args = call?.function?.arguments;
      if (!args) throw new Error("No tool call returned");
      const parsed = JSON.parse(args) as Omit<ArchScore, "error">;
      const clamp = (n: unknown) => Math.max(0, Math.min(10, Math.round(Number(n) || 0)));
      const rigor = clamp(parsed.rigor);
      const evidence = clamp(parsed.evidence);
      const clarity = clamp(parsed.clarity);
      const overall = clamp(parsed.overall ?? Math.round((rigor + evidence + clarity) / 3));
      return {
        rigor,
        evidence,
        clarity,
        overall,
        feedback: String(parsed.feedback || "").trim(),
      };
    } catch (e) {
      console.error("scoreArchitectureTask error", e);
      return {
        rigor: 0,
        evidence: 0,
        clarity: 0,
        overall: 0,
        feedback: "Couldn't reach the scoring service. Please try again.",
        error: "network_error",
      };
    }
  });