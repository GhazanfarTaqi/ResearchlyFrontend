"use server";

import { auth } from "@clerk/nextjs/server";

const API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://researchlybackend.onrender.com";
const INTERNAL_API_KEY =
  process.env.INTERNAL_API_KEY;

async function getAuthenticatedUserId() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Authentication required");
  }
  return userId;
}

async function apiRequest(path, options = {}) {
  if (!API_URL) {
    throw new Error(
      "BACKEND_API_URL is not configured in the frontend deployment."
    );
  }
  if (!INTERNAL_API_KEY) {
    throw new Error(
      "INTERNAL_API_KEY is not configured in the frontend deployment."
    );
  }

  let baseUrl;
  try {
    baseUrl = new URL(API_URL);
  } catch {
    throw new Error(
      "BACKEND_API_URL is invalid."
    );
  }
  if (!["http:", "https:"].includes(baseUrl.protocol)) {
    throw new Error(
      "BACKEND_API_URL must use HTTP or HTTPS."
    );
  }

  let response;
  try {
    response = await fetch(`${baseUrl.toString().replace(/\/$/, "")}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Internal-API-Key": INTERNAL_API_KEY,
        ...options.headers,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });
  } catch {
    throw new Error(
      "Could not reach the Researchly backend."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.detail || "Researchly request failed"
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function createConversation() {
  const userId = await getAuthenticatedUserId();
  return apiRequest("/conversation", {
    method: "POST",
    body: JSON.stringify({ user_id: userId }),
  });
}

export async function listConversations() {
  const userId = await getAuthenticatedUserId();
  return apiRequest(
    `/conversations/${encodeURIComponent(userId)}`
  );
}

export async function getConversation(conversationId) {
  const userId = await getAuthenticatedUserId();

  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }

  try {
    return await apiRequest(
      `/conversation/${encodeURIComponent(userId)}/${encodeURIComponent(conversationId)}`
    );
  } catch (error) {
    return {
      status: error.status || 500,
      error: error.message,
      messages: [],
    };
  }
}

export async function sendMessage({
  conversationId,
  message,
}) {
  const userId = await getAuthenticatedUserId();

  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }
  if (!message?.trim()) {
    throw new Error("Message is required");
  }

  return apiRequest("/chat", {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      conversation_id: conversationId,
      message: message.trim(),
    }),
  });
}
