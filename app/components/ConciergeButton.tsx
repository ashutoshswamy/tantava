"use client";

import { MessageCircle } from "lucide-react";

export default function ConciergeButton() {
  return (
    <a
      href="https://wa.me/910000000000"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center bg-secondary text-on-secondary shadow-lg rounded-full p-4 hover:scale-105 active:scale-95 transition-all group"
    >
      <div className="flex items-center gap-2">
        <MessageCircle size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-label-md text-label-md px-0 group-hover:px-2">
          Chat to Order
        </span>
      </div>
    </a>
  );
}
