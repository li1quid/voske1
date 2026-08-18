"use client";

import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, SITE } from "@/lib/constants";
import { ProductCard } from "@/components/ProductCard";
import { HomeVitrineCarousel } from "@/components/HomeVitrineCarousel";
import { useI18n } from "@/components/I18nProvider";
import { useStore } from "@/components/StoreProvider";

const CAT_IMG: Record<string, string> = {
  rings: "/images/product-ring-diamond.jpg",
  earrings: "/images/product-earrings-gold.jpg",
  necklaces: "/images/product-necklace-pomegranate.jpg",
  pendants: "/images/product-pendant-locket.jpg",
  bracelets: "/images/product-bracelet-tennis.jpg",
  chains: "/images/product-chain-figaro.jpg",
  crosses: "/images/product-cross-armenian.jpg",
  wedding: "/images/product-wedding-bands.jpg",
  kids: "/images/product-kids-earrings.jpg",
};

export default function HomePage() {
  const { t, formatPrice } = useI18n();
  const { products, loaded } = useStore();
  const hits = products.filter((p) => p.isHit).slice(0, 8);
  const armenian = products.filter((p) => p.origin === "armenia").slice(0, 4);
  const news = products.filter((p) => p.isNew).slice(0, 4);
  const minHit = loaded && hits.length ? formatPrice(Math.min(...hits.map((p) => p.price))) : formatPrice(9800);

  return (
    <div>
      <section className="grid min-h-[88vh] lg:grid-cols-2">
        <div className="relative min-h-[52vh] lg:min-h-[88vh]">
          <Image src="/images/voske-hero.jpg" alt="VOSKE" fill priority className="object-cover" />
        </div>
        <div className="flex flex-col justify-center bg-[var(--paper)] px-6 py-16 md:px-16 lg:px-20">
          <p className="kicker">{t("hero.kicker")}</p>
          <h1 className="font-serif mt-5 max-w-xl text-5xl leading-[0.92] md:text-7xl">{t("hero.title")}</h1>
          <p className="mt-6 max-w-md text-base leading-7 text-[var(--ink-soft)] md:text-lg">{t("hero.lead")}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/catalog" className="btn btn-dark">
              {t("hero.shop")}
            </Link>
            <Link href="/gold" className="btn btn-line">
              {t("hero.gold")}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between gap-6 px-4 md:px-8">
          <div>
            <p className="kicker">{t("home.categories")}</p>
            <h2 className="font-serif mt-2 text-4xl md:text-5xl">{t("home.vitrine")}</h2>
          </div>
          <Link href="/catalog" className="hidden text-xs font-semibold uppercase tracking-[0.16em] underline underline-offset-8 md:inline">
            {t("home.allHits")}
          </Link>
        </div>
        <HomeVitrineCarousel
          items={CATEGORIES.map((cat) => ({
            id: cat.id,
            href: `/catalog?category=${cat.id}`,
            image: CAT_IMG[cat.id] || "/images/voske-logo.jpg",
            label: t(`cat.${cat.id}`),
          }))}
        />
      </section>

      <section className="bg-[var(--paper)] py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="kicker">{t("home.hits")}</p>
              <h2 className="font-serif mt-2 text-4xl md:text-5xl">{t("home.hitsTitle")}</h2>
            </div>
            <Link href="/catalog?hit=1" className="text-xs font-semibold uppercase tracking-[0.16em] underline underline-offset-8">
              {t("home.allHits")}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
            {(loaded ? hits : []).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[480px]">
          <Image src="/images/voske-heritage.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-center bg-[#0b0b0b] px-8 py-20 text-white md:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">{t("home.heritage")}</p>
          <h2 className="font-serif mt-4 text-5xl leading-[0.95] md:text-6xl">{t("home.heritageTitle")}</h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-white/65">{t("home.heritageLead")}</p>
          <Link href="/catalog?origin=armenia" className="btn btn-ghost mt-10 w-fit">
            {t("home.openCollection")}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <p className="kicker">{t("home.news")}</p>
        <h2 className="font-serif mt-2 text-4xl md:text-5xl">{t("home.newsTitle")}</h2>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
          {(loaded ? (news.length ? news : products.slice(0, 4)) : []).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--paper)]">
        <div className="mx-auto grid max-w-7xl md:grid-cols-3">
          {[
            ["home.feature1", "home.feature1d"],
            ["home.feature2", "home.feature2d"],
            ["home.feature3", "home.feature3d"],
          ].map(([title, body], i) => (
            <div key={title} className={`px-6 py-12 md:px-10 ${i > 0 ? "border-t border-[var(--line)] md:border-t-0 md:border-l" : ""}`}>
              <p className="text-xs tracking-[0.18em] text-[var(--ink-soft)]">0{i + 1}</p>
              <h3 className="mt-3 text-lg font-medium">{t(title)}</h3>
              <p className="mt-3 leading-7 text-[var(--ink-soft)]">
                {t(body, { phone: SITE.trackingPhoneDisplay, telegram: SITE.telegram })}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative min-h-[52vh] overflow-hidden">
        <Image src="/images/voske-salon.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[52vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">{t("home.invite")}</p>
          <h2 className="font-serif mt-4 text-4xl md:text-6xl">{t("home.inviteTitle")}</h2>
          <p className="mt-5 text-white/75">{t("home.from", { price: minHit })}</p>
          <Link href="/contacts" className="btn btn-ghost mt-8">
            {t("home.contact")}
          </Link>
        </div>
      </section>

      {armenian.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <h2 className="font-serif mb-10 text-4xl md:text-5xl">{t("home.armenianAtelier")}</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
            {armenian.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
