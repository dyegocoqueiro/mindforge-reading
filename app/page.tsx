import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Check, Clock3, Gauge, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { SiteFooter, SiteHeader } from "../src/components/site-chrome";

const levels = [
  ["01", "Estabilidade", "Ergonomia, orientação de linha e ritmo consistente."],
  ["02", "Palavras", "Vocabulário contextual, pistas e palavras-chave."],
  ["03", "Frases", "Unidades de sentido, pontuação e relações lógicas."],
  ["04", "Retenção", "Parágrafos, recuperação ativa e revisão espaçada."],
  ["05", "Autonomia", "Estratégias, textos longos, síntese e aplicação."],
];

export default function Home() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles size={16} aria-hidden="true" /> Leitura ativa, sem atalhos vazios</p>
            <h1 id="hero-title">Leia com mais clareza.<br /><em>Retenha o que importa.</em></h1>
            <p className="hero-lead">Um plano de treino que equilibra ritmo, compreensão e memória — adaptado ao seu desempenho, não a promessas universais.</p>
            <div className="hero-actions">
              <Link className="button button-accent" href="/cadastro">Começar avaliação <ArrowRight size={18} aria-hidden="true" /></Link>
              <a className="button button-ghost" href="#como-funciona">Ver como funciona</a>
            </div>
            <ul className="trust-list" aria-label="Características principais">
              <li><Check size={17} aria-hidden="true" /> Plano individual</li>
              <li><Check size={17} aria-hidden="true" /> Sessões de 20 min</li>
              <li><Check size={17} aria-hidden="true" /> Método transparente</li>
            </ul>
          </div>
          <div className="hero-visual" aria-label="Exemplo do equilíbrio de leitura">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="balance-card">
              <div className="mini-label"><Brain size={18} aria-hidden="true" /> Seu equilíbrio de leitura</div>
              <div className="score-ring"><span>82</span><small>índice efetivo</small></div>
              <div className="metric-bars">
                <div><span>Compreensão</span><strong>84%</strong><i style={{ width: "84%" }} /></div>
                <div><span>Retenção</span><strong>76%</strong><i style={{ width: "76%" }} /></div>
                <div><span>Ritmo funcional</span><strong>81%</strong><i style={{ width: "81%" }} /></div>
              </div>
              <p className="seed-label">Demonstração visual — não representa resultado real</p>
            </div>
            <div className="floating-note note-top"><Clock3 size={19} aria-hidden="true" /><span><strong>20 min</strong> treino de hoje</span></div>
            <div className="floating-note note-bottom"><ShieldCheck size={19} aria-hidden="true" /><span><strong>Sem pressão</strong> avanço consistente</span></div>
          </div>
        </section>

        <section className="proof-strip" aria-label="Princípios do produto">
          <p>Uma prática que respeita como você aprende</p>
          <div><span><BookOpen aria-hidden="true" /> Compreensão</span><span><Brain aria-hidden="true" /> Memória</span><span><Gauge aria-hidden="true" /> Fluência</span><span><Layers3 aria-hidden="true" /> Consistência</span></div>
        </section>

        <section id="como-funciona" className="section how" aria-labelledby="how-title">
          <div className="section-heading"><p className="eyebrow">Seu caminho</p><h2 id="how-title">Treino objetivo, progresso com contexto</h2><p>O sistema observa resultados dentro das tarefas e ajusta o próximo passo com regras claras.</p></div>
          <div className="step-grid">
            <article><span>1</span><BookOpen aria-hidden="true" /><h3>Faça sua avaliação</h3><p>Ritmo, compreensão, retenção, vocabulário e estabilidade são medidos separadamente.</p></article>
            <article><span>2</span><Layers3 aria-hidden="true" /><h3>Receba seu plano</h3><p>Um perfil educacional define prioridades e monta sessões compatíveis com seu tempo.</p></article>
            <article><span>3</span><Brain aria-hidden="true" /><h3>Pratique e revise</h3><p>Recuperação ativa e revisão espaçada reforçam o que merece voltar no momento certo.</p></article>
          </div>
        </section>

        <section id="niveis" className="section levels" aria-labelledby="levels-title">
          <div className="section-heading compact"><p className="eyebrow">Progressão gradual</p><h2 id="levels-title">Cinco níveis. Uma habilidade de cada vez.</h2></div>
          <div className="level-list">
            {levels.map(([number, title, text]) => <article key={number}><b>{number}</b><div><h3>{title}</h3><p>{text}</p></div></article>)}
          </div>
        </section>

        <section id="seguranca" className="section safety" aria-labelledby="safety-title">
          <div><p className="eyebrow eyebrow-light">Ciência com responsabilidade</p><h2 id="safety-title">Evolução sem sacrificar entendimento</h2><p>A MindForge não diagnostica condições clínicas e não promete velocidade impossível. Se o ritmo sobe e a compreensão cai, o treino desacelera e reforça a base.</p></div>
          <ul><li><Check aria-hidden="true" /> Sem câmera ou rastreamento ocular</li><li><Check aria-hidden="true" /> Regras adaptativas documentadas</li><li><Check aria-hidden="true" /> Descanso nunca é punição</li><li><Check aria-hidden="true" /> Seus dados sob seu controle</li></ul>
        </section>

        <section className="section final-cta" aria-labelledby="cta-title"><p className="eyebrow">Seu primeiro passo</p><h2 id="cta-title">Descubra seu perfil de leitura</h2><p>A avaliação observa seu desempenho nas tarefas e prepara um ponto de partida realista.</p><Link className="button button-accent" href="/cadastro">Criar minha conta <ArrowRight size={18} aria-hidden="true" /></Link><small>Produto educacional. Não substitui avaliação profissional.</small></section>
      </main>
      <SiteFooter />
    </div>
  );
}
