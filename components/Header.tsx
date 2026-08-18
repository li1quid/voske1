"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, SITE } from "@/lib/constants";
import { productName } from "@/lib/product-i18n";
import { IconBag, IconClose, IconHeart, IconMenu, IconSearch, IconTelegram } from "./Icons";
import { LanguageSwitch, useI18n } from "./I18nProvider";
import { useStore } from "./StoreProvider";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/catalog", key: "nav.catalog" },
  { href: "/gold", key: "nav.gold" },
  { href: "/about", key: "nav.about" },
  { href: "/delivery", key: "nav.delivery" },
  { href: "/contacts", key: "nav.contacts" },
] as const;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, formatPrice } = useI18n();
  const { cart, favorites, products } = useStore();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return products
      .filter((p) =>
        [productName(p, locale), p.name, p.nameHy, p.nameEn, p.sku, p.inspiredBy]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 6);
  }, [products, query, locale]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden items-center justify-between border-b border-[var(--line)] bg-[var(--paper)] px-6 py-2 text-[11px] tracking-[0.08em] text-[var(--ink-soft)] md:flex">
        <p>Yerevan · Moscow</p>
        <div className="flex items-center gap-6">
          <Link href="/gold" className="hover:text-[var(--ink)]">
            {t("top.goldHint")}
          </Link>
          <a href={SITE.telegramUrl} className="inline-flex items-center gap-1 hover:text-[var(--ink)]" target="_blank" rel="noreferrer">
            <IconTelegram /> @{SITE.telegram}
          </a>
          <a href={`tel:${SITE.trackingPhone}`} className="hover:text-[var(--ink)]">
            {t("top.tracking")} {SITE.trackingPhoneDisplay}
          </a>
          <ThemeToggle />
        </div>
      </div>
      <div className="border-b border-[var(--line)] bg-[var(--glass)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <button className="p-2 hover:opacity-60 md:hidden" onClick={() => setOpen(true)} aria-label={t("nav.menu")}>
            <IconMenu />
          </button>
          <Link href="/" className="flex items-center gap-3">
            <span className="leading-none">
              <span className="font-serif block text-[1.65rem] tracking-[0.28em] md:text-[1.8rem]">VOSKE</span>
              <span className="mt-0.5 block text-[9px] tracking-[0.42em] text-[var(--ink-soft)]">ՈՍԿԵ</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-[12px] font-medium tracking-[0.08em] md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "text-[var(--ink)]" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <div className="hidden sm:block">
              <LanguageSwitch />
            </div>
            <ThemeToggle className="md:hidden" />
            <button onClick={() => setSearchOpen(true)} aria-label={t("nav.search")} className="p-2 hover:opacity-60">
              <IconSearch />
            </button>
            <Link href="/favorites" className="relative p-2 hover:opacity-60" aria-label={t("nav.favorites")}>
              <IconHeart filled={favorites.length > 0} />
              {favorites.length > 0 && (
                <span className="absolute right-0 top-0 h-4 min-w-4 bg-[var(--pomegranate)] px-1 text-[10px] leading-4 text-white">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative p-2 hover:opacity-60" aria-label={t("nav.cart")}>
              <IconBag />
              {count > 0 && (
                <span className="absolute right-0 top-0 h-4 min-w-4 bg-[var(--ink)] px-1 text-[10px] leading-4 text-[var(--paper)]">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/40 md:hidden" onClick={() => setOpen(false)}>
          <div className="h-full w-[84%] max-w-sm bg-[var(--paper)] p-7" onClick={(e) => e.stopPropagation()}>
            <div className="mb-10 flex items-center justify-between">
              <span className="font-serif text-2xl tracking-[0.28em]">VOSKE</span>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <IconClose />
              </button>
            </div>
            <LanguageSwitch />
            <div className="mt-10 flex flex-col gap-5 text-lg">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href}>
                  {t(item.key)}
                </Link>
              ))}
              {CATEGORIES.map((cat) => (
                <Link key={cat.id} href={`/catalog?category=${cat.id}`} className="text-sm text-[var(--ink-soft)]">
                  {t(`cat.${cat.id}`)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[70] bg-black/30 p-4" onClick={() => setSearchOpen(false)}>
          <div className="panel mx-auto mt-24 max-w-xl p-8" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search.placeholder")}
              className="w-full border-b border-[var(--line)] bg-transparent py-3 text-xl outline-none"
            />
            <div className="mt-4 flex flex-col">
              {results.map((product) => (
                <button
                  key={product.id}
                  className="flex items-center justify-between py-3 text-left hover:opacity-50"
                  onClick={() => router.push(`/product/${product.slug}`)}
                >
                  <span>{productName(product, locale)}</span>
                  <span className="text-sm text-[var(--ink-soft)]">{formatPrice(product.price)}</span>
                </button>
              ))}
              {query.length >= 2 && results.length === 0 && <p className="py-6 text-sm opacity-60">{t("search.empty")}</p>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
