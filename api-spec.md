# API Externa — PerpetuoHQ

> Especificação da API REST somente leitura para integração com sistemas externos.
> O sistema externo usa uma API Key gerada pelo Head nas configurações.

---

## Resumo

| Item | Detalhe |
|------|---------|
| Base URL | `/api/v1` |
| Autenticação | Bearer Token (API Key) |
| Permissão | Somente leitura (GET) |
| Quem gera a key | Apenas usuários com role `head` |
| Formato de resposta | JSON |
| Valores monetários | Centavos (integer) — o sistema externo converte |

---

## 1. Nova tabela: api_keys

Adicionar ao `schema.md`:

| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | FK → users.id, not null |
| key_hash | text | not null |
| key_prefix | text | not null |
| name | text | not null, default 'Chave padrão' |
| is_active | boolean | not null, default true |
| last_used_at | timestamptz | nullable |
| created_at | timestamptz | default now() |

### Regras

- A key completa é exibida **uma única vez** ao ser gerada (nunca mais recuperável)
- No banco, armazena apenas o **hash** (SHA-256) da key + um **prefixo** de 8 caracteres para identificação visual
- Formato da key: `phq_` + 32 caracteres aleatórios (ex: `phq_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)
- Head pode ter múltiplas keys ativas (útil para diferentes integrações)
- Head pode revogar uma key (soft delete: `is_active = false`)
- Ao autenticar, buscar pelo hash e verificar `is_active = true`
- Atualizar `last_used_at` a cada request autenticado

### RLS

- Apenas o próprio usuário (head) vê/gerencia suas keys
- A validação de API key é feita via Server Action / API Route, não via RLS diretamente

### SQL

```sql
CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_hash text NOT NULL,
  key_prefix text NOT NULL,
  name text NOT NULL DEFAULT 'Chave padrão',
  is_active boolean NOT NULL DEFAULT true,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_user ON api_keys(user_id);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Head vê suas próprias keys"
  ON api_keys FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Head cria keys"
  ON api_keys FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'head')
  );

CREATE POLICY "Head revoga suas keys"
  ON api_keys FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

---

## 2. Autenticação

Toda request à API deve incluir o header:

```
Authorization: Bearer phq_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### Fluxo de validação (middleware)

```
1. Extrair token do header Authorization
2. Gerar SHA-256 do token
3. Buscar em api_keys WHERE key_hash = hash AND is_active = true
4. Se não encontrar → 401 Unauthorized
5. Se encontrar → atualizar last_used_at, prosseguir com user_id do dono da key
6. Como o dono é sempre Head, a API retorna TODOS os perpétuos (acesso total)
```

### Respostas de erro padrão

```json
// 401 — Key ausente ou inválida
{
  "error": "unauthorized",
  "message": "API key inválida ou ausente"
}

// 404 — Recurso não encontrado
{
  "error": "not_found",
  "message": "Perpétuo não encontrado"
}

// 500 — Erro interno
{
  "error": "internal_error",
  "message": "Erro interno do servidor"
}
```

---

## 3. Endpoints

### GET `/api/v1/perpetuos`

Lista todos os perpétuos.

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Método X",
      "created_at": "2026-03-15T10:00:00Z",
      "planilhas_count": 3
    }
  ],
  "count": 4
}
```

---

### GET `/api/v1/perpetuos/:id`

Detalhe de um perpétuo com lista de planilhas.

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Método X",
    "created_at": "2026-03-15T10:00:00Z",
    "planilhas": [
      {
        "id": "uuid",
        "mes": 3,
        "ano": 2026,
        "ob1_nome": "Order Bump 1",
        "ob2_nome": "Order Bump 2",
        "ob3_nome": "Order Bump 3",
        "ob4_nome": "Order Bump 4",
        "ob5_nome": "Order Bump 5",
        "upsell_nome": "Upsell",
        "downsell_nome": "Downsell"
      }
    ]
  }
}
```

---

### GET `/api/v1/perpetuos/:id/planilhas/:planilhaId`

Dados completos de uma planilha com todas as daily entries.

**Query params opcionais:**
| Param | Tipo | Descrição |
|-------|------|-----------|
| `de` | date (YYYY-MM-DD) | Filtrar entries a partir desta data |
| `ate` | date (YYYY-MM-DD) | Filtrar entries até esta data |

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "perpetuo_id": "uuid",
    "perpetuo_nome": "Método X",
    "mes": 3,
    "ano": 2026,
    "ob1_nome": "Order Bump 1",
    "ob2_nome": "Order Bump 2",
    "ob3_nome": "Order Bump 3",
    "ob4_nome": "Order Bump 4",
    "ob5_nome": "Order Bump 5",
    "upsell_nome": "Upsell",
    "downsell_nome": "Downsell",
    "entries": [
      {
        "data": "2026-03-01",
        "investimento": 50000,
        "faturamento_principal": 120000,
        "vendas_principal": 8,
        "ob1_faturado": 15000,
        "ob1_vendas": 3,
        "ob2_faturado": 0,
        "ob2_vendas": 0,
        "ob3_faturado": 0,
        "ob3_vendas": 0,
        "ob4_faturado": 0,
        "ob4_vendas": 0,
        "ob5_faturado": 0,
        "ob5_vendas": 0,
        "upsell_faturado": 30000,
        "upsell_vendas": 2,
        "downsell_faturado": 0,
        "downsell_vendas": 0,
        "ctr": 2.50,
        "page_view": 1200,
        "carregamento": 1100,
        "initiate_checkout": 45,
        "cpm": 3500
      }
    ],
    "totais": {
      "investimento": 1500000,
      "faturamento_total": 3600000,
      "lucro": 2100000,
      "margem": 58.33,
      "vendas_principal": 240,
      "cpa": 6250,
      "ticket_medio": 15000
    }
  }
}
```

