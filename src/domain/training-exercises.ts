import { normalizePortuguese } from "./content-analysis";

export const trainingLabels: Record<string, string> = {
  preparation: "Preparação", fluency: "Fluência", comprehension: "Compreensão", retention: "Memória",
  focus: "Estabilidade", vocabulary: "Vocabulário", metacognition: "Metacognição", feedback: "Feedback",
};

export type TrainingResponse = { text?: string; choice?: string; rating?: number; activeSeconds?: number };

export function scoreTrainingBlock(skill: string, response: TrainingResponse) {
  const text = normalizePortuguese(response.text ?? "");
  if (skill === "comprehension") return response.choice === "evidence" ? 1 : 0;
  if (skill === "vocabulary") return response.choice === "context" ? 1 : 0;
  if (skill === "retention") return Math.min(1, ["ideia", "evidencia", "relacao", "objetivo"].filter((term) => text.includes(term)).length / 3);
  if (skill === "fluency" || skill === "focus") return (response.activeSeconds ?? 0) >= 10 ? 1 : 0.4;
  if (skill === "metacognition") return typeof response.rating === "number" && text.length >= 12 ? 1 : 0.5;
  return text.length >= 12 || typeof response.rating === "number" ? 1 : 0.5;
}

export function reviewPrompt(skill: string) {
  return ({
    preparation: ["Como você prepara uma leitura com propósito?", ["objetivo", "ambiente", "pergunta"]],
    fluency: ["Como aumentar o ritmo sem perder qualidade?", ["compreensão", "retenção", "ritmo"]],
    comprehension: ["Como diferenciar ideia central de um detalhe?", ["ideia central", "evidência", "relação"]],
    retention: ["Descreva o ciclo completo de recuperação ativa.", ["recordar", "conferir", "corrigir"]],
    focus: ["O que fazer quando a atenção se afasta da leitura?", ["retomar", "última ideia", "objetivo"]],
    vocabulary: ["Como inferir uma palavra pelo contexto?", ["pistas", "frase", "verificar"]],
    metacognition: ["Como comparar confiança e desempenho real?", ["previsão", "resultado", "ajuste"]],
    feedback: ["Qual evidência mostra que uma sessão foi produtiva?", ["compreensão", "recordação", "próximo passo"]],
  } as Record<string, [string, string[]]>)[skill] ?? ["Qual foi a principal estratégia da sessão?", ["estratégia"]];
}
