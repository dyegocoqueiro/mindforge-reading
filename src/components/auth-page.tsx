import { Brand } from "./site-chrome";
import type { ReactNode } from "react";
import { AuthForm } from "./auth-form";

export function AuthPage({ mode, title, description, children, redirectTo }: { mode?: "login" | "signup" | "recover"; title: string; description: string; children?: ReactNode; redirectTo?: string }) {
  return <main className="auth-page"><section className="auth-side"><Brand /><div><p className="eyebrow eyebrow-light">Treino com propósito</p><h1>Ritmo e entendimento devem avançar juntos.</h1><p>Sessões curtas, adaptação transparente e progresso comparado ao seu próprio ponto de partida.</p></div><small>Produto educacional, não clínico.</small></section><section className="auth-panel"><div className="auth-card"><h2>{title}</h2><p>{description}</p>{children ?? (mode ? <AuthForm mode={mode} redirectTo={redirectTo} /> : null)}{mode === "login" && <p className="auth-switch">Ainda não tem conta? <a href="/cadastro">Cadastre-se</a></p>}{mode === "signup" && <p className="auth-switch">Já tem conta? <a href="/entrar">Entrar</a></p>}</div></section></main>;
}
