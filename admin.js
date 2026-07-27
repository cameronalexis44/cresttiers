"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const username = formData.get("username")?.toString().trim();

  if (!email || !password || !username) {
    redirect("/login?mode=signup&error=" + encodeURIComponent("All fields are required."));
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) {
    redirect("/login?mode=signup&error=" + encodeURIComponent(error.message));
  }

  redirect("/");
}

export async function signIn(formData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    redirect("/login?mode=login&error=" + encodeURIComponent("Enter your email and password."));
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/login?mode=login&error=" + encodeURIComponent(error.message));
  }

  redirect("/");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}
