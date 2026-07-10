# Privacidade e segurança

## Dados e base legal

Coletar apenas nome, e-mail, faixa etária, preferências, consentimentos e dados necessários ao treino. Marketing possui consentimento separado. Textos legais são provisórios e exigem revisão jurídica para LGPD antes de produção.

## Controles

- Supabase Auth com confirmação de e-mail, recuperação de senha e cookies seguros.
- PostgreSQL com RLS deny-by-default, políticas de proprietário e papéis administrativos.
- Zod no cliente e servidor; queries parametrizadas; saída React escapada.
- Rate limit em autenticação e mutações sensíveis; cabeçalhos CSP, HSTS, frame e referrer.
- Auditoria administrativa sem senhas, tokens, conteúdo privado ou respostas integrais.
- Exportação estruturada e exclusão com período/política documentados.

## Offline

IndexedDB guarda somente sessões baixadas e operações pendentes; não guarda tokens. O payload é mínimo, validado e apagado após confirmação. Chave idempotente única impede duplicação.

## Segredos e operação

Somente chaves públicas ficam no cliente. `SUPABASE_SERVICE_ROLE_KEY` é exclusiva de ambiente servidor e não é necessária no fluxo normal. `.env.example` não contém valores reais. Backups, restauração e rotação são responsabilidades operacionais descritas em deployment.

## Analytics

Eventos permitidos: início/fim, duração, exercício, acerto, dificuldade, abandono, erro técnico, sincronização, tela e versão. Sem gravação de sessão, captura integral de teclas, fingerprinting ou respostas privadas. Analytics não essencial é opt-in.
