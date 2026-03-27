# Progress — PerpetuoHQ

## Status geral
MILESTONE ATUAL: 2 — Core (Perpétuos + Planilhas)
INÍCIO: Março 2026
ÚLTIMA SESSÃO: 2026-03-27

---

## Milestone 1 — Fundação ✅
**Objetivo:** Auth + layout base + banco configurado + deploy em staging
**Entregável:** Head e Gestor conseguem criar conta, logar e ver o dashboard vazio com sidebar navegável

FEITO:
- [x] Inicializar projeto Next.js 14 App Router + TypeScript strict + Tailwind + shadcn/ui
- [x] Configurar Supabase (criar projeto, env vars, client/server configs)
- [x] Criar tabelas do schema.md no Supabase (users, perpetuos, perpetuo_access, planilhas, daily_entries)
- [x] Ativar RLS em todas as tabelas e configurar políticas
- [x] Auth completa com Supabase Auth (cadastro + login + logout + middleware de proteção)
- [x] Layout base: sidebar com navegação (Dashboard, Perpétuos, Gestores, Config) + header com avatar/logout
- [x] Configurar Supabase Storage para upload de avatares
- [x] Aplicar design system (cores, fontes, componentes base)
- [x] Deploy na Vercel + variáveis de ambiente configuradas
- [x] Testar login em staging

---

## Milestone 2 — Core (Perpétuos + Planilhas)
**Objetivo:** CRUD de perpétuos, criação de planilhas mensais e preenchimento de dados diários
**Entregável:** Gestor consegue acessar um perpétuo, criar planilha do mês e preencher dados diários com cálculos automáticos funcionando

FEITO:
- (preencher conforme implementar)

FALTA:
- [ ] CRUD de perpétuos (criar, editar nome, excluir com confirmação)
- [ ] Tela de listagem de perpétuos com cards
- [ ] Tela interna do perpétuo com lista de planilhas (mês/ano)
- [ ] Criar planilha: selecionar mês/ano, definir nomes dos OBs/upsell/downsell
- [ ] Pré-criar daily_entries ao criar planilha
- [ ] Interface tipo spreadsheet: grid editável com todas as colunas de métricas
- [ ] Cálculos automáticos no frontend (faturamento total, lucro, margem, CPA, ticket médio, taxas, funil)
- [ ] Salvar dados ao editar célula (debounce de 500ms)
- [ ] Linha de totais/médias no rodapé da planilha
- [ ] Testes manuais do fluxo completo de preenchimento

---

## Milestone 3 — Gestores + Dashboard + PDF
**Objetivo:** Controle de acesso por gestor, dashboard com filtros e exportação PDF
**Entregável:** Sistema completo com Head gerenciando gestores, dashboard consolidado e relatório PDF

FALTA:
- [ ] CRUD de gestores (criar com email/senha/foto, editar, excluir)
- [ ] Upload de foto de perfil via Supabase Storage
- [ ] Tela de concessão de acesso: selecionar quais perpétuos cada gestor vê
- [ ] Filtrar perpétuos visíveis no frontend baseado em perpetuo_access
- [ ] Dashboard: cards de métricas (investido, faturamento, lucro, margem, CPA, ticket médio)
- [ ] Dashboard: filtro por perpétuo e por período (data início / data fim)
- [ ] Dashboard: gráfico de evolução (linha do tempo de faturamento/lucro)
- [ ] Exportação PDF da planilha mensal
- [ ] Checklist de segurança (RLS testado, env vars, .gitignore)
- [ ] Deploy final em produção

---

## Decisões técnicas
- Valores monetários em centavos (integer) no banco, exibidos como R$ na interface
- Campos calculados NÃO armazenados no banco — calculados no frontend
- Ao criar planilha, pré-criar todas as daily_entries do mês (facilita grid)
- Design system fixo: Navy + Gold + White conforme design-system.md
- Supabase Auth com email/password (sem OAuth)
- Zod para validação de inputs em todas as Server Actions

---

## Prompts que funcionaram bem
(Salvar prompts que geraram resultado excelente para reusar)

- (vazio — preencher conforme usar)
