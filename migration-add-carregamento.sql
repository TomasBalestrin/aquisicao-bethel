-- Adicionar carregamento de volta como campo editável
ALTER TABLE daily_entries
  ADD COLUMN IF NOT EXISTS carregamento integer DEFAULT 0;
