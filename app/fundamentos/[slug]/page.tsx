import { notFound } from "next/navigation";
import { AppShell } from "../../../src/components/app-shell";
import { LessonReader } from "../../../src/components/lesson-reader";
import { getLesson } from "../../../src/content/lessons";
import { createSupabaseServerClient } from "../../../src/lib/supabase/server";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const { data: progress } = user ? await supabase!.from("learning_progress").select("status,score").eq("user_id", user.id).eq("lesson_slug", slug).maybeSingle() : { data: null };
  return <AppShell userEmail={user?.email}><LessonReader lesson={lesson} signedIn={Boolean(user)} initialComplete={progress?.status === "completed"} /></AppShell>;
}
