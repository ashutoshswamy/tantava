"use client";

import { useEffect, useState } from "react";
import type { Appointment } from "@/lib/supabase";
import { Loader2, CalendarDays, PartyPopper, Mail, CalendarRange } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  completed: "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

const OCCASION_LABELS: Record<string, string> = {
  office:   "Office Wear",
  festive:  "Festive Celebration",
  everyday: "Everyday Elegance",
  custom:   "Custom Sizing",
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((data) => {
        setAppointments(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const res = await fetch("/api/appointments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: status as Appointment["status"] } : a))
      );
    }
    setUpdating(null);
  };

  const filtered = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="p-8 text-white">
      <div className="mb-8">
        <h1 className="font-headline-lg text-[28px] text-white mb-1">Appointments</h1>
        <p className="text-white/40 text-[13px]">
          {appointments.filter((a) => a.status === "pending").length} pending • {appointments.length} total
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg font-label-md text-[12px] capitalize transition-colors ${
              filter === s
                ? "bg-[#C9A84C] text-black"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={48} className="text-[#C9A84C] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((appt) => (
            <div key={appt.id} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-label-md text-[15px]">{appt.name}</h3>
                  <p className="text-white/40 text-[12px] mt-0.5">{appt.phone}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full font-label-md text-[11px] capitalize border ${
                    STATUS_STYLES[appt.status] || "bg-white/5 text-white/40 border-white/10"
                  }`}
                >
                  {appt.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-white/50">
                  <CalendarDays size={16} />
                  <span className="font-label-md text-[12px]">
                    {new Date(appt.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {appt.occasion && (
                  <div className="flex items-center gap-2 text-white/50">
                    <PartyPopper size={16} />
                    <span className="font-label-md text-[12px]">
                      {OCCASION_LABELS[appt.occasion] || appt.occasion}
                    </span>
                  </div>
                )}
                {appt.email && (
                  <div className="flex items-center gap-2 text-white/50">
                    <Mail size={16} />
                    <span className="font-label-md text-[12px] truncate">{appt.email}</span>
                  </div>
                )}
              </div>

              {appt.message && (
                <p className="text-white/30 font-body-md text-[12px] mb-4 italic border-l-2 border-white/10 pl-3">
                  &ldquo;{appt.message}&rdquo;
                </p>
              )}

              <div className="flex gap-2">
                {appt.status === "pending" && (
                  <button
                    onClick={() => updateStatus(appt.id, "confirmed")}
                    disabled={updating === appt.id}
                    className="flex-1 py-2 bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30 rounded-lg font-label-md text-[12px] hover:bg-[#C9A84C]/25 transition-colors disabled:opacity-50"
                  >
                    Confirm
                  </button>
                )}
                {appt.status === "confirmed" && (
                  <button
                    onClick={() => updateStatus(appt.id, "completed")}
                    disabled={updating === appt.id}
                    className="flex-1 py-2 bg-green-500/15 text-green-400 border border-green-500/30 rounded-lg font-label-md text-[12px] hover:bg-green-500/25 transition-colors disabled:opacity-50"
                  >
                    Mark Complete
                  </button>
                )}
                {appt.status !== "cancelled" && appt.status !== "completed" && (
                  <button
                    onClick={() => updateStatus(appt.id, "cancelled")}
                    disabled={updating === appt.id}
                    className="py-2 px-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg font-label-md text-[12px] hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <p className="text-white/15 text-[10px] mt-3">
                Submitted {new Date(appt.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20 text-white/30">
              <CalendarRange size={48} className="mx-auto mb-2" />
              <p>No appointments found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
