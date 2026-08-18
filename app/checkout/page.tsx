"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SITE } from "@/lib/constants";
import { DELIVERY_RUB, FREE_DELIVERY_RUB, priceRub } from "@/lib/pricing";
import { useI18n } from "@/components/I18nProvider";
import { useStore } from "@/components/StoreProvider";

const empty = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  country: "russia" as "russia" | "armenia",
  city: "",
  address: "",
  comment: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { t, formatPrice } = useI18n();
  const { cart, products, clearCart } = useStore();
  const [customer, setCustomer] = useState(empty);
  const [deliveryMethod, setDeliveryMethod] = useState<"courier" | "pickup" | "cdek">("courier");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "transfer">("cod");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const lines = cart
    .map((item) => ({ item, product: products.find((p) => p.id === item.productId) }))
    .filter((line) => line.product);
  const subtotal = lines.reduce((sum, line) => sum + priceRub(line.product!, line.item.size) * line.item.quantity, 0);
  const deliveryPrice = deliveryMethod === "pickup" ? 0 : subtotal >= FREE_DELIVERY_RUB ? 0 : DELIVERY_RUB;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, customer, deliveryMethod, paymentMethod }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      setError(data.error || t("checkout.error"));
      return;
    }
    clearCart();
    router.push(`/order/${data.id}`);
  }

  if (!cart.length) {
    return <div className="px-8 py-24 text-center">{t("checkout.empty")}</div>;
  }

  const fields = [
    ["firstName", "checkout.firstName"],
    ["lastName", "checkout.lastName"],
    ["phone", "checkout.phone"],
    ["email", "checkout.email"],
    ["city", "checkout.city"],
    ["address", "checkout.address"],
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
      <h1 className="font-serif text-5xl">{t("checkout.title")}</h1>
      <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
        {t("checkout.lead", { phone: SITE.trackingPhoneDisplay, telegram: SITE.telegram })}
      </p>
      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([key, label]) => (
            <label key={key} className="flex flex-col gap-1 text-sm">
              {t(label)}
              <input
                required
                className="field"
                value={customer[key]}
                onChange={(e) => setCustomer({ ...customer, [key]: e.target.value })}
              />
            </label>
          ))}
          <label className="flex flex-col gap-1 text-sm">
            {t("checkout.country")}
            <select
              className="field"
              value={customer.country}
              onChange={(e) => setCustomer({ ...customer, country: e.target.value as "russia" | "armenia" })}
            >
              <option value="russia">{t("origin.russia")}</option>
              <option value="armenia">{t("origin.armenia")}</option>
            </select>
          </label>
          <label className="sm:col-span-2 flex flex-col gap-1 text-sm">
            {t("checkout.comment")}
            <textarea className="field min-h-24" value={customer.comment} onChange={(e) => setCustomer({ ...customer, comment: e.target.value })} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            {t("checkout.delivery")}
            <select className="field" value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value as typeof deliveryMethod)}>
              <option value="courier">{t("checkout.courier")}</option>
              <option value="cdek">{t("checkout.cdek")}</option>
              <option value="pickup">{t("checkout.pickup")}</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            {t("checkout.payment")}
            <select className="field" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}>
              <option value="cod">{t("checkout.cod")}</option>
              <option value="card">{t("checkout.card")}</option>
              <option value="transfer">{t("checkout.transfer")}</option>
            </select>
          </label>
        </div>
        <aside className="h-fit border border-[var(--line)] bg-[var(--surface)] p-6">
          <p className="text-xl font-semibold">{t("checkout.total")}</p>
          <p className="mt-4 flex justify-between text-sm">
            <span>{t("checkout.items")}</span>
            <span>{formatPrice(subtotal)}</span>
          </p>
          <p className="mt-2 flex justify-between text-sm">
            <span>{t("checkout.shipCost")}</span>
            <span>{deliveryPrice ? formatPrice(deliveryPrice) : t("checkout.free")}</span>
          </p>
          <p className="mt-4 flex justify-between text-lg font-semibold">
            <span>{t("checkout.pay")}</span>
            <span>{formatPrice(subtotal + deliveryPrice)}</span>
          </p>
          {error && <p className="mt-3 text-sm text-[var(--pomegranate)]">{error}</p>}
          <button disabled={pending} className="btn btn-dark mt-6 w-full">
            {pending ? t("checkout.sending") : t("checkout.submit")}
          </button>
        </aside>
      </form>
    </div>
  );
}
