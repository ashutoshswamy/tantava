"use client";

import { useEffect, useState } from "react";
import type { Appointment } from "@/lib/supabase";
import { Loader2, CalendarDays, PartyPopper, Mail, CalendarRange } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const OCCASION_LABELS: Record<string, string> = {
  office:   "Office Wear",
  festive:  "Festive Celebration",
  everyday: "Everyday Elegance",
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
    <div className="p-4 sm:p-6 lg:p-8 text-[#21101a]">
      <div className="mb-8">
        <h1 className="font-headline-lg text-[28px] text-[#21101a] mb-1">Appointments</h1>
        <p className="text-[#8c5971] text-[13px]">
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
                ? "bg-[#9e3462] text-white"
                : "bg-white border border-[#eec7dd] text-[#533347] hover:bg-[#fce8f0] hover:text-[#21101a]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={48} className="text-[#9e3462] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((appt) => (
            <div key={appt.id} className="bg-white border border-[#eec7dd] rounded-xl p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[#21101a] font-label-md text-[15px]">{appt.name}</h3>
                  <p className="text-[#8c5971] text-[12px] mt-0.5">{appt.phone}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full font-label-md text-[11px] capitalize border ${
                    STATUS_STYLES[appt.status] || "bg-[#fce8f0] text-[#8c5971] border-[#eec7dd]"
                  }`}
                >
                  {appt.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-[#533347]">
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
                  <div className="flex items-center gap-2 text-[#533347]">
                    <PartyPopper size={16} />
                    <span className="font-label-md text-[12px]">
                      {OCCASION_LABELS[appt.occasion] || appt.occasion}
                    </span>
                  </div>
                )}
                {appt.email && (
                  <div className="flex items-center gap-2 text-[#533347]">
                    <Mail size={16} />
                    <span className="font-label-md text-[12px] truncate">{appt.email}</span>
                  </div>
                )}
              </div>

              {appt.message && (
                <p className="text-[#8c5971] font-body-md text-[12px] mb-4 italic border-l-2 border-[#d9afc0] pl-3">
                  &ldquo;{appt.message}&rdquo;
                </p>
              )}

              <div className="flex gap-2">
                {appt.status === "pending" && (
                  <button
                    onClick={() => updateStatus(appt.id, "confirmed")}
                    disabled={updating === appt.id}
                    className="flex-1 py-2 bg-[#9e3462]/10 text-[#9e3462] border border-[#9e3462]/30 rounded-lg font-label-md text-[12px] hover:bg-[#9e3462]/20 transition-colors disabled:opacity-50"
                  >
                    Confirm
                  </button>
                )}
                {appt.status === "confirmed" && (
                  <button
                    onClick={() => updateStatus(appt.id, "completed")}
                    disabled={updating === appt.id}
                    className="flex-1 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg font-label-md text-[12px] hover:bg-green-100 transition-colors disabled:opacity-50"
                  >
                    Mark Complete
                  </button>
                )}
                {appt.status !== "cancelled" && appt.status !== "completed" && (
                  <button
                    onClick={() => updateStatus(appt.id, "cancelled")}
                    disabled={updating === appt.id}
                    className="py-2 px-3 bg-red-50 text-red-600 border border-red-200 rounded-lg font-label-md text-[12px] hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <p className="text-[#d9afc0] text-[10px] mt-3">
                Submitted {new Date(appt.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20 text-[#8c5971]">
              <CalendarRange size={48} className="mx-auto mb-2 opacity-40" />
              <p>No appointments found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
