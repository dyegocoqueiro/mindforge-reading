# Implantação

## Ambientes

Use projetos Supabase separados para desenvolvimento, homologação e produção. Execute migrations em homologação, valide smoke e backup, depois promova a mesma revisão. A aplicação pode ser implantada em plataforma compatível com Next.js; o adaptador presente no repositório também prepara hospedagem via Sites.

## Configuração

Defina URL e chave pública do Supabase, URL pública da aplicação e `ENABLE_AI_PROVIDER=false`. Nunca exponha service role. Configure URLs de redirecionamento, confirmação de e-mail, domínio e política de senha no painel Supabase.

## Banco

Instale Supabase CLI, inicie o ambiente local e aplique migrations. Seed é somente demonstração e deve ser explicitamente habilitado fora de produção. Antes de migrar produção: backup, janela de mudança, teste de restauração e plano de rollback compatível com a migration.

## PWA e cache

Sirva por HTTPS, valide manifest/ícones/service worker e incremente a versão de cache a cada release. Conteúdo privado não usa cache compartilhado. Revogue caches incompatíveis após mudanças de schema offline.

## Monitoramento

Monitore disponibilidade, falhas de autenticação, latência, erros de sync e migrations. Logs omitem payloads privados. Alertas não incluem respostas de avaliação.

## Rollback

Reimplante o artefato anterior; migrations destrutivas exigem estratégia expand/contract. Desative novas gravações se o schema anterior não for compatível e restaure apenas após confirmar impacto.
