# PerpetuoHQ — Regras do projeto

## Stack
- Frontend: Next.js 14 App Router
- UI: Tailwind CSS + shadcn/ui
- Backend: Server Actions + API Routes
- Banco: Supabase (PostgreSQL)
- Auth: Supabase Auth (email/password)
- Storage: Supabase Storage (avatares de perfil)
- PDF: @react-pdf/renderer
- Deploy: Vercel

## Regras inegociáveis
1. Nunca instalar lib/pacote sem minha aprovação
2. Máximo 150 linhas por arquivo — se passar, quebre em componentes menores
3. TypeScript strict — nunca usar 'any', tipar TUDO
4. Ler progress.md antes de cada sessão para saber onde paramos
5. Commitar cada feature/fix que funciona antes de seguir para a próxima
6. Toda Server Action retorna { success: boolean, data?: T, error?: string }
7. Nunca fazer fetch client-side para dados que podem ser Server Component
8. Consultar design-system.md antes de criar ou modificar qualquer componente visual

## Estrutura de pastas
```
/app                    → Rotas e páginas (App Router)
  /app/(public)         → Login
  /app/(auth)           → Dashboard, perpétuos, planilhas, gestores, settings
  /app/api              → API Routes (export PDF)
/components             → Componentes React reutilizáveis
  /components/ui        → shadcn/ui components
  /components/dashboard → Cards de métricas, gráficos
  /components/planilha  → Grid tipo spreadsheet, células editáveis
  /components/perpetuos → Lista, card de perpétuo
  /components/gestores  → Formulário de gestor, lista
/lib                    → Utilitários, clients, helpers
  /lib/supabase         → Client e server Supabase configs
  /lib/utils            → Formatação de moeda, cálculos de métricas
/actions                → Server Actions organizadas por entidade
/types                  → TypeScript types e interfaces
```

## Naming conventions
- Arquivos de componente: PascalCase (ex: PlanilhaGrid.tsx)
- Arquivos de utility: camelCase (ex: formatCurrency.ts)
- Server Actions: camelCase com prefixo de ação (ex: createPerpetuo, updateDailyEntry, deleteGestor)
- Tabelas do banco: snake_case plural (ex: daily_entries, perpetuo_access)
- Campos do banco: snake_case (ex: created_at, faturamento_principal)
- Variáveis de ambiente: SCREAMING_SNAKE (ex: NEXT_PUBLIC_SUPABASE_URL)
- CSS classes: Tailwind utilities, seguindo design-system.md

## Segurança (inegociável)
1. TODA secret em variável de ambiente — NUNCA hardcoded
2. Auth obrigatória em TODA rota dentro de /(auth) — verificar sessão no layout
3. Validar TODA input do usuário com Zod antes de processar
4. .gitignore DEVE conter: .env, .env.local, node_modules, .next
5. RLS ativo em TODA tabela com dados de usuário — verificar role e perpetuo_access

## UI / Design system
- Seguir TODAS as specs do design-system.md (cores, tipografia, componentes, estados)
- Cores primárias: Navy Dark #001321, Gold #B19365, White #FFFFFF
- Font primária: Poppins (via next/font/local)
- Font mono: JetBrains Mono (para valores numéricos na planilha)
- Border radius padrão: rounded-lg (14px) em cards, rounded-md (10px) em botões LG, rounded (6px) em inputs
- Responsivo: mobile-first, breakpoints sm/md/lg do Tailwind
- Ícones: Lucide React, estilo outline, stroke-width 2

## Padrão de tratamento de erros
- Server Actions: sempre retornar { success, data, error }
- Client: toast de sucesso/erro usando sonner
- Divisão por zero em métricas calculadas: exibir "—" na interface
- Nunca mostrar stack trace ou erro técnico pro usuário final

## Git
- Commit a cada feature/fix que funciona
- Formato: "feat: [o que fez]" ou "fix: [o que corrigiu]"
- Branch main = produção
- NUNCA commitar com erros no build

## Regras de negócio importantes
- Valores monetários SEMPRE em centavos no banco, exibidos como R$ na interface
- Ao criar planilha, pré-criar daily_entries para todos os dias do mês
- Head vê tudo, Gestor vê apenas perpétuos com acesso concedido
- Dashboard agrega dados de daily_entries via queries no Supabase
- PDF exporta dados da planilha com o mesmo layout visual da interface
