"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Copy,
  Sparkles,
  User,
} from "lucide-react";

export default function ChatMessage({
  message,
}) {
  const isAssistant =
    message.role === "assistant";

  const copyMessage = () => {
    navigator.clipboard.writeText(
      message.content
    );
  };

  return (
    <div className="flex gap-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          isAssistant
            ? "bg-indigo-600 text-white"
            : "bg-zinc-900 text-white"
        }`}
      >
        {isAssistant ? (
          <Sparkles size={17} />
        ) : (
          <User size={17} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-2 text-sm font-semibold text-zinc-900">
          {isAssistant
            ? "Researchly"
            : "You"}
        </p>

        {isAssistant ? (
          <div
            className={`prose prose-zinc max-w-none text-sm leading-7 ${
              message.error
                ? "rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
                : ""
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-700">
            {message.content}
          </p>
        )}

        {isAssistant && !message.error && (
          <button
            onClick={copyMessage}
            className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400 transition hover:text-zinc-800"
          >
            <Copy size={13} />

            Copy
          </button>
        )}
      </div>
    </div>
  );
}