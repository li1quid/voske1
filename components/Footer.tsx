"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, SITE } from "@/lib/constants";
import { LanguageSwitch, useI18n } from "./I18nProvider";

export function Footer() {
  const pathname = usePathname();
  const { t } = useI18n();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-4 md:px-8">
        <div>
          <p className="font-serif text-3xl tracking-[0.28em]">VOSKE</p>
          <p className="mt-1 text-[10px] tracking-[0.4em] text-[var(--ink-soft)]">ՈՍԿԵ</p>
          <p className="mt-5 max-w-xs text-sm leading-7 text-[var(--ink-soft)]">{t("footer.blurb")}</p>
          <div className="mt-6">
            <LanguageSwitch />
          </div>
        </div>
        <div>
          <p className="kicker mb-5">{t("nav.catalog")}</p>
          <div className="flex flex-col gap-2.5 text-sm text-[var(--ink-soft)]">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} href={`/catalog?category=${cat.id}`} className="hover:text-[var(--ink)]">
                {t(`cat.${cat.id}`)}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="kicker mb-5">{t("footer.house")}</p>
          <div className="flex flex-col gap-2.5 text-sm text-[var(--ink-soft)]">
            <Link href="/about" className="hover:text-[var(--ink)]">{t("footer.about")}</Link>
            <Link href="/gold" className="hover:text-[var(--ink)]">{t("footer.gold")}</Link>
            <Link href="/delivery" className="hover:text-[var(--ink)]">{t("footer.delivery")}</Link>
            <Link href="/contacts" className="hover:text-[var(--ink)]">{t("footer.contacts")}</Link>
            <Link href="/admin" className="hover:text-[var(--ink)]">{t("footer.admin")}</Link>
          </div>
        </div>
        <div>
          <p className="kicker mb-5">{t("footer.connect")}</p>
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            {t("footer.tg")}
            <br />
            <a className="text-[var(--ink)] underline underline-offset-4" href={SITE.telegramUrl} target="_blank" rel="noreferrer">
              @{SITE.telegram}
            </a>
          </p>
          <p className="mt-5 text-sm leading-7 text-[var(--ink-soft)]">
            {t("footer.track")}
            <br />
            <a className="text-[var(--ink)]" href={`tel:${SITE.trackingPhone}`}>
              {SITE.trackingPhoneDisplay}
            </a>
          </p>
          <p className="mt-5 text-sm text-[var(--ink-soft)]">{t("footer.cities")}</p>
        </div>
      </div>
      <div className="border-t border-[var(--line)] px-4 py-4 text-center text-[11px] text-[var(--ink-soft)]">
        {t("footer.copy", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
