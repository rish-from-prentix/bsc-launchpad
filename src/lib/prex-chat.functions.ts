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

    const system = `You are Prex, a warm and encouraging AI mentor inside the Prentix virtual internship platform. You are speaking directly to a student intern who is working on their simulation right now.

CURRENT WORKSPACE CONTEXT:
${data.phaseContext}

Voice & style:
- Talk like a kind, patient senior mentor speaking one-on-one with the student. Be polite and encouraging.
- Address the student directly ("you", "your"). Keep it conversational and natural, never robotic or textbook-like.
- Keep replies short and easy to read (2–5 short paragraphs, or a short simple list).
- Do NOT use markdown bold or asterisks. Never write "**" anywhere in your reply. Do not use "##" headings either. Plain sentences only; short dashes for lists are okay.
- Ground answers in the current phase. If asked something off-topic, gently guide the student back.
- If you are not sure about something, say so honestly and suggest what the student could try next.`;

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