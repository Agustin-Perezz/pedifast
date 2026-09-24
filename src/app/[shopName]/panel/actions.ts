"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { panelLoginRequestDto } from "@/application/use-cases/panel-auth/panel-auth.request.dto";
import { createPanelContainer } from "@/lib/containers/panel.container";
import {
  panelPath,
  requirePanelSession,
} from "@/lib/shared/infrastructure/panel-auth.server";
import {
  createSessionToken,
  PANEL_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/shared/infrastructure/panel-session";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";
import { buildOrderConfirmationWhatsappUrl } from "@/lib/utils/whatsapp";

export type PanelActionResult =
  | { ok: true; whatsappUrl: string | null }
  | { ok: false; error: string };

const LOGIN_ERRORS = {
  SHOP_NOT_FOUND: "No encontramos la tienda",
  PANEL_DISABLED: "El panel no está habilitado para este local",
  INVALID_PIN: "PIN incorrecto",
} as const;

type PanelActionInput = {
  readonly shopName: string;
  readonly orderId: number;
};

function loginErrorRedirect(shopName: string, message: string): never {
  redirect(`/${shopName}/panel/login?error=${encodeURIComponent(message)}`);
}

export async function loginWithPinAction(formData: FormData): Promise<void> {
  const shopName = String(formData.get("shopName") ?? "");
  const parsed = panelLoginRequestDto.safeParse({
    shopName,
    pin: formData.get("pin"),
  });

  if (!parsed.success) {
    loginErrorRedirect(shopName, LOGIN_ERRORS.INVALID_PIN);
  }

  const supabase = await createSupabaseServerClient();
  const container = createPanelContainer(supabase);
  const result = await container.auth.execute(parsed.data);

  if (!result.ok) {
    loginErrorRedirect(shopName, LOGIN_ERRORS[result.reason]);
  }

  const cookieStore = await cookies();
  cookieStore.set(
    PANEL_COOKIE_NAME,
    createSessionToken(result.shopId, result.shopName),
    {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
    },
  );

  redirect(panelPath(shopName));
}

export async function confirmOrderAction({
  shopName,
  orderId,
}: PanelActionInput): Promise<PanelActionResult> {
  const session = await requirePanelSession(shopName);
  const supabase = await createSupabaseServerClient();
  const container = createPanelContainer(supabase);
  const result = await container.confirmOrder.execute({
    orderId,
    shopId: session.shopId,
  });

  revalidatePath(`/${shopName}/panel`);

  return {
    ok: true,
    whatsappUrl: buildOrderConfirmationWhatsappUrl(result.order),
  };
}

export async function rejectOrderAction({
  shopName,
  orderId,
}: PanelActionInput): Promise<PanelActionResult> {
  const session = await requirePanelSession(shopName);
  const supabase = await createSupabaseServerClient();
  const container = createPanelContainer(supabase);
  await container.rejectOrder.execute({
    orderId,
    shopId: session.shopId,
  });

  revalidatePath(`/${shopName}/panel`);

  return { ok: true, whatsappUrl: null };
}
