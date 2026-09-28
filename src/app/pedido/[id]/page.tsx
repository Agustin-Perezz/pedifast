import { ReceiptView } from "./components/ReceiptView";
import { verifyReceiptPayment } from "./queries";

export default async function ReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const urlSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (typeof value === "string") {
      urlSearchParams.set(key, value);
    }
  }

  const verification = await verifyReceiptPayment({
    orderId: id,
    searchParams: urlSearchParams,
  });

  return (
    <ReceiptView
      orderId={id}
      verifiedStatus={verification.verifiedStatus}
      paymentId={verification.paymentId}
      isDashboardFlow={verification.isDashboardFlow}
    />
  );
}
