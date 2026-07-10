export type ConceptRubric = {
  conceptId: string;
  label: string;
  requiredKeywords: string[];
  acceptedSynonyms: string[];
  forbiddenContradictions?: string[];
  weight: number;
  required: boolean;
};

export type SummaryScore = { score: number; identified: string[]; missing: string[]; contradictions: string[] };
export type SummaryInput = { text: string; rubrics: ConceptRubric[] };
export type PassageInput = { passageId: string };
export type QuestionDraft = { prompt: string };
export type LearnerContext = { priorities: string[] };

export interface ContentAnalysisProvider {
  scoreSummary(input: SummaryInput): Promise<SummaryScore>;
  generateQuestions(input: PassageInput): Promise<QuestionDraft[]>;
  suggestFeedback(input: LearnerContext): Promise<string[]>;
}

export function normalizePortuguese(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export class RuleBasedContentAnalysisProvider implements ContentAnalysisProvider {
  async scoreSummary({ text, rubrics }: SummaryInput): Promise<SummaryScore> {
    const normalized = normalizePortuguese(text);
    const identified: string[] = [];
    const missing: string[] = [];
    const contradictions: string[] = [];
    let earned = 0;
    const total = rubrics.reduce((sum, rubric) => sum + Math.max(0, rubric.weight), 0) || 1;
    for (const rubric of rubrics) {
      const terms = [...rubric.requiredKeywords, ...rubric.acceptedSynonyms].map(normalizePortuguese);
      const found = terms.some((term) => term && normalized.includes(term));
      if (found) { identified.push(rubric.label); earned += rubric.weight; }
      else if (rubric.required) missing.push(rubric.label);
      for (const contradiction of rubric.forbiddenContradictions ?? []) {
        if (normalized.includes(normalizePortuguese(contradiction))) contradictions.push(rubric.label);
      }
    }
    return { score: Math.max(0, Math.min(1, (earned / total) - contradictions.length * 0.1)), identified, missing, contradictions };
  }

  async generateQuestions(): Promise<QuestionDraft[]> { return []; }
  async suggestFeedback({ priorities }: LearnerContext): Promise<string[]> { return priorities.map((priority) => `O próximo treino dará atenção a ${priority}.`); }
}
