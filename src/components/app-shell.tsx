import Link from "next/link";
import { BarChart3, BookOpen, Brain, CalendarDays, Dumbbell, Library, LogOut, Settings, SlidersHorizontal } from "lucide-react";
import { Brand } from "./site-chrome";

export function AppShell({ children, userEmail }: { children: React.ReactNode; userEmail?: string }) {
  const items = [["/app", "Hoje", CalendarDays], ["/onboarding", "Meu plano", SlidersHorizontal], ["/fundamentos", "Aprender", BookOpen], ["/praticar", "Praticar", Dumbbell], ["/biblioteca", "Biblioteca", Library], ["/revisao", "Revisões", Brain], ["/progresso", "Progresso", BarChart3], ["/configuracoes", "Configurações", Settings]] as const;
  return <div className="app-layout"><aside className="app-sidebar"><Brand /><nav aria-label="Navegação do aplicativo">{items.map(([href, label, Icon]) => <Link key={href} href={href}><Icon size={18} aria-hidden="true" />{label}</Link>)}</nav>{userEmail && <div className="account-block"><p className="account-email" title={userEmail}>{userEmail}</p><Link href="/auth/sair"><LogOut size={15} /> Sair</Link></div>}</aside><main className="app-main">{children}</main></div>;
}
