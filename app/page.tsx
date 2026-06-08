"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";

export default function Home() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [input, setInput] = useState("");
  const isLoading = status === "streaming" || status === "submitted";
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage({ role: "user", parts: [{ type: "text", text }] });
    setInput("");
  }

  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto px-4">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-zinc-400 mt-20 text-sm">
            Send a message to start chatting.
          </p>
        )}
        {messages.map((m) => {
          const text = m.parts
            .filter((p) => p.type === "text")
            .map((p) => p.text)
            .join("");
          if (!text) return null;
          return (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-900"
                }`}
              >
                {text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 py-4 border-t border-zinc-200"
      >
        <input
          className="flex-1 rounded-xl border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-zinc-500"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-40"
        >
          {isLoading ? "…" : "Send"}
        </button>
      </form>
    </main>
  );
}
