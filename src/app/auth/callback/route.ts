import { redirect } from "next/navigation";
import {
  DASHBOARD_PATH,
  SIGNIN_PATH,
} from "@/lib/shared/infrastructure/auth.server";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    redirect(`${SIGNIN_PATH}?error=${error}`);
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      redirect(`${SIGNIN_PATH}?error=auth_failed`);
    }

    redirect(DASHBOARD_PATH);
  }

  redirect(SIGNIN_PATH);
}
