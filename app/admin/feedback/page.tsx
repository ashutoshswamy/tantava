"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageSquareHeart } from "lucide-react";

type Feedback = {
  id: string;
  created_at: string;
  name: string;
  phone: string | null;
  email: string | null;
  state: string | null;
  city: string | null;
  about: string;
};

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((data) => {
        setFeedbacks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-[#1a0914]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-bold text-[#1a0914] tracking-tight">Customer Feedback</h1>
          <p className="text-[#8c5971] text-[13px] mt-0.5">{feedbacks.length} responses</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 size={36} className="text-[#c2477f] animate-spin" />
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-24">
          <MessageSquareHeart size={40} className="mx-auto mb-3 text-[#dbb6ca]" />
          <p className="text-[#8c5971] text-[14px] font-medium">No feedback yet</p>
          <p className="text-[#dbb6ca] text-[12px] mt-1">Responses from customers will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-white border border-[#f2cfe3] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 hover:border-[#dbb6ca] transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#fdeaf2] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#c2477f] font-bold text-[14px]">{fb.name[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[14px] text-[#1a0914]">{fb.name}</p>
                    {(fb.city || fb.state) && (
                      <p className="text-[11px] text-[#8c5971]">
                        {[fb.city, fb.state].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-[#dbb6ca] whitespace-nowrap mt-0.5">
                  {new Date(fb.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>

              <p className="text-[13px] leading-relaxed text-[#52304a] border-l-2 border-[#f2cfe3] pl-3 italic">
                &ldquo;{fb.about}&rdquo;
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#fdeaf2] pt-3">
                {fb.email && (
                  <a href={`mailto:${fb.email}`} className="text-[11px] text-[#c2477f] hover:underline">
                    {fb.email}
                  </a>
                )}
                {fb.phone && (
                  <a href={`tel:${fb.phone}`} className="text-[11px] text-[#c2477f] hover:underline">
                    {fb.phone}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
