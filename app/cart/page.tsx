"use client";

import Image from "next/image";
import Link from "next/link";
import { FREE_DELIVERY_RUB, priceRub, weightForSize } from "@/lib/pricing";
import { productName } from "@/lib/product-i18n";
import { useI18n } from "@/components/I18nProvider";
import { useStore } from "@/components/StoreProvider";

export default function CartPage() {
  const { t, locale, formatPrice } = useI18n();
  const { cart, products, setQty, changeSize, removeFromCart } = useStore();
  const lines = cart
    .map((item) => ({ item, product: products.find((p) => p.id === item.productId) }))
    .filter((line): line is { item: (typeof cart)[0]; product: NonNullable<(typeof products)[0]> } => Boolean(line.product));
  const subtotal = lines.reduce((sum, line) => sum + priceRub(line.product, line.item.size) * line.item.quantity, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
      <h1 className="font-serif text-5xl">{t("cart.title")}</h1>
      {lines.length === 0 ? (
        <div className="py-16 text-center">
          <p>{t("cart.empty")}</p>
          <Link href="/catalog" className="btn btn-line mt-6 inline-flex">
            {t("cart.toCatalog")}
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-6">
            {lines.map(({ item, product }) => {
              const unit = priceRub(product, item.size);
              const grams = weightForSize(product, item.size);
              return (
                <div key={product.id + (item.size || "")} className="flex gap-4 border-b border-[var(--line)] pb-6">
                  <div className="relative h-28 w-24 overflow-hidden bg-[var(--muted)]">
                    <Image src={product.images[0]} alt={productName(product, locale)} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <Link href={`/product/${product.slug}`} className="text-lg font-medium">
                      {productName(product, locale)}
                    </Link>
                    <p className="text-sm opacity-60">
                      {product.purity} · {t("card.weight", { weight: grams })}
                    </p>
                    {product.sizes.length > 0 && (
                      <select
                        className="field mt-2 max-w-40 py-1"
                        value={item.size || ""}
                        onChange={(e) => changeSize(product.id, item.size, e.target.value)}
                      >
                        {product.sizes.map((s) => (
                          <option key={s} value={s}>
                            {s} · {formatPrice(priceRub(product, s))}
                          </option>
                        ))}
                      </select>
                    )}
                    <div className="mt-3 flex items-center gap-3">
                      <button onClick={() => setQty(product.id, item.quantity - 1, item.size)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => setQty(product.id, item.quantity + 1, item.size)}>+</button>
                      <button className="ml-4 text-sm underline" onClick={() => removeFromCart(product.id, item.size)}>
                        {t("cart.remove")}
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-semibold">{formatPrice(unit * item.quantity)}</div>
                </div>
              );
            })}
          </div>
          <aside className="h-fit border border-[var(--line)] bg-[var(--surface)] p-6">
            <p className="flex justify-between">
              <span>{t("cart.sum")}</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </p>
            <p className="mt-2 text-sm opacity-60">{t("cart.freeFrom", { amount: formatPrice(FREE_DELIVERY_RUB) })}</p>
            <Link href="/checkout" className="btn btn-dark mt-6 w-full">
              {t("cart.checkout")}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
