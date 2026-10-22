import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useRef, useEffect } from "react";
import { ArrowUp, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PhoneFrame, StatusBar } from "@/components/mimi/AppShell";
import { LivingTwin } from "@/components/mimi/LivingTwin";
import { suggested } from "@/lib/mimi-data";
import { askMimi } from "@/lib/ask.functions";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask mimi — your personal health AI" },
      { name: "description", content: "Ask questions about your own health data, labs and records — with sources." },
      { property: "og:title", content: "Ask mimi" },
      { property: "og:description", content: "Your personal health AI, grounded in your data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AskPage,
});

type Msg = { role: "user" | "assistant"; content: string; error?: boolean };

function AskPage() {
  const ask = useServerFn(askMimi);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, thinking]);
  useEffect(() => { if (!thinking) field.current?.focus(); }, [thinking]);

  const send = async (q: string) => {
    if (!q.trim() || thinking) return;
    const history: Msg[] = [...msgs.filter((m) => !m.error), { role: "user", content: q.trim() }];
    setMsgs((m) => [...m, { role: "user", content: q.trim() }]);
    setInput("");
    setThinking(true);
    try {
      const res = await ask({ data: { messages: history.map(({ role, content }) => ({ role, content })) } });
      setMsgs((m) => [...m, res.ok ? { role: "assistant", content: res.text } : { role: "assistant", content: res.error, error: true }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Couldn't reach mimi. Check your connection and try again.", error: true }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <PhoneFrame dark>
      <div className="flex h-full flex-col">
        <StatusBar />
        <div className="flex items-center justify-between px-5 pt-4">
          <h1 className="headline text-[28px]">Ask mimi</h1>
          <Link to="/home" aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted"><X className="h-5 w-5" /></Link>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-5 pt-4">
          {msgs.length === 0 && (
            <div className="animate-rise">
              <LivingTwin className="mx-auto w-44" />
              <p className="display mt-2 text-[38px]">What would you like to understand?</p>
              <div className="mt-6 space-y-2 pb-4">
                {suggested.map((s) => (
                  <button key={s} onClick={() => send(s)} className="block w-full rounded-2xl bg-card px-4 py-3.5 text-left text-sm font-semibold">{s}</button>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-3 pb-2">
            {msgs.map((m, i) => m.role === "user" ? (
              <p key={i} className="ml-auto max-w-[80%] animate-rise rounded-3xl rounded-br-md bg-primary px-4 py-3 text-sm text-primary-foreground">{m.content}</p>
            ) : (
              <div key={i} className={m.error ? "animate-rise rounded-2xl bg-status-attention/15 p-3 text-sm" : "animate-rise text-[15px] leading-relaxed"}>
                <div className="space-y-2 [&_li]:ml-4 [&_li]:list-disc [&_strong]:font-bold">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
                {!m.error && <p className="tech mt-2 opacity-50">Informational · not medical advice</p>}
              </div>
            ))}
            {thinking && (
              <div className="flex items-center gap-2">
                <LivingTwin className="w-8" />
                <p className="tech animate-pulse opacity-70">mimi is reading your data…</p>
              </div>
            )}
            <div ref={end} />
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); void send(input); }} className="m-4 flex items-center gap-2 rounded-full bg-card p-1.5 pl-5">
          <input ref={field} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything about your health…" aria-label="Message" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          <button type="submit" disabled={thinking || !input.trim()} aria-label="Send" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-thermal text-ink disabled:opacity-40"><ArrowUp className="h-5 w-5" /></button>
        </form>
      </div>
    </PhoneFrame>
  );
}
