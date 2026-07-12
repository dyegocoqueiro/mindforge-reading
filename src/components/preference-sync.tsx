"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "../lib/supabase/client";

export type ReadingPreferences = {
  theme: "light" | "dark" | "system";
  fontSize: number;
  lineHeight: number;
};

export function applyReadingPreferences(preferences: ReadingPreferences) {
  const root = document.documentElement;
  root.dataset.theme = preferences.theme;
  root.style.setProperty("--reader-font-size", `${preferences.fontSize}px`);
  root.style.setProperty("--reader-line-height", String(preferences.lineHeight));
  root.style.colorScheme = preferences.theme === "system" ? "light dark" : preferences.theme;
}

export function PreferenceSync() {
  useEffect(() => {
    let active = true;
    void (async () => {
      const client = await createSupabaseBrowserClient();
      if (!client || !active) return;
      const { data: { user } } = await client.auth.getUser();
      if (!user) return;
      const { data } = await client.from("user_preferences").select("theme,font_size,line_height").eq("user_id", user.id).maybeSingle();
      if (data && active) applyReadingPreferences({ theme: data.theme, fontSize: data.font_size, lineHeight: Number(data.line_height) });
    })();
    const listener = (event: Event) => applyReadingPreferences((event as CustomEvent<ReadingPreferences>).detail);
    window.addEventListener("mindforge:preferences", listener);
    return () => { active = false; window.removeEventListener("mindforge:preferences", listener); };
  }, []);
  return null;
}
