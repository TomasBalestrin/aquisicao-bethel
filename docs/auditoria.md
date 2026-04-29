# Auditoria Completa — PerpetuoHQ
Data: 2026-04-02

## Resumo Executivo
- 7 bugs encontrados (1 crítico, 6 menores)
- 5 arquivos mortos (SQL obsoletos)
- 3 duplicações
- 6 violações de conformidade
- 7 otimizações sugeridas

---

## 1. Bugs

### Críticos (impedem funcionalidade)
| # | Arquivo | Linha | Descrição | Impacto |
|---|---------|-------|-----------|---------|
| B1 | schema.md | 62-63,80 | schema.md lista `faturamento_principal`, `vendas_principal`, `carregamento` como colunas do banco, mas foram REMOVIDAS na migração multi-plataforma. Schema não reflete o banco real. | Confusão para devs, schema mente sobre o modelo |

### Menores (não impedem mas precisam corrigir)
| # | Arquivo | Linha | Descrição | Impacto |
|---|---------|-------|-----------|---------|
| B2 | src/actions/gestorAccess.ts | 8-11 | Interface `ActionResponse` definida mas nunca usada (função retorna tipo inline na linha 13) | Código morto dentro do arquivo |
| B3 | src/actions/gestoresAdmin.ts | 70 | `uploadAvatar` retorna `ActionResponse & { data?: string }` — tipo intersection inconsistente com padrão do projeto | Inconsistência de tipagem |
| B4 | src/actions/settings.ts | 51 | `uploadOwnAvatar` usa mesmo padrão inconsistente `ActionResponse & { data?: string }` | Inconsistência de tipagem |
| B5 | src/components/dashboard/DashboardClient.tsx | 22-35 | Sem feedback de erro quando `getDashboardData()` falha — falha silenciosa, usuário não sabe que deu erro | UX ruim em caso de erro |
| B6 | src/components/planilha/EditableCell.tsx | 28-37 | `updateDailyEntry()` sem try/catch — se o save falhar, UI mostra como salvo mas dado não persistiu | Inconsistência de dados |
| B7 | src/components/Sidebar.tsx | 12 | Prop `currentPath` declarada no interface mas nunca usada (usa `usePathname()` em vez disso). Caller passa string vazia. | Código morto |

---

## 2. Arquivos Mortos

| # | Arquivo | Tipo | Pode deletar? | Motivo |
|---|---------|------|---------------|--------|
| D1 | supabase-schema.sql | SQL | Sim | Schema original pré-migração. Referencia colunas removidas. Substituído por migration-novo-modelo.sql |
| D2 | supabase-schema-part1.sql | SQL | Sim | Split do schema original. Mesmo problema que D1 |
| D3 | supabase-migration-multiplatform-1-add.sql | SQL | Sim | Duplicata de migration-novo-modelo.sql (etapa 1) |
| D4 | supabase-migration-multiplatform-2-migrate.sql | SQL | Sim | Duplicata de migration-novo-modelo.sql (etapa 2) |
| D5 | supabase-migration-multiplatform-3-drop.sql | SQL | Sim | Duplicata de migration-novo-modelo.sql (etapa 3) |

**Manter:** supabase-schema-part2.sql (storage/avatars), migration-novo-modelo.sql (migração atual)

---

## 3. Duplicações

| # | Arquivo A | Arquivo B | O que duplica | Sugestão |
|---|-----------|-----------|---------------|----------|
| P1 | actions/gestores.ts | actions/gestoresAdmin.ts | Ambos têm interface `ActionResponse` e helper `assertHead()` | Extrair `ActionResponse` para types/ e `assertHead` para um helper |
| P2 | actions/planilhas.ts | actions/planilhasAdmin.ts | Ambos têm `ActionResponse`, `daysInMonth()` | Extrair para shared utils |
| P3 | migration-novo-modelo.sql | supabase-migration-multiplatform-{1,2,3}.sql | Mesma migração em 2 formatos | Deletar os 3 arquivos split (D3-D5) |

---

## 4. Violações de Conformidade

