"use client";

import { useEffect, useState } from "react";
import { Loader2, Users as UsersIcon, Download } from "lucide-react";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  lastSignInAt: string;
};

const CSV_HEADERS: [key: keyof AdminUser, label: string][] = [
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["role", "Role"],
  ["createdAt", "Joined"],
  ["lastSignInAt", "Last Sign In"],
];

function toCsv(users: AdminUser[]) {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = users.map((u) => CSV_HEADERS.map(([key]) => escape(u[key])).join(","));
  return [CSV_HEADERS.map(([, label]) => escape(label)).join(","), ...rows].join("\n");
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = () => {
    const blob = new Blob([toCsv(users)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="text-[#930500] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-[#2b0e0a]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-bold text-[#2b0e0a] tracking-tight">Users</h1>
          <p className="text-[#8c6f52] text-[13px] mt-0.5">{users.length} user{users.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={users.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#930500] text-white text-[13px] font-medium rounded-xl hover:bg-[#8c0500] transition-colors disabled:opacity-50"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {users.length === 0 ? (
        <div className="bg-white border border-[#efdcb0] rounded-2xl p-12 text-center">
          <UsersIcon size={40} className="mx-auto mb-3 text-[#dcc9a0]" />
          <p className="text-[#8c6f52] text-[14px] font-medium">No users yet</p>
        </div>
      ) : (
        <div className="bg-white border border-[#efdcb0] rounded-2xl overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-[#efdcb0] bg-[#fbf0da]/40">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider hidden sm:table-cell">Phone</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider hidden md:table-cell">Joined</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#8c6f52] uppercase tracking-wider hidden md:table-cell">Last Sign In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efdcb0]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#fbf0da]/30 transition-colors">
                  <td className="px-5 py-4 text-[13px] text-[#2b0e0a] font-medium">{u.name || "—"}</td>
                  <td className="px-5 py-4 text-[13px] text-[#2b0e0a]">{u.email || "—"}</td>
                  <td className="px-5 py-4 text-[13px] text-[#8c6f52] hidden sm:table-cell">{u.phone || "—"}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        u.role === "admin" ? "bg-[#930500]/10 text-[#930500]" : "bg-[#fbf0da] text-[#8c6f52]"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#8c6f52] hidden md:table-cell">
                    {new Date(u.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#8c6f52] hidden md:table-cell">
                    {u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleDateString("en-IN") : "Never"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
