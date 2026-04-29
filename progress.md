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
- [x] Migração multi-plataforma aplicada no Supabase
- [x] Design system auditado contra design-system.html
- [x] Sidebar fiel ao HTML: border-left Gold ativo, padding 28px, cores exatas
- [x] Sidebar colapsável: botão chevron, ícone-only quando recolhida, localStorage
- [x] Header: sticky, backdrop-blur, bg-white/85, padding 48px
- [x] Poppins (font-table) em toda interface de planilha
- [x] SidebarMargin component para transição suave de largura

---

## Decisões técnicas
- Valores monetários em centavos (integer) no banco, R$ na interface
- Campos calculados NÃO armazenados no banco
- Pré-criar daily_entries ao criar planilha
- Design system: Navy + Gold + White
- Font primária: Plus Jakarta Sans (body, labels, botões)
- Font tabela: Poppins (dados da planilha, headers de colunas, totais, células)
- Font mono: JetBrains Mono (valores numéricos no dashboard)
- Supabase Auth com email/password (sem OAuth)
- Zod para validação em todas as Server Actions
- Admin client com SERVICE_ROLE_KEY para gestão de usuários
- Multi-plataforma com 5 slots configuráveis de pagamento
- 6 Order Bumps (expandido de 5)
- Carregamento agora é calculado (page_view / cliques_link)
- vendas_principal e faturamento_principal são calculados (soma das plataformas)
- Colunas plat1-5 substituem faturamento_principal/vendas_principal no banco
- carregamento é calculado (page_view / cliques_link), não armazenado
- Dashboard usa fetch client-side via Server Action (useEffect) porque os filtros são interativos — justificável conforme CLAUDE.md

---

## Pós-MVP — Auditoria (Abril 2026)

FEITO:
- [x] Etapa 1: limpeza estrutural (arquivos mortos, duplicações, código morto)
- [x] Etapa 2: bugs corrigidos, validação Zod, schema.md atualizado
- [x] Etapa 3: otimizações de performance (custom event sidebar, cache cálculos, select específico)
- [x] Cor diferenciada para campos calculados na planilha (#EDF2F7)
- [x] Removida coluna cliques_link, carregamento editável, símbolo % nas métricas percentuais
- [x] Fix upload de avatar dos gestores (loading state, feedback, toast)
- [x] Sidebar condicional: gestor não vê Gestores/Configurações
- [x] KPIs gerais do mês na planilha (Investimento, Faturamento, Lucro, Margem, CPA, Ticket Médio)
- [x] KPIs em cards horizontais no topo (grid responsivo 2/3/6 cols)
- [x] Scroll horizontal contido na tabela (body nunca scrola horizontalmente)
- [x] Coluna "Dia" sticky à esquerda durante scroll horizontal
- [x] Header da tabela sticky no topo durante scroll vertical
- [x] Fix upload avatar: try/catch/finally para loading nunca ficar preso

---

## API Externa (Abril 2026)

FEITO:
- [x] A1: Reorganização do repositório — `/docs` (PRD, auditoria, design-system.html) e `/migrations` (SQLs) movidos via `git mv`
- [x] B1: Types da API em `src/types/api.ts` — `ApiKeyRow`, `ApiKeyPublic`, `GenerateApiKeyResult`, `PerpetuoListItem`, `PlanilhaListItem`, `PlanilhaTotais`
- [x] B2: SQL da migration `api_keys` salvo em `migrations/create-api-keys.sql` (execução manual no Supabase Dashboard)
- [x] B3: Helpers `apiSuccess`/`apiError` em `src/lib/api/response.ts` (NextResponse, shape `{ data, count? }` / `{ error, message }`)
- [x] B4: Middleware `validateApiKey` em `src/lib/api/auth.ts` — Bearer + SHA-256 + lookup em `api_keys` + fire-and-forget `last_used_at`
- [x] C1: `GET /api/v1/perpetuos` — lista com `planilhas_count` (count exact + head)
- [x] C2: `GET /api/v1/perpetuos/[id]` — detalhe + planilhas (id, mes, ano, nomes de OBs/upsell/downsell/plataformas)
- [x] D1: `GET /api/v1/perpetuos/[id]/planilhas` — lista com `dias_preenchidos` (filtro `investimento>0 OR plat1_faturado>0`) e `dias_total` derivado de `new Date(ano, mes, 0)`
- [x] D2: `GET /api/v1/perpetuos/[id]/planilhas/[planilhaId]` — entries (filtros `?de`/`?ate`) + totais agregados via `calcMetrics`
- [x] E1: Server Actions `generateApiKey`, `revokeApiKey`, `listApiKeys` em `src/actions/apiKeys.ts` (Zod, role head, `revalidatePath("/settings")`)
- [x] F1: UI em `src/components/settings/` — `ApiKeysSection`, `ApiKeyCard`, `ApiKeyReveal`. Settings page renderiza atrás de `border-t` quando role === "head"

DECISÕES TÉCNICAS:
- Tabela `api_keys` ainda não está em `src/types/database.ts` — extension type local + cast `as unknown as SupabaseClient<...>` em `auth.ts` (lib/api) e `apiKeys.ts` (actions). Mantém strict, sem `any`. Vale subir para `database.ts` quando outras rotas precisarem.
- Chave API: `phq_` + 16 bytes hex (`randomBytes(16).toString("hex")` → 32 chars hex). `key_prefix = key.slice(0, 8)`. Apenas o SHA-256 fica no banco.
- Revogação não deleta a row — soft delete via `is_active = false`.
- Margem em `PlanilhaTotais`: `(lucro / investimento) * 100` arredondada a 2 casas (divergente do `schema.md`, que usa `faturamento_total` como denominador — seguir contrato da API).
- N+1 em `/perpetuos` (count de planilhas) e `/perpetuos/[id]/planilhas` (count de entries) — suficiente para escala atual; otimizar quando incomodar.

PENDENTE / VERIFICAÇÃO MANUAL:
- [ ] Executar `migrations/create-api-keys.sql` no Supabase Dashboard (CREATE TABLE + 2 índices + RLS + 3 policies)
- [ ] G1: Teste end-to-end ainda não realizado neste sandbox por falta de credenciais Supabase reais. Verificado:
  - ✅ Step 2 — `curl /api/v1/perpetuos` sem header → 401 com shape `{error, message}`
  - ✅ Step 3 — `Bearer fake_key` → 401
  - ✅ Header sem prefixo `Bearer ` → 401
  - ✅ UUID inexistente com key inválida → 401 (auth precede DB)
  - ⏳ Steps 1, 4–11 (key real, dados reais, `last_used_at`, fluxo de revogação) — testar localmente após criar a tabela e gerar uma key pela UI