| # | Regra (doc) | Arquivo | Descrição | Correção |
|---|-------------|---------|-----------|----------|
| C1 | CLAUDE.md: "Validar TODA input com Zod" | actions/planilhas.ts:30 | `getPlanilhasByPerpetuo(perpetuoId)` não valida UUID | Adicionar z.string().uuid() |
| C2 | CLAUDE.md: "Validar TODA input com Zod" | actions/perpetuos.ts:60,82 | `updatePerpetuo(id)` e `deletePerpetuo(id)` não validam UUID do parâmetro id | Adicionar validação |
| C3 | CLAUDE.md: "Validar TODA input com Zod" | actions/gestoresAdmin.ts:26,55 | `updateGestor(id)` e `deleteGestor(id)` não validam UUID | Adicionar validação |
| C4 | schema.md | schema.md:55-86 | Tabela daily_entries lista colunas removidas (faturamento_principal, vendas_principal, carregamento) e NÃO lista colunas novas (plat1-5, ob6, cliques_link) | Atualizar schema.md |
| C5 | schema.md | schema.md:88-110 | Campos calculados desatualizados — não inclui vendas_principal calc, fat_principal calc, total_funil, carregamento calc, taxas OBs | Atualizar fórmulas |
| C6 | progress.md:104 | progress.md | Decisão técnica diz "Font mono: JetBrains Mono (valores numéricos na planilha e dashboard)" mas planilha agora usa Poppins | Corrigir para refletir Poppins na planilha |

---

## 5. Otimizações

| # | Arquivo | Tipo | Descrição | Prioridade |
|---|---------|------|-----------|------------|
| O1 | actions/*.ts | Código | 4 arquivos definem `ActionResponse` interface localmente. Extrair para types/action.ts | 🟡 Média |
| O2 | actions/planilhas.ts + planilhasAdmin.ts | Código | `daysInMonth()` duplicada. Extrair para lib/utils/ | 🟢 Baixa |
| O3 | components/SidebarMargin.tsx | Perf | Usa setInterval(300ms) para detectar mudança no localStorage. Pode usar custom event dispatch | 🟡 Média |
| O4 | actions/dashboard.ts:70 | Perf | `calcVendasPrincipal(e)` chamada a cada entry no loop mas também dentro de `calcFaturamentoTotal`. Poderia cachear resultado | 🟢 Baixa |
| O5 | components/planilha/SpreadsheetRow.tsx | Perf | Cada célula calculada recalcula via getCalcValue. Para entries com muitas colunas, acumula recálculos | 🟢 Baixa |
| O6 | Todos os select("*") | Perf | Server Actions usam `.select("*")` em todas as queries. Selecionar apenas colunas necessárias reduz payload | 🟡 Média |
| O7 | components/dashboard/DashboardClient.tsx | CLAUDE.md | Dashboard faz fetch client-side via Server Action (useEffect). CLAUDE.md diz "nunca fazer fetch client-side para dados que podem ser Server Component". Porém os filtros são interativos, então é justificável | 🟢 Baixa |

---

## Notas Adicionais

### Segurança ✅
- .gitignore contém .env, .env.local, node_modules, .next
- Nenhuma secret hardcoded no código fonte
- Middleware protege /dashboard, /perpetuos, /gestores, /configuracoes, /settings
- RLS ativo em todas as tabelas
- Admin client usa SERVICE_ROLE_KEY de env var

### Tipagem ✅
- Nenhum uso de `any` encontrado
- Todos os arquivos abaixo de 150 linhas (maior: database.ts com 146)

### Naming ✅
- Componentes em PascalCase
- Utils em camelCase
- Server Actions em camelCase com prefixo de ação

### PRD ✅
- Todas as 5 features do MVP implementadas
- Nenhuma feature do anti-escopo implementada
- Fluxo principal funciona como descrito

### Design System ⚠️
- Sidebar atualizada para match do HTML (border-left, cores, spacing)
- Header com sticky + backdrop-blur como no HTML
- Poppins nas tabelas, Plus Jakarta Sans no resto
- Cards usam rounded-lg, botões rounded-md/rounded-[6px]
- schema.md da planilha está desatualizado vs implementação real
