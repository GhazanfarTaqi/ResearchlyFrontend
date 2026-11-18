"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Sparkles,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

import Sidebar from "@/components/Sidebar";
import WelcomeScreen from "@/components/WelcomeScreen";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";

import {
  createConversation,
  getConversation,
  listConversations,
  sendMessage,
} from "@/app/actions/researchly";

const CONVERSATION_ID_KEY = "researchly-conversation-id";

function toUiMessage(message, index) {
  const role =
    message.role?.toLowerCase() === "human"
      ? "user"
      : message.role?.toLowerCase() === "ai"
        ? "assistant"
        : message.role?.toLowerCase() || "assistant";

  return {
    id: `${role}-${index}-${message.timestamp || ""}`,
    role,
    content: message.content || "",
  };
}

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [initializing, setInitializing] =
    useState(true);

  const [conversationId, setConversationId] =
    useState("");

  const [conversations, setConversations] =
    useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function initializeConversation() {
      if (!isLoaded || !isSignedIn || !user) return;

      const conversationKey =
        `${CONVERSATION_ID_KEY}:${user.id}`;
      let localConversationId =
        localStorage.getItem(conversationKey);

      try {
        if (!localConversationId) {
          const created = await createConversation();
          localConversationId =
            created.conversation_id;
          localStorage.setItem(
            conversationKey,
            localConversationId
          );
        }

        if (cancelled) return;

        setConversationId(localConversationId);
        let conversation;
        try {
          conversation =
            await getConversation(localConversationId);
        } catch (error) {
          if (error.status !== 404) {
            throw error;
          }

          const created = await createConversation();
          localConversationId =
            created.conversation_id;
          localStorage.setItem(
            conversationKey,
            localConversationId
          );
          setConversationId(localConversationId);
          conversation =
            await getConversation(localConversationId);
        }

        if (cancelled) return;

        if (conversation.status === 404) {
          const created = await createConversation();
          localConversationId =
            created.conversation_id;
          localStorage.setItem(
            `${CONVERSATION_ID_KEY}:${user.id}`,
            localConversationId
          );
          setConversationId(localConversationId);
          conversation =
            await getConversation(localConversationId);
        }

        if (conversation.status && conversation.status !== 200) {
          throw new Error(
            conversation.error ||
            "Could not load the saved conversation."
          );
        }

        setMessages(
          (conversation.messages || [])
            .map(toUiMessage)
        );

        try {
          const conversationList =
            await listConversations();
          if (!cancelled) {
            setConversations(
              conversationList.conversations || []
            );
          }
        } catch {
          if (!cancelled) setConversations([]);
        }
      } catch (error) {
        if (cancelled) return;

        setMessages([
          {
            id: crypto.randomUUID(),
            role: "assistant",
            error: true,
            content:
              error.message ||
              "Could not load the saved conversation.",
          },
        ]);
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }

    initializeConversation();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const newChat = async () => {
    if (!isSignedIn || !user || loading) return;

    setLoading(true);
    setInput("");

    try {
      const created = await createConversation();
      const nextConversationId =
        created.conversation_id;

      localStorage.setItem(
        `${CONVERSATION_ID_KEY}:${user.id}`,
        nextConversationId
      );
      setConversationId(nextConversationId);
      setMessages([]);
      try {
        const conversationList =
          await listConversations();
        setConversations(
          conversationList.conversations || []
        );
      } catch {
        setConversations((prev) => [
          {
            conversation_id: nextConversationId,
            title: "New research",
          },
          ...prev.filter(
            (item) =>
              item.conversation_id !==
              nextConversationId
          ),
        ]);
      }
    } catch (error) {
      setMessages([
        {
          id: crypto.randomUUID(),
          role: "assistant",
          error: true,
          content:
            error.message ||
            "Could not create a new conversation.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (
    selectedConversationId
  ) => {
    if (
      loading ||
      selectedConversationId ===
        conversationId
    ) {
      return;
    }

    setLoading(true);
    setInput("");

    try {
      const conversation =
        await getConversation(
          selectedConversationId
        );

      if (
        conversation.status &&
        conversation.status !== 200
      ) {
        throw new Error(
          conversation.error ||
          "Could not load the selected conversation."
        );
      }

      localStorage.setItem(
        `${CONVERSATION_ID_KEY}:${user.id}`,
        selectedConversationId
      );
      setConversationId(
        selectedConversationId
      );
      setMessages(
        (conversation.messages || [])
          .map(toUiMessage)
      );
    } catch (error) {
      setMessages([
        {
          id: crypto.randomUUID(),
          role: "assistant",
          error: true,
          content:
            error.message ||
            "Could not load the selected conversation.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submitMessage = async (
    customMessage
  ) => {
    const text = (
      customMessage || input
    ).trim();

    if (
      !text ||
      loading ||
      initializing ||
      !isSignedIn ||
      !conversationId
    ) {
      return;
    }

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
      const response =
        await sendMessage({
          conversationId,
          message: text,
        });

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.reply,
        },
      ]);
      try {
        const conversationList =
          await listConversations();
        setConversations(
          conversationList.conversations || []
        );
      } catch {
        // Keep the existing sidebar list if refresh fails.
      }
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
        conversationId={conversationId}
        loading={loading || initializing}
        conversations={conversations}
        onSelectConversation={
          selectConversation
        }
        userName={
          user?.fullName ||
          user?.primaryEmailAddress?.emailAddress
        }
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

              {initializing
                ? "Loading conversation"
                : "Ready to research"}
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
          loading={loading || initializing}
          onSubmit={() =>
            submitMessage()
          }
        />
      </section>
    </main>
  );
}