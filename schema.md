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
| upsell_nome | text | default 'Upsell' |
| downsell_nome | text | default 'Downsell' |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

> Constraint: UNIQUE(perpetuo_id, mes, ano) — não pode ter duas planilhas do mesmo mês/ano para o mesmo perpétuo

### daily_entries
| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| planilha_id | uuid | FK → planilhas.id, not null |
| data | date | not null |
| investimento | integer | default 0 (centavos) |
| faturamento_principal | integer | default 0 (centavos) |
| vendas_principal | integer | default 0 |
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
| upsell_faturado | integer | default 0 (centavos) |
| upsell_vendas | integer | default 0 |
| downsell_faturado | integer | default 0 (centavos) |
| downsell_vendas | integer | default 0 |
| ctr | numeric(5,2) | default 0 (percentual) |
| page_view | integer | default 0 |
| carregamento | integer | default 0 |
| initiate_checkout | integer | default 0 |
| cpm | integer | default 0 (centavos) |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

> Constraint: UNIQUE(planilha_id, data) — uma entrada por dia por planilha

## Campos calculados (frontend — NÃO armazenar no banco)

Estes campos são calculados no frontend em tempo real:

| Campo | Fórmula |
|-------|---------|
| faturamento_total | faturamento_principal + ob1_faturado + ob2_faturado + ob3_faturado + ob4_faturado + ob5_faturado + upsell_faturado + downsell_faturado |
| lucro | faturamento_total - investimento |
| margem | (lucro / faturamento_total) × 100 |
| cpa | investimento / vendas_principal |
| ticket_medio | faturamento_total / vendas_principal |
| ob[N]_taxa | (ob[N]_vendas / vendas_principal) × 100 |
| upsell_taxa | (upsell_vendas / vendas_principal) × 100 |
| downsell_taxa | (downsell_vendas / vendas_principal) × 100 |
| pag_compra | (vendas_principal / page_view) × 100 |
| pag_check | (initiate_checkout / page_view) × 100 |
| check_compra | (vendas_principal / initiate_checkout) × 100 |

> Divisões por zero: quando o divisor for 0, exibir "—" na interface.

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
- Ao criar uma planilha, o sistema pré-cria as daily_entries para todos os dias do mês selecionado (facilita a interface tipo spreadsheet)
