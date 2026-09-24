import { serializePanelOrder } from "@/app/[shopName]/panel/lib/serialize-panel-order";
import {
  type OrderStreamEvent,
  subscribeToShopOrders,
} from "@/lib/shared/infrastructure/order-stream-hub";
import {
  PANEL_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/shared/infrastructure/panel-session";

const KEEPALIVE_INTERVAL_MS = 30_000;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shopId: string }> },
): Promise<Response> {
  const { shopId: shopIdParam } = await params;
  const shopId = Number.parseInt(shopIdParam, 10);

  if (Number.isNaN(shopId) || shopId <= 0) {
    return new Response("Invalid shop ID", { status: 400 });
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = parseCookieValue(cookieHeader, PANEL_COOKIE_NAME);
  const session = verifySessionToken(token);

  if (!session || session.shopId !== shopId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();
  let cleanup: () => void = () => {};

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: OrderStreamEvent) => {
        controller.enqueue(
          encoder.encode(
            `event: ${event.type}\ndata: ${JSON.stringify(
              serializePanelOrder(event.order),
            )}\n\n`,
          ),
        );
      };

      const unsubscribe = subscribeToShopOrders(shopId, send);
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${shopId}\n\n`),
      );

      const keepalive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        } catch {
          clearInterval(keepalive);
        }
      }, KEEPALIVE_INTERVAL_MS);

      cleanup = () => {
        clearInterval(keepalive);
        unsubscribe();
      };
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

function parseCookieValue(cookieHeader: string, name: string): string | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));

  return match ? decodeURIComponent(match[1]) : null;
}
