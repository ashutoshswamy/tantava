import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const client = await clerkClient();
  const me = await client.users.getUser(userId);
  const role = (me.publicMetadata as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users: typeof me[] = [];
  let offset = 0;
  const limit = 500;
  while (true) {
    const { data, totalCount } = await client.users.getUserList({ limit, offset, orderBy: "-created_at" });
    users.push(...data);
    offset += data.length;
    if (offset >= totalCount || data.length === 0) break;
  }

  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      name: [u.firstName, u.lastName].filter(Boolean).join(" "),
      email: u.primaryEmailAddress?.emailAddress ?? "",
      phone: u.primaryPhoneNumber?.phoneNumber ?? "",
      role: (u.publicMetadata as { role?: string })?.role ?? "customer",
      createdAt: new Date(u.createdAt).toISOString(),
      lastSignInAt: u.lastSignInAt ? new Date(u.lastSignInAt).toISOString() : "",
    }))
  );
}
