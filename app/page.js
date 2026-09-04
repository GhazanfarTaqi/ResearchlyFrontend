"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Menu,
  Sparkles,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import WelcomeScreen from "@/components/WelcomeScreen";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";

import { sendMessage } from "@/lib/api";

export default function Home() {
  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "researchly-chat"
      );

    if (saved) {
      try {
        setMessages(
          JSON.parse(saved)
        );
      } catch {
        localStorage.removeItem(
          "researchly-chat"
        );
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "researchly-chat",
      JSON.stringify(messages)
    );

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const newChat = () => {
    setMessages([]);
    setInput("");

    localStorage.removeItem(
      "researchly-chat"
    );
  };

  const submitMessage = async (
    customMessage
  ) => {
    const text = (
      customMessage || input
    ).trim();

    if (!text || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const reply =
        await sendMessage(text);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          error: true,
          content:
            error.message ||
            "Could not connect to Researchly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        onNewChat={newChat}
      />

      <section className="relative flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 px-6">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">
              Research Agent
            </h2>

            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              Ready to research
            </div>
          </div>
        </header>

        {messages.length === 0 ? (
          <WelcomeScreen
            onSuggestion={
              submitMessage
            }
          />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto flex max-w-3xl flex-col gap-10 px-5 pb-48 pt-10">
              {messages.map(
                (message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                  />
                )
              )}

              {loading && (
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold">
                      Researchly
                    </p>

                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" />

                      <span className="ml-2 text-xs text-zinc-400">
                        Researching...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div
                ref={messagesEndRef}
              />
            </div>
          </div>
        )}

        <ChatInput
          input={input}
          setInput={setInput}
          loading={loading}
          onSubmit={() =>
            submitMessage()
          }
        />
      </section>
    </main>
  );
}