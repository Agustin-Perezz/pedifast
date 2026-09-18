import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }

  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NODE_ENV === "development"
  ) {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
    const port = supabaseUrl.match(/:(\d+)$/)?.[1] ?? "54321";
    const portNum = Number(port);
    const studioPort = portNum + 2;
    const mailpitPort = portNum + 3;
    console.log(`\n  Supabase Studio:  http://127.0.0.1:${studioPort}`);
    console.log(`  Mailpit (email):  http://127.0.0.1:${mailpitPort}`);
    console.log(`  API:              ${supabaseUrl}\n`);
  }
}

export const onRequestError = Sentry.captureRequestError;
