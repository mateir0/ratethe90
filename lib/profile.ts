import { SupabaseClient, User } from "@supabase/supabase-js";

function usernameFromEmail(email?: string) {
  return (email?.split("@")[0] || "fan").replace(/[^a-zA-Z0-9_]/g, "").toLowerCase().slice(0, 20) || "fan";
}

export async function ensureProfile(client: SupabaseClient, user: User) {
  const { data: existing } = await client.from("profiles").select("id").eq("id", user.id).maybeSingle();
  if (existing) return;

  const base = usernameFromEmail(user.email);
  for (let i = 0; i < 5; i++) {
    const candidate = i === 0 ? base : `${base}${Math.floor(Math.random() * 1000)}`;
    const { error } = await client.from("profiles").insert({ id: user.id, username: candidate, display_name: null });
    if (!error) return;
    if (!String(error.message).toLowerCase().includes("username")) throw error;
  }
  throw new Error("Unable to create unique username");
}
