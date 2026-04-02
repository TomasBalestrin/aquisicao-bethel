-- ============================================================
-- Migração: Multi-plataforma + 6 OBs + cliques_link
-- EXECUTAR AS 3 QUERIES SEPARADAMENTE, EM ORDEM
-- ============================================================

-- QUERY 1: Adicionar novas colunas
ALTER TABLE planilhas
  ADD COLUMN plat1_nome text DEFAULT 'Plataforma 1',
  ADD COLUMN plat2_nome text DEFAULT 'Plataforma 2',
  ADD COLUMN plat3_nome text DEFAULT 'Plataforma 3',
  ADD COLUMN plat4_nome text DEFAULT 'Plataforma 4',
  ADD COLUMN plat5_nome text DEFAULT 'Plataforma 5',
  ADD COLUMN ob6_nome text DEFAULT 'Order Bump 6';

ALTER TABLE daily_entries
  ADD COLUMN plat1_vendas integer DEFAULT 0,
  ADD COLUMN plat1_faturado integer DEFAULT 0,
  ADD COLUMN plat2_vendas integer DEFAULT 0,
  ADD COLUMN plat2_faturado integer DEFAULT 0,
  ADD COLUMN plat3_vendas integer DEFAULT 0,
  ADD COLUMN plat3_faturado integer DEFAULT 0,
  ADD COLUMN plat4_vendas integer DEFAULT 0,
  ADD COLUMN plat4_faturado integer DEFAULT 0,
  ADD COLUMN plat5_vendas integer DEFAULT 0,
  ADD COLUMN plat5_faturado integer DEFAULT 0,
  ADD COLUMN ob6_faturado integer DEFAULT 0,
  ADD COLUMN ob6_vendas integer DEFAULT 0,
  ADD COLUMN cliques_link integer DEFAULT 0;
