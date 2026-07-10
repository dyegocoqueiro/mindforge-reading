import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Brand() {
  return <Link className="brand" href="/" aria-label="MindForge Reading — início"><span><BookOpen size={20} aria-hidden="true" /></span><strong>MindForge<small>READING</small></strong></Link>;
}

export function SiteHeader() {
  return <header className="site-header"><Brand /><nav aria-label="Navegação principal"><Link href="/#como-funciona">Como funciona</Link><Link href="/#niveis">Níveis</Link><Link href="/#seguranca">Método</Link></nav><div className="header-actions"><Link className="text-link" href="/entrar">Entrar</Link><Link className="button button-small" href="/cadastro">Começar agora</Link></div></header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><Brand /><p>Treino educacional de leitura, compreensão e memória.</p><nav aria-label="Links do rodapé"><Link href="/privacidade">Privacidade</Link><Link href="/fundamentos">Fundamentos</Link><Link href="/entrar">Entrar</Link></nav><small>© 2026 MindForge Reading. Textos legais provisórios para revisão jurídica.</small></footer>;
}
