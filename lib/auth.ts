import { auth, clerkClient } from "@clerk/nextjs/server";

export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return (user.publicMetadata as { role?: string })?.role === "admin";
}

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) return { userId: null, authorized: false };
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const authorized = (user.publicMetadata as { role?: string })?.role === "admin";
  return { userId, authorized };
}
