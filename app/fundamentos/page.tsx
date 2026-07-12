import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";
import { AppShell } from "../../src/components/app-shell";
import { collectionMeta, lessons } from "../../src/content/lessons";
import { createSupabaseServerClient } from "../../src/lib/supabase/server";

export default async function FoundationsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const { data: progress } = user ? await supabase!.from("learning_progress").select("lesson_slug,status").eq("user_id", user.id) : { data: [] };
  const completed = new Set(progress?.filter((item) => item.status === "completed").map((item) => item.lesson_slug));
  return <AppShell userEmail={user?.email}><header className="page-head learn-heading"><p className="eyebrow">Biblioteca de aprendizagem</p><h1>Fundamentos da Leitura Ativa</h1><p>Três edições originais, 18 lições, atividades e revisões. Seu avanço fica salvo na conta.</p><div className="learning-summary"><strong>{completed.size}/18</strong><span>lições concluídas</span><i><b style={{ width: `${Math.round(completed.size / 18 * 100)}%` }} /></i></div></header>{!user && <p className="notice">Você pode conhecer o catálogo. Para salvar atividades e continuar de onde parou, <Link href="/entrar?next=/fundamentos">entre na sua conta</Link>.</p>}<div className="collection-grid">{Object.entries(collectionMeta).map(([key, meta]) => { const collectionLessons = lessons.filter((lesson) => lesson.collection === key); return <section className="collection-card" key={key}><div className="book-cover"><Image src={meta.cover} alt="" fill sizes="(max-width: 900px) 90vw, 30vw" /><div><small>{meta.edition}</small><h2>{meta.title}</h2><span>{collectionLessons.length} lições</span></div></div><div className="collection-lessons">{collectionLessons.map((lesson) => <Link href={`/fundamentos/${lesson.slug}`} key={lesson.slug}><span>{String(lesson.order).padStart(2, "0")}</span><div><strong>{lesson.title}</strong><small><Clock3 size={13} /> {lesson.minutes} min</small></div>{completed.has(lesson.slug) && <CheckCircle2 className="lesson-done" size={19} aria-label="Concluída" />}</Link>)}</div></section>; })}</div></AppShell>;
}
