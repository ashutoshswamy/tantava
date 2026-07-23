"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";
import type { StoreSettings } from "@/lib/supabase";

const SESSION_KEY = "tantava-promo-modal-seen";

export default function PromoModal() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [welcomePercent, setWelcomePercent] = useState(0);
  const [open, setOpen] = useState(false);

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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/60 backdrop-blur-sm p-4"
      onClick={close}
    >
      <div
        className="relative bg-surface rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-3 right-3 z-10 p-2 bg-surface/90 rounded-full text-on-surface hover:text-primary transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {hasPromo && settings!.promo_modal_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings!.promo_modal_image} alt="" className="w-full aspect-[16/9] object-cover" />
        )}

        <div className="p-6 sm:p-8 text-center">
          {hasPromo ? (
            <>
              {settings!.promo_modal_title && (
                <h2 className="font-headline-md text-headline-md text-on-surface mb-3">
                  {settings!.promo_modal_title}
                </h2>
              )}
              {settings!.promo_modal_message && (
                <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-wrap">
                  {settings!.promo_modal_message}
                </p>
              )}
            </>
          ) : (
            <h2 className="font-headline-md text-headline-md text-on-surface mb-3">Welcome to Tantava</h2>
          )}

          {welcomePercent > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-secondary/10 border border-secondary/30 rounded-lg text-secondary font-label-md text-label-md">
              <Sparkles size={16} />
              <span>Get {welcomePercent}% off your first order — applied automatically at checkout</span>
            </div>
          )}

          {hasPromo && settings!.promo_modal_button_text && settings!.promo_modal_button_link ? (
            <Link
              href={settings!.promo_modal_button_link}
              onClick={close}
              className="inline-block mt-6 px-8 py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md tracking-wide hover:opacity-90 transition-opacity"
            >
              {settings!.promo_modal_button_text}
            </Link>
          ) : (
            <Link
              href="/shop"
              onClick={close}
              className="inline-block mt-6 px-8 py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md tracking-wide hover:opacity-90 transition-opacity"
            >
              Shop Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
