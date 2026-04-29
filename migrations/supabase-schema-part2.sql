-- ============================================================
-- PerpetuoHQ — Parte 2: Storage (bucket avatars + policies)
-- Executar DEPOIS da Parte 1 no SQL Editor do Supabase
-- ============================================================

-- Criar bucket (ignora se ja existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Remover policies existentes para evitar conflito
DROP POLICY IF EXISTS "avatars_select" ON storage.objects;
DROP POLICY IF EXISTS "avatars_insert" ON storage.objects;
DROP POLICY IF EXISTS "avatars_update" ON storage.objects;
DROP POLICY IF EXISTS "avatars_delete" ON storage.objects;

-- Qualquer pessoa pode ver avatares (bucket publico)
CREATE POLICY "avatars_select" ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Apenas usuarios autenticados podem fazer upload
CREATE POLICY "avatars_insert" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Usuario so pode atualizar seus proprios avatares (pasta com seu uid)
CREATE POLICY "avatars_update" ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Usuario so pode deletar seus proprios avatares
CREATE POLICY "avatars_delete" ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
