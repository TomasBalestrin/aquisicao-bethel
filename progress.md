# Progress — PerpetuoHQ

## Status geral
MILESTONE ATUAL: CONCLUÍDO
INÍCIO: Março 2026
ÚLTIMA SESSÃO: 2026-03-27

---

## Milestone 1 — Fundação ✅
**Objetivo:** Auth + layout base + banco configurado + deploy em staging
**Entregável:** Head e Gestor conseguem criar conta, logar e ver o dashboard vazio com sidebar navegável

FEITO:
- [x] Inicializar projeto Next.js 14 App Router + TypeScript strict + Tailwind + shadcn/ui
- [x] Configurar Supabase (criar projeto, env vars, client/server configs)
- [x] Criar tabelas do schema.md no Supabase
- [x] Ativar RLS em todas as tabelas e configurar políticas
- [x] Auth completa com Supabase Auth
- [x] Layout base: sidebar + header
- [x] Configurar Supabase Storage para avatares
- [x] Aplicar design system
- [x] Deploy na Vercel
- [x] Testar login em staging

---

## Milestone 2 — Core (Perpétuos + Planilhas) ✅
**Objetivo:** CRUD de perpétuos, criação de planilhas e preenchimento de dados diários

FEITO:
- [x] CRUD de perpétuos com cards, modals e confirmação
- [x] Criar planilha com mês/ano e nomes customizados
- [x] Pré-criar daily_entries ao criar planilha
- [x] Interface spreadsheet com grid editável
- [x] Cálculos automáticos (fat total, lucro, margem, CPA, ticket, taxas, funil)
- [x] Salvar com debounce de 500ms
- [x] Linha de totais/médias

---

## Milestone 3 — Gestores + Dashboard + PDF ✅
**Objetivo:** Controle de acesso, dashboard e exportação PDF

FEITO:
- [x] CRUD de gestores (criar via admin API, editar, excluir)
- [x] Upload de foto de perfil via Supabase Storage
- [x] Concessão de acesso a perpétuos via checkboxes
- [x] Dashboard com 6 cards de métricas + filtros + gráfico de evolução
- [x] Exportação PDF da planilha mensal
- [x] Página de configurações (editar perfil + foto)
- [x] Checklist de segurança (RLS, env vars, .gitignore, Zod)
- [x] Revisão final de qualidade

---

## Decisões técnicas
- Valores monetários em centavos (integer) no banco, R$ na interface
- Campos calculados NÃO armazenados no banco
- Pré-criar daily_entries ao criar planilha
- Design system: Navy + Gold + White
- Supabase Auth com email/password (sem OAuth)
- Zod para validação em todas as Server Actions
- Admin client com SERVICE_ROLE_KEY para gestão de usuários
