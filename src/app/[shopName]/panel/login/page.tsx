import { redirect } from "next/navigation";
import {
  getPanelSession,
  panelPath,
} from "@/lib/shared/infrastructure/panel-auth.server";

import { PanelLoginForm } from "./components/PanelLoginForm";

export default async function PanelLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ shopName: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { shopName } = await params;
  const { error } = await searchParams;
  const session = await getPanelSession();

  if (session && session.shopName === shopName) {
    redirect(panelPath(shopName));
  }

  return <PanelLoginForm shopName={shopName} error={error ?? null} />;
}
