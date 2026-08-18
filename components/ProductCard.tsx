"use client";

import Image from "next/image";
import Link from "next/link";
import { COLLECTION_KEY } from "@/lib/i18n";
import { discountPercent } from "@/lib/format";
import { oldPriceRub, priceRub } from "@/lib/pricing";
import { productName } from "@/lib/product-i18n";
import type { Product } from "@/lib/types";
import { IconHeart } from "./Icons";
import { useI18n } from "./I18nProvider";
import { useStore } from "./StoreProvider";

export function ProductCard({ product }: { product: Product }) {
  const { t, locale, formatPrice } = useI18n();
  const { favorites, toggleFavorite } = useStore();
  const loved = favorites.includes(product.id);
  const unit = product.sizes.length
    ? Math.min(...product.sizes.map((s) => priceRub(product, s)))
    : priceRub(product);
  const was = oldPriceRub(product);
  const sale = discountPercent(priceRub(product), was);
  const name = productName(product, locale);
  const colKey = COLLECTION_KEY[product.collection];
  const from = product.sizes.length > 1;

  return (
    <article className="product-card group relative flex flex-col">
      <Link href={`/product/${product.slug}`} className="relative overflow-hidden bg-[var(--muted)]">
        <div className="relative aspect-[4/5]">
          <Image
            src={product.images[0] || "/images/voske-logo.jpg"}
            alt={name}
            fill
            className="product-card-image object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.isHit && (
            <span className="bg-[var(--ink)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--paper)]">
              {t("badge.hit")}
            </span>
          )}
          {product.isNew && (
            <span className="bg-[var(--paper)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">
              {t("badge.new")}
            </span>
          )}
          {sale > 0 && (
            <span className="bg-[var(--paper)]/90 px-2 py-1 text-[10px] font-semibold text-[var(--ink)]">−{sale}%</span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
          className="absolute right-3 top-3 bg-[var(--paper)]/90 p-2 opacity-100 transition md:opacity-0 md:group-hover:opacity-100"
          aria-label={t("nav.favorites")}
        >
          <IconHeart filled={loved} />
        </button>
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--ink-soft)]">
          {t(`metal.${product.metal}`)} · {product.purity}
        </p>
        <Link href={`/product/${product.slug}`} className="mt-1 text-[0.98rem] font-medium leading-snug">
          {name}
        </Link>
        <p className="mt-1 text-xs text-[var(--ink-soft)]">
          {t("card.inspired", { brand: product.inspiredBy })}
          {colKey ? ` · ${t(`col.${colKey}`)}` : ""}
        </p>
        <div className="mt-auto flex items-end gap-2 pt-3">
          <span className="text-base font-medium">
            {from ? t("product.from", { price: formatPrice(unit) }) : formatPrice(unit)}
          </span>
          {was ? <span className="text-sm text-[var(--ink-soft)] line-through">{formatPrice(was)}</span> : null}
        </div>
      </div>
    </article>
  );
}
