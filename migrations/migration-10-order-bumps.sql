-- Migração: Expandir para 10 Order Bumps
-- Rodar no Supabase SQL Editor

-- OB7 a OB10 na tabela planilhas (ob6 já existe)
ALTER TABLE planilhas
  ADD COLUMN IF NOT EXISTS ob7_nome text DEFAULT 'Order Bump 7',
  ADD COLUMN IF NOT EXISTS ob8_nome text DEFAULT 'Order Bump 8',
  ADD COLUMN IF NOT EXISTS ob9_nome text DEFAULT 'Order Bump 9',
  ADD COLUMN IF NOT EXISTS ob10_nome text DEFAULT 'Order Bump 10';

-- OB7 a OB10 na tabela daily_entries (ob6 já existe)
ALTER TABLE daily_entries
  ADD COLUMN IF NOT EXISTS ob7_faturado integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ob7_vendas integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ob8_faturado integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ob8_vendas integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ob9_faturado integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ob9_vendas integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ob10_faturado integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ob10_vendas integer DEFAULT 0;
