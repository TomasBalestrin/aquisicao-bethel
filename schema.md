# Schema do banco de dados — PerpetuoHQ

## Tabelas

### users
| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| email | text | unique, not null |
| name | text | not null |
| password_hash | text | not null |
| avatar_url | text | nullable |
| role | text | not null, default 'gestor' |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### perpetuos
| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| name | text | not null |
| created_by | uuid | FK → users.id, not null |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### perpetuo_access
| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| perpetuo_id | uuid | FK → perpetuos.id, not null |
| user_id | uuid | FK → users.id, not null |
| created_at | timestamptz | default now() |

> Constraint: UNIQUE(perpetuo_id, user_id)

### planilhas
| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| perpetuo_id | uuid | FK → perpetuos.id, not null |
| mes | integer | not null (1-12) |
| ano | integer | not null |
| ob1_nome | text | default 'Order Bump 1' |
| ob2_nome | text | default 'Order Bump 2' |
| ob3_nome | text | default 'Order Bump 3' |
| ob4_nome | text | default 'Order Bump 4' |
| ob5_nome | text | default 'Order Bump 5' |
| ob6_nome | text | default 'Order Bump 6' |
| upsell_nome | text | default 'Upsell' |
| downsell_nome | text | default 'Downsell' |
| plat1_nome | text | default 'Plataforma 1' |
| plat2_nome | text | default 'Plataforma 2' |
| plat3_nome | text | default 'Plataforma 3' |
| plat4_nome | text | default 'Plataforma 4' |
| plat5_nome | text | default 'Plataforma 5' |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

> Constraint: UNIQUE(perpetuo_id, mes, ano)

### daily_entries
| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| planilha_id | uuid | FK → planilhas.id, not null |
| data | date | not null |
| investimento | integer | default 0 (centavos) |
| plat1_vendas | integer | default 0 |
| plat1_faturado | integer | default 0 (centavos) |
| plat2_vendas | integer | default 0 |
| plat2_faturado | integer | default 0 (centavos) |
| plat3_vendas | integer | default 0 |
| plat3_faturado | integer | default 0 (centavos) |
| plat4_vendas | integer | default 0 |
| plat4_faturado | integer | default 0 (centavos) |
| plat5_vendas | integer | default 0 |
| plat5_faturado | integer | default 0 (centavos) |
| ob1_faturado | integer | default 0 (centavos) |
| ob1_vendas | integer | default 0 |
| ob2_faturado | integer | default 0 (centavos) |
| ob2_vendas | integer | default 0 |
| ob3_faturado | integer | default 0 (centavos) |
| ob3_vendas | integer | default 0 |
| ob4_faturado | integer | default 0 (centavos) |
| ob4_vendas | integer | default 0 |
| ob5_faturado | integer | default 0 (centavos) |
| ob5_vendas | integer | default 0 |
| ob6_faturado | integer | default 0 (centavos) |
| ob6_vendas | integer | default 0 |
| upsell_faturado | integer | default 0 (centavos) |
| upsell_vendas | integer | default 0 |
| downsell_faturado | integer | default 0 (centavos) |
| downsell_vendas | integer | default 0 |
| ctr | numeric(5,2) | default 0 (percentual) |
| page_view | integer | default 0 |
| initiate_checkout | integer | default 0 |
| cpm | integer | default 0 (centavos) |
| cliques_link | integer | default 0 | (existe no banco mas não é usado na interface)
| carregamento | integer | default 0 | campo editável
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

> Constraint: UNIQUE(planilha_id, data) — uma entrada por dia por planilha

## Campos calculados (frontend — NÃO armazenar no banco)

| Campo | Fórmula |
|-------|---------|
| vendas_principal | plat1_vendas + plat2_vendas + plat3_vendas + plat4_vendas + plat5_vendas |
| faturamento_principal | plat1_faturado + plat2_faturado + plat3_faturado + plat4_faturado + plat5_faturado |
| total_funil | ob1..6_faturado + upsell_faturado + downsell_faturado |
| faturamento_total | faturamento_principal + total_funil |
| lucro | faturamento_total - investimento |
| margem | (lucro / faturamento_total) × 100 |
| cpa | investimento / vendas_principal |
| ticket_medio | faturamento_total / vendas_principal |
| ob[1-6]_taxa | (ob[N]_vendas / vendas_principal) × 100 |
| upsell_taxa | (upsell_vendas / vendas_principal) × 100 |
| downsell_taxa | (downsell_vendas / vendas_principal) × 100 |
| conv_pag_checkout | (initiate_checkout / page_view) × 100 |
| conv_checkout_compra | (vendas_principal / initiate_checkout) × 100 |
| conv_pag_compra | (vendas_principal / page_view) × 100 |

> Divisões por zero: quando o divisor for 0, exibir "—" na interface.
> Lucro/Margem positivos em verde (#2E7D32), negativos em vermelho (#C62828).

## Relações
- users 1:N perpetuo_access (via user_id)
- perpetuos 1:N perpetuo_access (via perpetuo_id)
- perpetuos 1:N planilhas (via perpetuo_id)
- planilhas 1:N daily_entries (via planilha_id)
- users 1:N perpetuos (via created_by)

## Enums
- role: 'head' | 'gestor'

## RLS (Row Level Security) — Supabase
- users: cada usuário vê/edita apenas seu próprio registro. Head vê todos.
- perpetuos: head vê todos. Gestor vê apenas perpétuos onde tem registro em perpetuo_access.
- perpetuo_access: head gerencia todos. Gestor vê apenas seus próprios registros.
- planilhas: acesso via join com perpetuos (mesma regra de visibilidade do perpétuo).
- daily_entries: acesso via join com planilhas → perpetuos (mesma cadeia de visibilidade).

## Regras de dados
- Deletar perpétuo faz CASCADE em perpetuo_access, planilhas e daily_entries
- Deletar planilha faz CASCADE em daily_entries
- Deletar user remove seus registros de perpetuo_access (não deleta os perpétuos que ele gerencia)
- Valores monetários SEMPRE em centavos (integer). Conversão para reais apenas na interface.
- Ao criar uma planilha, o sistema pré-cria as daily_entries para todos os dias do mês selecionado
