-- QUERY 2: Migrar dados existentes para plat1
UPDATE daily_entries
SET plat1_vendas = vendas_principal,
    plat1_faturado = faturamento_principal;
