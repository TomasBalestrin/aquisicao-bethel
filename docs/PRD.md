# PRD — PerpetuoHQ

## O que é
Sistema interno de gestão de perpétuos para empresas de tráfego pago. Centraliza planilhas de métricas diárias de produtos low ticket em um único lugar com padrão fixo, controle de acesso por gestor e dashboard consolidado.

## Pra quem
Head de tráfego e gestores de tráfego pago que hoje usam múltiplas planilhas do Google Sheets sem padrão. Nível técnico baixo — precisam de interface simples tipo planilha, sem fricção.

## Features do MVP
1. **Gestão de perpétuos** — CRUD de perpétuos (produtos). Ao clicar no perpétuo, abre tela para criar planilhas mensais (mês/ano)
2. **Planilhas padronizadas** — Interface tipo spreadsheet com métricas fixas + 5 order bumps customizáveis + 1 upsell + 1 downsell. Campos calculados automaticamente (lucro, margem, CPA, ticket médio, taxas de conversão, funil)
3. **Gestão de usuários** — Criar gestores com email/senha/foto de perfil. Dois níveis: Head de Tráfego (acesso total) e Gestor (acesso apenas aos perpétuos concedidos)
4. **Dashboard** — Visão consolidada com cards de métricas (investido, faturamento, lucro, margem, CPA, ticket médio), filtros por perpétuo e período, gráficos de evolução
5. **Exportação PDF** — Gerar relatório em PDF do fechamento mensal por perpétuo

## Anti-escopo (NÃO faz na v1)
- Integração com APIs de plataformas de pagamento (Hotmart, Kiwify, Monetizze)
- Integração com gerenciadores de anúncios (Facebook Ads, Google Ads)
- Edição colaborativa em tempo real (apenas um gestor por vez)
- App mobile nativo (responsivo basta)
- Notificações ou alertas automáticos
- Importação de planilhas existentes do Google Sheets
- Multi-empresa (é sistema interno de uma empresa)

## Monetização
Ferramenta interna — sem monetização. Custo operacional: Supabase free tier + Vercel free tier.

## Fluxo principal
1. Head faz login e acessa o dashboard geral com métricas consolidadas
2. Head cria um perpétuo novo e concede acesso a um gestor
3. Gestor faz login, vê apenas seus perpétuos, clica em um e cria a planilha do mês
4. Gestor preenche os dados diários na planilha — campos calculados atualizam automaticamente
5. Head filtra o dashboard por perpétuo/período e exporta PDF do fechamento
