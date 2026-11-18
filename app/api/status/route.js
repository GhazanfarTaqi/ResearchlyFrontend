export const dynamic = "force-dynamic";

export async function GET() {
  const backendUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://researchlybackend.onrender.com";

  let backend = {
    configured: Boolean(backendUrl),
    reachable: false,
  };

  try {
    const response = await fetch(
      `${backendUrl.replace(/\/$/, "")}/health`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }
    );
    backend.reachable = response.ok;
  } catch {
    backend.reachable = false;
  }

  return Response.json({
    frontend: {
      clerkPublishableKey:
        Boolean(
          process.env
            .NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        ),
      clerkSecretKey:
        Boolean(process.env.CLERK_SECRET_KEY),
      backendUrl: Boolean(backendUrl),
      internalApiKey:
        Boolean(process.env.INTERNAL_API_KEY),
    },
    backend,
  });
}
