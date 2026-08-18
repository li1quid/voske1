"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import type { Order } from "@/lib/types";
import { useI18n } from "@/components/I18nProvider";

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const { t, dateLocale, formatPrice } = useI18n();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then(setOrder);
  }, [id]);

  if (!order?.number) {
    return <div className="px-8 py-24 text-center">{t("order.loading")}</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="kicker">{t("order.accepted")}</p>
      <h1 className="font-serif mt-3 text-5xl">{order.number}</h1>
      <p className="mt-4 text-[var(--ink-soft)]">{formatDateTime(order.createdAt, dateLocale)}</p>
      <div className="mt-10 border border-[var(--line)] bg-[var(--surface)] p-8 text-left">
        <p className="leading-8">{t("order.thanks", { name: order.customer.firstName })}</p>
        <a href={`tel:${SITE.trackingPhone}`} className="mt-4 block text-4xl font-semibold tracking-wide">
          {SITE.trackingPhoneDisplay}
        </a>
        <p className="mt-6 leading-8">
          {t("order.support")}{" "}
          <a className="underline underline-offset-4" href={SITE.telegramUrl} target="_blank" rel="noreferrer">
            @{SITE.telegram}
          </a>
        </p>
        <ul className="mt-6 space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={item.productId + (item.size || "")} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between text-lg font-semibold">
          <span>{t("order.total")}</span>
          <span>{formatPrice(order.total)}</span>
        </p>
      </div>
      <Link href="/catalog" className="btn btn-line mt-10 inline-flex">
        {t("order.back")}
      </Link>
    </div>
  );
}
