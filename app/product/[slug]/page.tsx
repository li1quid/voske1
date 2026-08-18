"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { COLLECTION_KEY, STONE_KEY } from "@/lib/i18n";
import { discountPercent } from "@/lib/format";
import { defaultSize, oldPriceRub, priceRub, weightForSize } from "@/lib/pricing";
import { productDescription, productName, productReviewText } from "@/lib/product-i18n";
import { IconHeart } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";
import { useI18n } from "@/components/I18nProvider";
import { useStore } from "@/components/StoreProvider";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale, formatPrice } = useI18n();
  const { products, addToCart, favorites, toggleFavorite } = useStore();
  const product = products.find((p) => p.slug === slug);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const related = useMemo(
    () => products.filter((p) => product && p.id !== product.id && (p.category === product.category || p.collection === product.collection)).slice(0, 4),
    [products, product],
  );

  useEffect(() => {
    if (!product) return;
    setSize(defaultSize(product));
    setQty(1);
  }, [product]);

  if (!product) {
    return <div className="px-8 py-24 text-center">{t("product.loading")}</div>;
  }

  const unit = priceRub(product, size || undefined);
  const was = oldPriceRub(product, size || undefined);
  const grams = weightForSize(product, size || undefined);
  const sale = discountPercent(unit, was);
  const loved = favorites.includes(product.id);
  const needsSize = product.sizes.length > 0;
  const name = productName(product, locale);
  const colKey = COLLECTION_KEY[product.collection];
  const stones = product.stones.map((s) => (STONE_KEY[s] ? t(`stone.${STONE_KEY[s]}`) : s)).join(", ");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <p className="text-sm text-[var(--ink-soft)]">
        <Link href="/catalog">{t("nav.catalog")}</Link> / {name}
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden bg-[var(--muted)]">
          <Image src={product.images[0] || "/images/voske-logo.jpg"} alt={name} fill className="object-cover" priority />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">
            {colKey ? t(`col.${colKey}`) : product.collection} · {t(`origin.${product.origin}`)}
          </p>
          <h1 className="font-serif mt-2 text-4xl md:text-5xl">{name}</h1>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            {t("card.inspired", { brand: product.inspiredBy })} · {t("product.sku", { article: product.article, sku: product.sku })}
          </p>
          <div className="mt-6 flex items-end gap-3">
            <span className="text-3xl font-semibold">{formatPrice(unit)}</span>
            {was ? <span className="text-lg line-through opacity-40">{formatPrice(was)}</span> : null}
            {sale > 0 && <span className="bg-[var(--ink)] px-2 py-1 text-xs text-[var(--paper)]">−{sale}%</span>}
          </div>
          {size && needsSize && (
            <p className="mt-2 text-sm text-[var(--ink-soft)]">{t("product.sizePrice", { size })}</p>
          )}
          <p className="mt-6 leading-8 text-[var(--ink-soft)]">{productDescription(product, locale)}</p>

          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="opacity-50">{t("product.metal")}</dt><dd>{t(`metal.${product.metal}`)}</dd></div>
            <div><dt className="opacity-50">{t("product.purity")}</dt><dd>{product.purity}</dd></div>
            <div><dt className="opacity-50">{t("product.weight")}</dt><dd>{t("card.weight", { weight: grams })}</dd></div>
            <div><dt className="opacity-50">{t("product.stones")}</dt><dd>{stones || t("product.noStones")}</dd></div>
            <div><dt className="opacity-50">{t("product.warranty")}</dt><dd>{t("product.months", { n: product.warrantyMonths })}</dd></div>
            <div><dt className="opacity-50">{t("product.stock")}</dt><dd>{product.inStock ? t("product.inStock", { n: product.stockCount }) : t("product.out")}</dd></div>
          </dl>

          {needsSize && (
            <div className="mt-8">
              <p className="mb-2 text-sm">{t("product.size")}</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const sizedPrice = priceRub(product, s);
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-16 border px-3 py-2 text-left ${size === s ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--line)] bg-[var(--surface)]"}`}
                    >
                      <span className="block text-sm font-semibold">{s}</span>
                      <span className={`block text-[11px] ${size === s ? "text-[var(--paper)]/70" : "text-[var(--ink-soft)]"}`}>
                        {formatPrice(sizedPrice)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex border border-[var(--line)] bg-[var(--surface)]">
              <button className="px-4 py-3" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="px-2 py-3">{qty}</span>
              <button className="px-4 py-3" onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button
              disabled={!product.inStock || (needsSize && !size)}
              onClick={() => addToCart({ productId: product.id, quantity: qty, size: size || undefined })}
              className="btn btn-dark disabled:opacity-40"
            >
              {t("product.add")} · {formatPrice(unit * qty)}
            </button>
            <button onClick={() => toggleFavorite(product.id)} className="border border-[var(--line)] bg-[var(--surface)] p-3" aria-label={t("nav.favorites")}>
              <IconHeart filled={loved} />
            </button>
          </div>
          {needsSize && !size && <p className="mt-2 text-sm text-[var(--pomegranate)]">{t("product.chooseSize")}</p>}

          <div className="mt-10 border-t border-[var(--line)] pt-6 text-sm leading-7 text-[var(--ink-soft)]">
            <p>{t("product.ship")}</p>
            <p>{t("product.return")}</p>
          </div>
        </div>
      </div>

      {product.reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-3xl">{t("product.reviews", { rating: product.rating })}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {product.reviews.map((review, index) => (
              <blockquote key={review.author + review.date} className="border border-[var(--line)] bg-[var(--surface)] p-6">
                <p className="text-sm font-medium">{review.author} · {review.city}</p>
                <p className="mt-3 leading-7">{productReviewText(product, review, index, locale)}</p>
                <p className="mt-3 text-xs opacity-50">{review.date} · {review.rating}/5</p>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-3xl">{t("product.related")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
