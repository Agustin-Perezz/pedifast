"use client";

import { useEffect, useMemo, useState } from "react";
import type { PendingWhatsappOrder } from "@/app/[shopName]/pedir/lib/whatsapp";
import { buildWhatsappMessage } from "@/app/[shopName]/pedir/lib/whatsapp";
import { isSafariBrowser } from "@/lib/utils/browser";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";

type UseReceiptStateInput = {
  readonly orderId: string;
  readonly verifiedStatus: string;
  readonly isDashboardFlow: boolean;
};

type ReceiptState = {
  readonly order: PendingWhatsappOrder | null;
  readonly orderDate: Date;
  readonly backUrl: string;
  readonly isConfirmed: boolean;
  readonly whatsappUrl: string | null;
};

const ORDER_KEY_PREFIX = "order-";

export function useReceiptState({
  orderId,
  verifiedStatus,
  isDashboardFlow,
}: UseReceiptStateInput): ReceiptState {
  const [order, setOrder] = useState<PendingWhatsappOrder | null>(null);

  useEffect(() => {
    if (isDashboardFlow) {
      return;
    }

    const stored = localStorage.getItem(`${ORDER_KEY_PREFIX}${orderId}`);
    setOrder(stored ? safeParse(stored) : null);
  }, [isDashboardFlow, orderId]);

  const orderDate = useMemo(() => {
    const timestamp = Number(orderId.slice(orderId.lastIndexOf("-") + 1));
    return Number.isNaN(timestamp) ? new Date() : new Date(timestamp);
  }, [orderId]);

  const backUrl = order
    ? `/${order.shopName}/pedir`
    : orderId.includes("-")
      ? `/${orderId.slice(0, orderId.lastIndexOf("-"))}/pedir`
      : "/";

  const isConfirmed =
    verifiedStatus === "efectivo" || verifiedStatus === "approved";

  const whatsappUrl = useMemo(() => {
    if (isDashboardFlow || !isConfirmed || !order) {
      return null;
    }

    return buildWhatsappUrl(order.whatsappPhone, buildWhatsappMessage(order));
  }, [isDashboardFlow, isConfirmed, order]);

  useEffect(() => {
    if (!whatsappUrl) {
      return;
    }

    localStorage.removeItem(`${ORDER_KEY_PREFIX}${orderId}`);

    if (isSafariBrowser()) {
      window.location.href = whatsappUrl;
    } else {
      window.open(whatsappUrl, "_blank");
    }
  }, [whatsappUrl, orderId]);

  return { order, orderDate, backUrl, isConfirmed, whatsappUrl };
}

function safeParse(raw: string): PendingWhatsappOrder | null {
  try {
    return JSON.parse(raw) as PendingWhatsappOrder;
  } catch {
    return null;
  }
}
