Central de Retornos ONDA — versão online com Supabase

O que mudou nesta versão:
- Registros agora são carregados e salvos no Supabase.
- Exclusão e mudança rápida de status também usam o banco online.
- O login continua usando os 3 acessos atuais da fase inicial:
  william / onda123
  luise / luise123
  karem / karem123

Arquivos novos:
- api/config.js -> lê SUPABASE_URL e SUPABASE_ANON_KEY do Vercel.

Como publicar:
1. Suba todos os arquivos desta pasta para o GitHub, substituindo os antigos.
2. No Vercel, deixe as variáveis configuradas:
   SUPABASE_URL
   SUPABASE_ANON_KEY
3. Faça um novo deploy.

Se aparecer erro de permissão no Supabase:
Rode no SQL Editor:

alter table registros disable row level security;

Observação importante:
- Nesta etapa, o login ainda não usa autenticação nativa do Supabase.
- O banco sincroniza os registros entre todos os acessos.
- A tabela usuarios_sistema criada antes não está sendo usada nesta versão.
