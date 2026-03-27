-- ============================================================
-- PerpetuoHQ — Parte 1: Tabelas, Indexes, Functions e RLS
-- Executar PRIMEIRO no SQL Editor do Supabase
-- ============================================================

-- ============================================================
-- 1. TABELAS
-- ============================================================

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  password_hash text NOT NULL,
  avatar_url text,
  role text NOT NULL DEFAULT 'gestor'
    CHECK (role IN ('head', 'gestor')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE perpetuos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_by uuid NOT NULL
    REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE perpetuo_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  perpetuo_id uuid NOT NULL
    REFERENCES perpetuos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL
    REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (perpetuo_id, user_id)
);

CREATE TABLE planilhas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  perpetuo_id uuid NOT NULL
    REFERENCES perpetuos(id) ON DELETE CASCADE,
  mes integer NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano integer NOT NULL,
  ob1_nome text DEFAULT 'Order Bump 1',
  ob2_nome text DEFAULT 'Order Bump 2',
  ob3_nome text DEFAULT 'Order Bump 3',
  ob4_nome text DEFAULT 'Order Bump 4',
  ob5_nome text DEFAULT 'Order Bump 5',
  upsell_nome text DEFAULT 'Upsell',
  downsell_nome text DEFAULT 'Downsell',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (perpetuo_id, mes, ano)
);

CREATE TABLE daily_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  planilha_id uuid NOT NULL
    REFERENCES planilhas(id) ON DELETE CASCADE,
  data date NOT NULL,
  investimento integer DEFAULT 0,
  faturamento_principal integer DEFAULT 0,
  vendas_principal integer DEFAULT 0,
  ob1_faturado integer DEFAULT 0,
  ob1_vendas integer DEFAULT 0,
  ob2_faturado integer DEFAULT 0,
  ob2_vendas integer DEFAULT 0,
  ob3_faturado integer DEFAULT 0,
  ob3_vendas integer DEFAULT 0,
  ob4_faturado integer DEFAULT 0,
  ob4_vendas integer DEFAULT 0,
  ob5_faturado integer DEFAULT 0,
  ob5_vendas integer DEFAULT 0,
  upsell_faturado integer DEFAULT 0,
  upsell_vendas integer DEFAULT 0,
  downsell_faturado integer DEFAULT 0,
  downsell_vendas integer DEFAULT 0,
  ctr numeric(5,2) DEFAULT 0,
  page_view integer DEFAULT 0,
  carregamento integer DEFAULT 0,
  initiate_checkout integer DEFAULT 0,
  cpm integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (planilha_id, data)
);

-- ============================================================
-- 2. INDEXES
-- ============================================================

CREATE INDEX idx_perpetuos_created_by ON perpetuos(created_by);
CREATE INDEX idx_perpetuo_access_user_id ON perpetuo_access(user_id);
CREATE INDEX idx_perpetuo_access_perpetuo_id ON perpetuo_access(perpetuo_id);
CREATE INDEX idx_planilhas_perpetuo_id ON planilhas(perpetuo_id);
CREATE INDEX idx_daily_entries_planilha_id ON daily_entries(planilha_id);
CREATE INDEX idx_daily_entries_data ON daily_entries(data);

-- ============================================================
-- 3. FUNCAO HELPER — obter role do usuario autenticado
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- ============================================================
-- 4. FUNCAO HELPER — checar se gestor tem acesso ao perpetuo
-- ============================================================

CREATE OR REPLACE FUNCTION public.has_perpetuo_access(p_perpetuo_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perpetuo_access
    WHERE perpetuo_id = p_perpetuo_id
      AND user_id = auth.uid()
  );
$$;

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================

-- ----- users -----
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select" ON users FOR SELECT USING (
  id = auth.uid()
  OR public.get_user_role() = 'head'
);

CREATE POLICY "users_update" ON users FOR UPDATE USING (
  id = auth.uid()
  OR public.get_user_role() = 'head'
);

CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (
  public.get_user_role() = 'head'
);

CREATE POLICY "users_delete" ON users FOR DELETE USING (
  public.get_user_role() = 'head'
);

-- ----- perpetuos -----
ALTER TABLE perpetuos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "perpetuos_select" ON perpetuos FOR SELECT USING (
  public.get_user_role() = 'head'
  OR public.has_perpetuo_access(id)
);

CREATE POLICY "perpetuos_insert" ON perpetuos FOR INSERT WITH CHECK (
  public.get_user_role() = 'head'
);

CREATE POLICY "perpetuos_update" ON perpetuos FOR UPDATE USING (
  public.get_user_role() = 'head'
);

CREATE POLICY "perpetuos_delete" ON perpetuos FOR DELETE USING (
  public.get_user_role() = 'head'
);

-- ----- perpetuo_access -----
ALTER TABLE perpetuo_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "perpetuo_access_select" ON perpetuo_access FOR SELECT USING (
  public.get_user_role() = 'head'
  OR user_id = auth.uid()
);

CREATE POLICY "perpetuo_access_insert" ON perpetuo_access FOR INSERT WITH CHECK (
  public.get_user_role() = 'head'
);

CREATE POLICY "perpetuo_access_delete" ON perpetuo_access FOR DELETE USING (
  public.get_user_role() = 'head'
);

-- ----- planilhas -----
ALTER TABLE planilhas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "planilhas_select" ON planilhas FOR SELECT USING (
  public.get_user_role() = 'head'
  OR public.has_perpetuo_access(perpetuo_id)
);

CREATE POLICY "planilhas_insert" ON planilhas FOR INSERT WITH CHECK (
  public.get_user_role() = 'head'
  OR public.has_perpetuo_access(perpetuo_id)
);

CREATE POLICY "planilhas_update" ON planilhas FOR UPDATE USING (
  public.get_user_role() = 'head'
  OR public.has_perpetuo_access(perpetuo_id)
);

CREATE POLICY "planilhas_delete" ON planilhas FOR DELETE USING (
  public.get_user_role() = 'head'
);

-- ----- daily_entries -----
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_entries_select" ON daily_entries FOR SELECT USING (
  public.get_user_role() = 'head'
  OR EXISTS (
    SELECT 1 FROM public.planilhas p
    WHERE p.id = daily_entries.planilha_id
      AND public.has_perpetuo_access(p.perpetuo_id)
  )
);

CREATE POLICY "daily_entries_insert" ON daily_entries FOR INSERT WITH CHECK (
  public.get_user_role() = 'head'
  OR EXISTS (
    SELECT 1 FROM public.planilhas p
    WHERE p.id = daily_entries.planilha_id
      AND public.has_perpetuo_access(p.perpetuo_id)
  )
);

CREATE POLICY "daily_entries_update" ON daily_entries FOR UPDATE USING (
  public.get_user_role() = 'head'
  OR EXISTS (
    SELECT 1 FROM public.planilhas p
    WHERE p.id = daily_entries.planilha_id
      AND public.has_perpetuo_access(p.perpetuo_id)
  )
);

CREATE POLICY "daily_entries_delete" ON daily_entries FOR DELETE USING (
  public.get_user_role() = 'head'
);
