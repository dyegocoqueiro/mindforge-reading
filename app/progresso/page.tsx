import { AppShell } from "../../src/components/app-shell";
import { ProgressDashboard, type ProgressPoint } from "../../src/components/progress-dashboard";
import { createSupabaseServerClient } from "../../src/lib/supabase/server";
export default async function ProgressPage(){
  const supabase=await createSupabaseServerClient(); const {data:{user}}=supabase?await supabase.auth.getUser():{data:{user:null}};
  const [{data:assessments},{data:sessions}] = user ? await Promise.all([
    supabase!.from("assessment_metrics").select("id,comprehension_score,delayed_retention_score,effective_reading_index,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(20),
    supabase!.from("training_session_summaries").select("id,average_score,skill_scores,completed_at").eq("user_id",user.id).order("completed_at",{ascending:false}).limit(30),
  ]) : [{data:[]},{data:[]}];
  const timedPoints=[...(assessments??[]).map(row=>({id:row.id,timestamp:new Date(row.created_at).getTime(),date:new Date(row.created_at).toLocaleDateString("pt-BR",{day:"2-digit",month:"short"}),comprehension:Number(row.comprehension_score)*100,retention:Number(row.delayed_retention_score)*100,effective:Number(row.effective_reading_index),source:"Avaliação" as const})),...(sessions??[]).map(row=>{const skills=row.skill_scores as Record<string,number>;return{id:row.id,timestamp:new Date(row.completed_at).getTime(),date:new Date(row.completed_at).toLocaleDateString("pt-BR",{day:"2-digit",month:"short"}),comprehension:(skills.comprehension??Number(row.average_score))*100,retention:(skills.retention??Number(row.average_score))*100,effective:Number(row.average_score)*100,source:"Sessão" as const};})].sort((a,b)=>b.timestamp-a.timestamp);
  const points:ProgressPoint[]=timedPoints.map((point)=>({id:point.id,date:point.date,comprehension:point.comprehension,retention:point.retention,effective:point.effective,source:point.source}));
  return <AppShell userEmail={user?.email}><header className="page-head"><p className="eyebrow">Evolução com contexto</p><h1>Progresso</h1><p>Uma visão clara de como compreensão, retenção e estabilidade evoluem em avaliações e sessões reais.</p></header>{user&&points.length?<ProgressDashboard points={points} completedSessions={sessions?.length??0}/>:<section className="empty-inline"><h2>Seu histórico começa na avaliação</h2><p>Nenhum dado fictício é exibido. Conclua a avaliação e as sessões para formar sua curva de evolução.</p></section>}</AppShell>;
}
