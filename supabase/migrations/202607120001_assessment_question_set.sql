do $$
declare
  passage_version uuid;
  question_id uuid;
begin
  select pv.id into passage_version
  from public.passage_versions pv
  join public.passages p on p.id = pv.passage_id
  where p.slug = 'ponte-do-bairro' and pv.version = 1;

  if passage_version is null then return; end if;

  if not exists(select 1 from public.questions where passage_version_id = passage_version and kind = 'literal') then
    insert into public.questions(passage_version_id,kind,prompt,weight,correct_explanation,position)
    values(passage_version,'literal','O que Lia fazia para perceber as mudanças do bairro?',1,'Ela registrava detalhes observados durante a travessia.',2)
    returning id into question_id;
    insert into public.question_options(question_id,label,is_correct,feedback,position) values
      (question_id,'Registrava detalhes como objetos e conversas.',true,'A resposta recupera uma ação explícita do texto.',1),
      (question_id,'Atravessava a ponte cada vez mais rápido.',false,'O texto não relaciona atenção a atravessar mais rápido.',2),
      (question_id,'Evitava olhar para o bairro.',false,'Lia fazia o contrário: observava mudanças discretas.',3);
  end if;

  if not exists(select 1 from public.questions where passage_version_id = passage_version and kind = 'inference') then
    insert into public.questions(passage_version_id,kind,prompt,weight,correct_explanation,position)
    values(passage_version,'inference','Qual conclusão é sustentada pelos exemplos do vaso, da bicicleta e da conversa?',1.5,'Mudanças pequenas podem ser percebidas quando o leitor desacelera o julgamento e observa.',3)
    returning id into question_id;
    insert into public.question_options(question_id,label,is_correct,feedback,position) values
      (question_id,'A atenção pode crescer ao notar mudanças pequenas antes de concluir.',true,'A inferência conecta os exemplos à conclusão final.',1),
      (question_id,'Somente mudanças grandes merecem registro.',false,'Os exemplos são justamente mudanças discretas.',2),
      (question_id,'Observar elimina a necessidade de interpretar.',false,'O texto propõe observar antes de concluir, não abandonar a interpretação.',3);
  end if;

  if not exists(select 1 from public.questions where passage_version_id = passage_version and kind = 'vocabulary') then
    insert into public.questions(passage_version_id,kind,prompt,weight,correct_explanation,position)
    values(passage_version,'vocabulary','No texto, “mudança discreta” significa uma mudança…',1,'No contexto, discreta indica algo sutil e pouco chamativo.',4)
    returning id into question_id;
    insert into public.question_options(question_id,label,is_correct,feedback,position) values
      (question_id,'sutil e pouco chamativa.',true,'O contexto enumera detalhes pequenos do cotidiano.',1),
      (question_id,'repentina e barulhenta.',false,'Nada no contexto indica barulho ou impacto repentino.',2),
      (question_id,'impossível de perceber.',false,'Lia percebe e registra a mudança.',3);
  end if;
end $$;
