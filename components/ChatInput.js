"use client";

import {
  ArrowUp,
  Sparkles,
} from "lucide-react";

export default function ChatInput({
  input,
  setInput,
  loading,
  onSubmit,
}) {
  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (!loading && input.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent px-4 pb-4 pt-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg shadow-zinc-200/50 transition focus-within:border-indigo-300">
          <textarea
            value={input}
            disabled={loading}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Ask Researchly anything..."
            rows={2}
            className="max-h-44 min-h-[50px] w-full resize-none bg-transparent px-2 py-1 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
          />

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Sparkles size={13} />

              Research Agent
            </div>

            <button
              onClick={onSubmit}
              disabled={
                loading || !input.trim()
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-zinc-200"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>

        <p className="mt-2 text-center text-[10px] text-zinc-400">
          Researchly can make mistakes.
          Verify important information and
          citations.
        </p>
      </div>
    </div>
  );
}