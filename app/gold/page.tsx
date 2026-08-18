"use client";

import { useEffect, useMemo, useState } from "react";
import { formatAmd, formatDateTime, formatNumber, formatRub, formatUsd } from "@/lib/format";
import type { GoldSnapshot } from "@/lib/types";
import { useI18n } from "@/components/I18nProvider";

export default function GoldPage() {
  const { t, dateLocale } = useI18n();
  const [gold, setGold] = useState<GoldSnapshot | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [weight, setWeight] = useState("5");
  const [purity, setPurity] = useState<"999" | "750" | "585" | "375">("585");

  async function loadStored() {
    const res = await fetch("/api/gold", { cache: "no-store" });
    const data = await res.json();
    setGold(data.gold);
  }

  useEffect(() => {
    loadStored();
  }, []);

  async function refresh() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/gold/refresh", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || t("gold.error"));
      return;
    }
    setGold(data);
    window.dispatchEvent(new Event("voske-rates"));
  }

  const calc = useMemo(() => {
    if (!gold) return null;
    const grams = Number(weight.replace(",", ".")) || 0;
    const gram = gold.perGram[purity];
    return { rub: gram.rub * grams, amd: gram.amd * grams, usd: gram.usd * grams };
  }, [gold, weight, purity]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <p className="kicker">{t("gold.kicker")}</p>
      <h1 className="font-serif mt-2 text-5xl">{t("gold.title")}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">{t("gold.lead")}</p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button onClick={refresh} disabled={loading} className="btn btn-dark disabled:opacity-50">
          {loading ? t("gold.loading") : t("gold.refresh")}
        </button>
        {gold ? (
          <p className="text-sm text-[var(--ink-soft)]">
            {t("gold.last", { time: formatDateTime(gold.updatedAt, dateLocale), source: gold.source })}
          </p>
        ) : (
          <p className="text-sm text-[var(--ink-soft)]">{t("gold.none")}</p>
        )}
      </div>
      {error && <p className="mt-3 text-[var(--pomegranate)]">{error}</p>}

      {gold && (
        <>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="bg-[#0b0b0b] p-6 text-white">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">XAU / USD</p>
              <p className="mt-2 text-4xl font-semibold">{formatUsd(gold.xauUsdPerOz)}</p>
              <p className="mt-2 text-sm text-white/50">{t("gold.oz")}</p>
            </div>
            <div className="border border-[var(--line)] bg-[var(--surface)] p-6">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink-soft)]">USD / RUB</p>
              <p className="mt-2 text-4xl font-semibold">{formatNumber(gold.usdRub, 2)}</p>
            </div>
            <div className="border border-[var(--line)] bg-[var(--surface)] p-6">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink-soft)]">USD / AMD</p>
              <p className="mt-2 text-4xl font-semibold">{formatNumber(gold.usdAmd, 2)}</p>
            </div>
          </div>

          <div className="mt-10 overflow-x-auto border border-[var(--line)] bg-[var(--surface)] px-6">
            <table className="w-full min-w-[640px] text-left">
              <thead className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-soft)]">
                <tr>
                  <th className="py-4">{t("gold.purity")}</th>
                  <th>₽ / g</th>
                  <th>֏ / g</th>
                  <th>$ / g</th>
                </tr>
              </thead>
              <tbody>
                {(["999", "750", "585", "375"] as const).map((key) => (
                  <tr key={key} className="border-t border-[var(--line)]">
                    <td className="py-4 text-2xl font-semibold">{key}</td>
                    <td>{formatRub(gold.perGram[key].rub)}</td>
                    <td>{formatAmd(gold.perGram[key].amd)}</td>
                    <td>{formatUsd(gold.perGram[key].usd, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section className="mt-12 border border-[var(--line)] bg-[var(--surface)] p-8">
            <h2 className="font-serif text-3xl">{t("gold.calc")}</h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">{t("gold.calcLead")}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <label className="text-sm">
                {t("gold.grams")}
                <input className="field mt-1" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </label>
              <label className="text-sm">
                {t("gold.purity")}
                <select className="field mt-1" value={purity} onChange={(e) => setPurity(e.target.value as typeof purity)}>
                  <option value="999">999</option>
                  <option value="750">750</option>
                  <option value="585">585</option>
                  <option value="375">375</option>
                </select>
              </label>
              {calc && (
                <div>
                  <p className="text-sm opacity-60">{t("gold.metalValue")}</p>
                  <p className="text-3xl font-semibold">{formatRub(calc.rub)}</p>
                  <p className="text-sm">{formatAmd(calc.amd)} · {formatUsd(calc.usd)}</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
