"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import type { StoreSettings } from "@/lib/supabase";

const SESSION_KEY = "tantava-promo-modal-seen";

export default function PromoModal() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [welcomePercent, setWelcomePercent] = useState(0);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    Promise.all([
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/coupons/eligibility").then((r) => r.json()),
    ])
      .then(([settingsData, eligibility]: [StoreSettings, { eligible: boolean; percent: number }]) => {
        const hasPromo = settingsData.promo_modal_enabled && (settingsData.promo_modal_title || settingsData.promo_modal_message);
        const hasWelcome = eligibility.eligible && eligibility.percent > 0;
        if (!hasPromo && !hasWelcome) return;

        setSettings(settingsData);
        setWelcomePercent(hasWelcome ? eligibility.percent : 0);
        setOpen(true);
      })
      .catch(() => {});
  }, []);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem(SESSION_KEY, "1");
  };

  if (!open) return null;

  const hasPromo = settings?.promo_modal_enabled && (settings.promo_modal_title || settings.promo_modal_message);

  const title = hasPromo ? settings!.promo_modal_title || "Tantava" : "Welcome to Tantava";

  return (
    <div className="fixed bottom-4 right-4 z-[100] w-[calc(100vw-2rem)] max-w-sm">
      <div className="relative bg-surface rounded-2xl overflow-hidden shadow-2xl border border-outline/10">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
          aria-expanded={!collapsed}
        >
          <span className="font-headline-md text-headline-sm text-on-surface truncate">{title}</span>
          <span className="flex items-center gap-1 shrink-0">
            {collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            <span
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="p-1.5 rounded-full text-on-surface hover:text-primary transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </span>
          </span>
        </button>

        {!collapsed && (
          <div className="px-4 pb-4">
            {hasPromo && settings!.promo_modal_image && (
              <div className="relative w-full aspect-[16/9] rounded-lg mb-3 overflow-hidden">
                <Image src={settings!.promo_modal_image} alt="" fill sizes="400px" className="object-cover" />
              </div>
            )}

            {hasPromo && settings!.promo_modal_message && (
              <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-wrap">
                {settings!.promo_modal_message}
              </p>
            )}

            {welcomePercent > 0 && (
              <div className="flex items-center gap-2 mt-3 px-3 py-2.5 bg-secondary/10 border border-secondary/30 rounded-lg text-secondary font-label-md text-label-sm">
                <Sparkles size={16} className="shrink-0" />
                <span>Get {welcomePercent}% off your first order — applied automatically at checkout</span>
              </div>
            )}

            {hasPromo && settings!.promo_modal_button_text && settings!.promo_modal_button_link ? (
              <Link
                href={settings!.promo_modal_button_link}
                onClick={close}
                className="block text-center mt-4 px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md tracking-wide hover:opacity-90 transition-opacity"
              >
                {settings!.promo_modal_button_text}
              </Link>
            ) : (
              <Link
                href="/shop"
                onClick={close}
                className="block text-center mt-4 px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md tracking-wide hover:opacity-90 transition-opacity"
              >
                Shop Now
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
