import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) })).max(40),
});

export const askMimi = createServerFn({ method: "POST" })
  .validator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");
    const { user, metrics, insights, labs, meds, timeline } = await import("./mimi-data");
    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) return { ok: false as const, error: "mimi isn't configured yet." };

    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });

    const system = `You are mimi, a warm, precise personal health assistant inside the mimi app.
You speak to ${user.name}, age ${user.age}. Use her data below (synthetic demo data) to answer. Be concise (under 130 words), plain language, cite which source the data came from.
Never diagnose or prescribe. When something is worth raising, suggest discussing it with a clinician. If a symptom sounds urgent (chest pain, trouble breathing, heavy bleeding, thoughts of self-harm), tell her to seek emergency care.
DATA:
Cycle: day ${user.cycleDay} of ~${user.cycleLength} (luteal phase).
Metrics: ${JSON.stringify(metrics.map(({ series, ...m }) => ({ ...m, last10: series })))}
Insights: ${JSON.stringify(insights.map(({ title, body, sources }) => ({ title, body, sources })))}
Labs (Labcorp, Oct 03): ${JSON.stringify(labs)}
Medications: ${JSON.stringify(meds)}
Timeline: ${JSON.stringify(timeline)}`;

    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        instructions: system,
        messages: data.messages,
        providerOptions: {
          openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] },
        },
      });
      const text = await result.text;
      if (!text.trim()) return { ok: false as const, error: "mimi couldn't answer that one. Try asking another way." };
      return { ok: true as const, text };
    } catch (e: unknown) {
      const status = (e as { statusCode?: number })?.statusCode;
      if (status === 429) return { ok: false as const, error: "mimi is busy right now — try again in a moment." };
      if (status === 402) return { ok: false as const, error: "AI credits have run out for this workspace." };
      console.error("askMimi failed", e);
      return { ok: false as const, error: "Something went wrong reaching mimi. Please try again." };
    }
  });
