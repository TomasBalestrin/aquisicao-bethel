# Progress — PerpetuoHQ

## Status geral
MILESTONE ATUAL: CONCLUÍDO
INÍCIO: Março 2026
ÚLTIMA SESSÃO: 2026-03-27

---

## Milestone 1 — Fundação ✅
**Objetivo:** Auth + layout base + banco configurado + deploy em staging

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

## Ajustes pós-launch — 2026-03-27

- [x] Trocar fonte primária de Plus Jakarta Sans para Poppins (300-800)
- [x] Reordenar colunas da planilha conforme nova especificação (32 colunas)
- [x] Adicionar coluna "Faturamento Extras" (soma OBs + upsell + downsell)
- [x] Adicionar coluna "Nº Vendas Produto Principal"
- [x] Formato de data dd/mm/aaaa nas linhas da planilha
- [x] Cores pastel por categoria nos headers e células da planilha
- [x] Cores dinâmicas: lucro/margem verde (positivo) ou vermelho (negativo)
- [x] Atualizar design-system.md (Poppins + cores colunas)
- [x] Atualizar CLAUDE.md (font primária → Poppins)
- [x] Atualizar schema.md (nova ordem + faturamento_extras)
- [x] Ocultar/exibir colunas com ícone eye-off no header (persiste no localStorage)
- [x] Botão "Mostrar Colunas" para revelar todas as colunas ocultas
- [x] Duplicar planilha: copia nomes dos OBs, sugere próximo mês, valores zerados
- [x] Toolbar unificada: Mostrar Colunas + Duplicar + Exportar PDF
- [x] Botões duplicar e editar nomes OBs nos cards de planilha
- [x] Reverter fonte para Plus Jakarta Sans (body) + JetBrains Mono (valores numéricos)
- [x] Cards de planilha com ícones de ação: Abrir, Duplicar, Editar, Excluir
- [x] Dialog de confirmação para excluir planilha
- [x] Atualizar design-system.md (v1.3: ícones de ação, fontes corrigidas)
- [x] Multi-plataforma: 5 plataformas configuráveis de pagamento
- [x] 6 Order Bumps (era 5)
- [x] cliques_link como novo campo editável
- [x] Carregamento agora é calculado (page_view / cliques_link)
- [x] vendas_principal e faturamento_principal agora calculados (soma plataformas)
- [x] Taxas % por OB/upsell/downsell como colunas calculadas
- [x] 3 seções coloridas: Métricas Principais (azul), Plataforma (laranja), Facebook (azul)
- [x] Dashboard atualizado para novo modelo multi-plataforma
- [x] PDF atualizado para novo modelo
- [x] Formulários de criar/editar planilha com seções: Plataformas, OBs, Upsell/Downsell
- [x] SQL de migração gerado (3 arquivos separados)

---

## Decisões técnicas
- Valores monetários em centavos (integer) no banco, R$ na interface
- Campos calculados NÃO armazenados no banco
- Pré-criar daily_entries ao criar planilha
- Design system: Navy + Gold + White
- Font primária: Plus Jakarta Sans (body, labels, botões)
- Font mono: JetBrains Mono (valores numéricos na planilha e dashboard)
- Supabase Auth com email/password (sem OAuth)
- Zod para validação em todas as Server Actions
- Admin client com SERVICE_ROLE_KEY para gestão de usuários
- Multi-plataforma com 5 slots configuráveis de pagamento
- 6 Order Bumps (expandido de 5)
- Carregamento agora é calculado (page_view / cliques_link)
- vendas_principal e faturamento_principal são calculados (soma das plataformas)
