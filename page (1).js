"use server";

import { getCurrentProfile } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const { user, profile } = await getCurrentProfile();
  if (!user || profile?.role !== "admin") {
    throw new Error("Admins only.");
  }
  return { user, profile };
}

export async function becomeAdminWithCode(formData) {
  const { user } = await getCurrentProfile();
  if (!user) throw new Error("Sign in first.");

  const code = formData.get("code")?.toString();
  if (!code || code !== process.env.ADMIN_INVITE_CODE) {
    return { error: "That invite code is not valid." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ role: "admin" }).eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function addPlayer(formData) {
  await requireAdmin();
  const name = formData.get("name")?.toString().trim();
  const region = formData.get("region")?.toString() || "—";
  if (!name) return;

  const admin = createAdminClient();
  await admin.from("players").insert({ name, region, tiers: {} });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deletePlayer(playerId) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("players").delete().eq("id", playerId);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function renamePlayer(playerId, name) {
  await requireAdmin();
  if (!name?.trim()) return;
  const admin = createAdminClient();
  await admin.from("players").update({ name: name.trim() }).eq("id", playerId);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function setPlayerRegion(playerId, region) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("players").update({ region }).eq("id", playerId);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function setPlayerTier(playerId, categoryKey, tier) {
  await requireAdmin();
  const admin = createAdminClient();
  const { data: p } = await admin.from("players").select("tiers").eq("id", playerId).single();
  const tiers = { ...(p?.tiers || {}), [categoryKey]: tier };
  await admin.from("players").update({ tiers }).eq("id", playerId);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function promoteAdmin(formData) {
  await requireAdmin();
  const username = formData.get("username")?.toString().trim();
  if (!username) return { error: "Enter a username." };

  const admin = createAdminClient();
  const { data: target } = await admin
    .from("profiles")
    .select("id, username")
    .ilike("username", username)
    .single();

  if (!target) return { error: `No user found with the name "${username}".` };

  await admin.from("profiles").update({ role: "admin" }).eq("id", target.id);
  revalidatePath("/admin");
  return { success: true };
}

export async function removeAdmin(userId) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("profiles").update({ role: "user" }).eq("id", userId);
  revalidatePath("/admin");
}
