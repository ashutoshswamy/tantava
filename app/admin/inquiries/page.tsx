"use client";

import { useEffect, useState } from "react";
import { Loader2, Inbox, Mail } from "lucide-react";

const SUBJECT_LABELS: Record<string, string> = {
  bespoke: "Bespoke Order",
  collaboration: "Collaboration",
  other: "General Inquiry",
};

const SUBJECT_COLORS: Record<string, string> = {
  bespoke: "#c2477f",
  collaboration: "#7952a0",
  other: "#3b82f6",
};

type Inquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inquiries")
      .then((r) => r.json())
      .then((data) => {
        setInquiries(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-[#1a0914]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-bold text-[#1a0914] tracking-tight">Inquiries</h1>
          <p className="text-[#8c5971] text-[13px] mt-0.5">{inquiries.length} submissions</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 size={36} className="text-[#c2477f] animate-spin" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-24">
          <Inbox size={40} className="mx-auto mb-3 text-[#dbb6ca]" />
          <p className="text-[#8c5971] text-[14px] font-medium">No inquiries yet</p>
          <p className="text-[#dbb6ca] text-[12px] mt-1">Contact form submissions will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {inquiries.map((inq) => {
            const color = SUBJECT_COLORS[inq.subject] ?? "#8c5971";
            return (
              <div key={inq.id} className="bg-white border border-[#f2cfe3] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 hover:border-[#dbb6ca] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                      <span className="font-bold text-[14px]" style={{ color }}>{inq.name[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[14px] text-[#1a0914]">{inq.name}</p>
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ backgroundColor: `${color}15`, color }}
                      >
                        {SUBJECT_LABELS[inq.subject] ?? inq.subject}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#dbb6ca] whitespace-nowrap mt-0.5">
                    {new Date(inq.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>

                <p className="text-[13px] leading-relaxed text-[#52304a] border-l-2 border-[#f2cfe3] pl-3">
                  {inq.message}
                </p>

                <div className="border-t border-[#fdeaf2] pt-3">
                  <a
                    href={`mailto:${inq.email}`}
                    className="inline-flex items-center gap-1.5 text-[11px] text-[#c2477f] hover:underline"
                  >
                    <Mail size={11} />
                    {inq.email}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