> **Nota:** `totais` é calculado pela API somando/calculando as entries retornadas. Valores monetários em centavos. `margem` em percentual.

---

### GET `/api/v1/perpetuos/:id/planilhas`

Lista todas as planilhas de um perpétuo (sem entries — mais leve).

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "mes": 3,
      "ano": 2026,
      "dias_preenchidos": 15,
      "dias_total": 31
    }
  ],
  "count": 3
}
```

---

## 4. Estrutura de arquivos

```
/app/api/v1/
  perpetuos/
    route.ts                          → GET /api/v1/perpetuos
    [id]/
      route.ts                        → GET /api/v1/perpetuos/:id
      planilhas/
        route.ts                      → GET /api/v1/perpetuos/:id/planilhas
        [planilhaId]/
          route.ts                    → GET /api/v1/perpetuos/:id/planilhas/:planilhaId

/lib/api/
  auth.ts                            → validateApiKey(request) → user_id | null
  response.ts                        → helpers: apiSuccess(), apiError()
```

---

## 5. Tela de configurações — Gerenciamento de API Keys

**Acesso:** Apenas Head (role check no layout)
**Localização:** `/app/(auth)/configuracoes/page.tsx` — seção "API"

### Layout da seção

```
┌──────────────────────────────────────────────────────┐
│  API                                                 │
│  Chaves de acesso para integração com outros sistemas│
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │  Chave padrão              phq_a1b2...  Ativa  │  │
│  │  Criada em 15/03/2026 · Último uso: hoje       │  │
│  │                                    [Revogar]   │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  [+ Gerar nova chave]                                │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │  ⚠ Sua nova chave de API:                      │  │
│  │  ┌──────────────────────────────────────────┐  │  │
│  │  │ phq_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6   │  │  │
│  │  │                              [Copiar]    │  │  │
│  │  └──────────────────────────────────────────┘  │  │
│  │  Salve esta chave agora. Ela não será          │  │
│  │  exibida novamente.                            │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  Base URL: https://perpetuohq.vercel.app/api/v1      │
│  Docs: /api-spec.md                                  │
└──────────────────────────────────────────────────────┘
```

### Comportamento

1. **Gerar chave:** Abre input para nome (opcional) → gera key no backend → exibe key completa UMA vez com botão "Copiar"
2. **Listar chaves:** Mostra prefixo (`phq_a1b2...`), nome, data de criação, último uso, status (Ativa/Revogada)
3. **Revogar:** Botão com confirmação → soft delete (`is_active = false`) → key para de funcionar instantaneamente
4. **Copiar:** `navigator.clipboard.writeText()` + toast de confirmação

---

## 6. Exemplo de uso pelo sistema externo

```javascript
// No sistema externo — exemplo de como consumir a API
const API_KEY = "phq_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6";
const BASE_URL = "https://perpetuohq.vercel.app/api/v1";

// Listar perpétuos
const perpetuos = await fetch(`${BASE_URL}/perpetuos`, {
  headers: { Authorization: `Bearer ${API_KEY}` }
}).then(r => r.json());

// Puxar planilha completa com entries
const planilha = await fetch(
  `${BASE_URL}/perpetuos/${perpetuoId}/planilhas/${planilhaId}`,
  { headers: { Authorization: `Bearer ${API_KEY}` } }
).then(r => r.json());

// Filtrar por período
const filtrado = await fetch(
  `${BASE_URL}/perpetuos/${perpetuoId}/planilhas/${planilhaId}?de=2026-03-01&ate=2026-03-15`,
  { headers: { Authorization: `Bearer ${API_KEY}` } }
).then(r => r.json());
```

---

## 7. Checklist de implementação

- [ ] Criar tabela `api_keys` no Supabase com RLS
- [ ] Criar `lib/api/auth.ts` — função `validateApiKey()`
- [ ] Criar `lib/api/response.ts` — helpers de resposta padronizada
- [ ] `GET /api/v1/perpetuos` — listar perpétuos
- [ ] `GET /api/v1/perpetuos/:id` — detalhe com planilhas
- [ ] `GET /api/v1/perpetuos/:id/planilhas` — listar planilhas
- [ ] `GET /api/v1/perpetuos/:id/planilhas/:planilhaId` — planilha com entries + totais
- [ ] Server Action: `generateApiKey()` — gera key, salva hash, retorna key completa
- [ ] Server Action: `revokeApiKey(id)` — soft delete
- [ ] Server Action: `listApiKeys()` — listar keys do head
- [ ] UI: seção API na tela de configurações
- [ ] Testar com curl/Postman em staging
