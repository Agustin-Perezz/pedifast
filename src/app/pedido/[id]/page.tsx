import { ReceiptView } from "./components/ReceiptView";
import { verifyReceiptPayment } from "./queries";

type ReceiptPageParams = {
  readonly id: string;
};

type ReceiptPageSearchParams = Record<string, string | string[] | undefined>;

type ReceiptPageProps = {
  readonly params: Promise<ReceiptPageParams>;
  readonly searchParams: Promise<ReceiptPageSearchParams>;
};

export default async function ReceiptPage({
  params,
  searchParams,
}: ReceiptPageProps) {
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
