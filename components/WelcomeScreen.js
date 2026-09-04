"use client";

import {
  BookOpen,
  FileSearch,
  Network,
  Search,
  Sparkles,
} from "lucide-react";

const suggestions = [
  {
    icon: Search,
    title: "Research a topic",
    description:
      "Investigate a subject using academic sources.",
    prompt:
      "Research recent developments in Retrieval Augmented Generation.",
  },
  {
    icon: FileSearch,
    title: "Find papers",
    description:
      "Discover relevant academic research papers.",
    prompt:
      "Find recent papers about autonomous AI agents.",
  },
  {
    icon: BookOpen,
    title: "Literature review",
    description:
      "Synthesize findings across multiple papers.",
    prompt:
      "Create a literature review about hallucination in large language models.",
  },
  {
    icon: Network,
    title: "Explore connections",
    description:
      "Understand relationships between concepts.",
    prompt:
      "Compare RAG, fine-tuning, and long-context LLMs.",
  },
];

export default function WelcomeScreen({
  onSuggestion,
}) {
  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 pb-40 pt-16">
      <div className="w-full max-w-3xl text-center">
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
          <Sparkles size={30} />
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
          What would you like to{" "}
          <span className="text-indigo-600">
            research?
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-500 md:text-base">
          Search papers, explore complex topics,
          synthesize research and turn information
          into useful insights.
        </p>

        <div className="mt-10 grid gap-3 text-left md:grid-cols-2">
          {suggestions.map(
            ({
              icon: Icon,
              title,
              description,
              prompt,
            }) => (
              <button
                key={title}
                onClick={() => onSuggestion(prompt)}
                className="group flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100">
                  <Icon size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    {title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    {description}
                  </p>
                </div>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}