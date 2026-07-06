import { createServerFn } from "@tanstack/react-start";

type ChatMsg = { role: "user" | "assistant"; content: string };

type PrexInput = {
  phaseContext: string;
  messages: ChatMsg[];
};

function isValid(input: unknown): input is PrexInput {
  if (!input || typeof input !== "object") return false;
  const o = input as Record<string, unknown>;
  return (
    typeof o.phaseContext === "string" &&
    Array.isArray(o.messages) &&
    o.messages.every(
      (m) =>
        m &&
        typeof m === "object" &&
        (m as ChatMsg).role !== undefined &&
        typeof (m as ChatMsg).content === "string",
    )
  );
}

export const askPrex = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    if (!isValid(input)) throw new Error("Invalid input");
    return input;
  })
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const system = `You are Prex, an encouraging AI mentor inside the Prentix virtual internship platform. You give concise, practical, warm guidance tailored to what the intern is working on right now.

CURRENT WORKSPACE CONTEXT:
${data.phaseContext}

Guidelines:
- Keep replies short and skimmable (2-5 short paragraphs or a tight bulleted list).
- Speak like a supportive senior mentor, not a textbook.
- Ground answers in the current phase. If asked something off-topic, gently steer back.
- Never invent Prentix policies. If unsure, say so and suggest what to try.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          ...data.messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Prex is getting a lot of questions right now. Try again in a moment.");
      if (res.status === 402) throw new Error("AI credits are exhausted. Please add credits to continue.");
      throw new Error(`Prex error: ${res.status} ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content ?? "";
    return { content };
  });