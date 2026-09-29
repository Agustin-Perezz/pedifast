import { redirect } from "next/navigation";
import {
  getPanelSession,
  panelPath,
} from "@/lib/shared/infrastructure/panel-auth.server";

import { PanelLoginForm } from "./components/PanelLoginForm";

type PanelLoginPageParams = {
  readonly shopName: string;
};

type PanelLoginPageSearchParams = {
  readonly error?: string;
};

type PanelLoginPageProps = {
  readonly params: Promise<PanelLoginPageParams>;
  readonly searchParams: Promise<PanelLoginPageSearchParams>;
};

export default async function PanelLoginPage({
  params,
  searchParams,
}: PanelLoginPageProps) {
  const { shopName } = await params;
  const { error } = await searchParams;
  const session = await getPanelSession();

  if (session && session.shopName === shopName) {
    redirect(panelPath(shopName));
  }

  return <PanelLoginForm shopName={shopName} error={error ?? null} />;
}
