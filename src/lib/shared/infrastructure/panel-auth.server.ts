import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  PANEL_COOKIE_NAME,
  type PanelSessionPayload,
  verifySessionToken,
} from "./panel-session";

export type PanelSession = PanelSessionPayload;

export function panelLoginPath(shopName: string): string {
  return `/${shopName}/panel/login`;
}

export function panelPath(shopName: string): string {
  return `/${shopName}/panel`;
}

export async function getPanelSession(): Promise<PanelSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PANEL_COOKIE_NAME)?.value;

  return verifySessionToken(token);
}

export async function requirePanelSession(
  shopName: string,
): Promise<PanelSession> {
  const session = await getPanelSession();

  if (!session) {
    redirect(panelLoginPath(shopName));
  }

  if (session.shopName !== shopName) {
    const cookieStore = await cookies();
    cookieStore.delete(PANEL_COOKIE_NAME);
    redirect(panelLoginPath(shopName));
  }

  return session;
}
