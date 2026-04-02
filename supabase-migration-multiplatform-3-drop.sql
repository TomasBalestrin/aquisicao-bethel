-- QUERY 3: Remover colunas obsoletas
ALTER TABLE daily_entries
  DROP COLUMN IF EXISTS faturamento_principal,
  DROP COLUMN IF EXISTS vendas_principal,
  DROP COLUMN IF EXISTS carregamento;
