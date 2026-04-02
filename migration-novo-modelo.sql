-- ============================================================
-- MIGRAÇÃO: Novo modelo multi-plataforma + 6 OBs + cliques_link
-- Executar as 3 etapas SEPARADAMENTE, na ordem, no SQL Editor
-- ============================================================

-- ============================================================
-- ETAPA 1: Adicionar novas colunas
-- ============================================================

ALTER TABLE planilhas
  ADD COLUMN IF NOT EXISTS plat1_nome text DEFAULT 'Plataforma 1',
  ADD COLUMN IF NOT EXISTS plat2_nome text DEFAULT 'Plataforma 2',
  ADD COLUMN IF NOT EXISTS plat3_nome text DEFAULT 'Plataforma 3',
  ADD COLUMN IF NOT EXISTS plat4_nome text DEFAULT 'Plataforma 4',
  ADD COLUMN IF NOT EXISTS plat5_nome text DEFAULT 'Plataforma 5',
  ADD COLUMN IF NOT EXISTS ob6_nome text DEFAULT 'Order Bump 6';

ALTER TABLE daily_entries
  ADD COLUMN IF NOT EXISTS plat1_vendas integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plat1_faturado integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plat2_vendas integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plat2_faturado integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plat3_vendas integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plat3_faturado integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plat4_vendas integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plat4_faturado integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plat5_vendas integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plat5_faturado integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ob6_faturado integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ob6_vendas integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cliques_link integer DEFAULT 0;


-- ============================================================
-- ETAPA 2: Migrar dados das colunas antigas para plat1
-- (só executa se as colunas antigas ainda existem)
-- ============================================================

UPDATE daily_entries
SET plat1_vendas = COALESCE(vendas_principal, 0),
    plat1_faturado = COALESCE(faturamento_principal, 0)
WHERE vendas_principal IS NOT NULL OR faturamento_principal IS NOT NULL;


-- ============================================================
-- ETAPA 3: Remover colunas que agora são calculadas
-- ============================================================

ALTER TABLE daily_entries
  DROP COLUMN IF EXISTS faturamento_principal,
  DROP COLUMN IF EXISTS vendas_principal,
  DROP COLUMN IF EXISTS carregamento;
