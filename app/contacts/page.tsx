"use client";

import { SITE } from "@/lib/constants";
import { useI18n } from "@/components/I18nProvider";

export default function ContactsPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <p className="kicker">{t("contacts.kicker")}</p>
      <h1 className="font-serif mt-2 text-5xl">{t("contacts.title")}</h1>
      <div className="mt-10 grid gap-px bg-[var(--line)] md:grid-cols-2">
        <div className="bg-[var(--surface)] p-8">
          <h2 className="text-xl font-semibold">{t("contacts.support")}</h2>
          <p className="mt-3 leading-8 text-[var(--ink-soft)]">{t("contacts.supportLead")}</p>
          <a href={SITE.telegramUrl} className="btn btn-dark mt-4 inline-flex" target="_blank" rel="noreferrer">
            @{SITE.telegram}
          </a>
        </div>
        <div className="bg-[var(--surface)] p-8">
          <h2 className="text-xl font-semibold">{t("contacts.track")}</h2>
          <p className="mt-3 leading-8 text-[var(--ink-soft)]">{t("contacts.trackLead")}</p>
          <a href={`tel:${SITE.trackingPhone}`} className="mt-4 block text-3xl font-semibold">
            {SITE.trackingPhoneDisplay}
          </a>
        </div>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold">{t("contacts.yerevan")}</h3>
          <p className="mt-2 text-[var(--ink-soft)]">{t("contacts.yerevanAddr")}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">{t("contacts.moscow")}</h3>
          <p className="mt-2 text-[var(--ink-soft)]">{t("contacts.moscowAddr")}</p>
        </div>
      </div>
    </div>
  );
}
