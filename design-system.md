# Design System v1.0

> O sistema de design define a identidade visual da marca. Cada token, cor e componente possui uma função específica na interface. Use este documento como referência única para vibe coding.

---

## Sumário

1. [Cores](#cores)
2. [Tipografia](#tipografia)
3. [Ícones](#ícones)
4. [Botões](#botões)
5. [Cards](#cards)
6. [Barras de Progresso](#barras-de-progresso)
7. [Formulários](#formulários)
8. [Alertas & Badges](#alertas--badges)
9. [Espaçamento](#espaçamento)
10. [Sombras & Border Radius](#sombras--border-radius)
11. [CSS Variables (Tokens)](#css-variables-tokens)

---

## Cores

> **Princípio:** Cores comunicam hierarquia e ação. Use Navy para elementos principais, Gold para destaques e CTAs, e White como base limpa.

### Primárias

| Nome        | Hex       | RGB              | Uso                                  |
|-------------|-----------|------------------|--------------------------------------|
| Navy Dark   | `#001321` | `rgb(0, 19, 33)` | Textos, fundos escuros, botões primary |
| Navy        | `#002C4A` | `rgb(0, 44, 74)` | Hover states, fundos secundários     |
| Gold        | `#B19365` | `rgb(177, 147, 101)` | CTAs, destaques, badges, links     |
| White       | `#FFFFFF` | `rgb(255, 255, 255)` | Fundo principal, cards, containers |

### Gold — Variações

| Nome          | Hex       | Uso                              |
|---------------|-----------|----------------------------------|
| Gold          | `#B19365` | CTA principal, ícones de destaque |
| Gold Light    | `#C9AD82` | Hover do gold, gradientes         |
| Gold Lighter  | `#E8D9C2` | Bordas de destaque, dividers      |
| Gold Lightest | `#F5EDE1` | Backgrounds sutis, badges leves   |

### Navy — Opacidades

| Nome     | Valor                      | Uso                              |
|----------|----------------------------|----------------------------------|
| Navy 90% | `rgba(0, 19, 33, 0.90)`   | Texto principal forte            |
| Navy 70% | `rgba(0, 19, 33, 0.70)`   | Texto secundário, labels         |
| Navy 50% | `rgba(0, 19, 33, 0.50)`   | Texto auxiliar, placeholders     |
| Navy 30% | `rgba(0, 19, 33, 0.30)`   | Metadados, hints, captions       |
| Navy 15% | `rgba(0, 19, 33, 0.15)`   | Bordas, separadores              |
| Navy 10% | `rgba(0, 19, 33, 0.10)`   | Bordas leves                     |
| Navy 5%  | `rgba(0, 19, 33, 0.05)`   | Backgrounds hover, ghost buttons |

### Grayscale

| Nome     | Hex       | Uso                              |
|----------|-----------|----------------------------------|
| Gray 50  | `#F8F9FA` | Background de seções, headers    |
| Gray 100 | `#F1F3F5` | Background de cards secundários  |
| Gray 200 | `#E9ECEF` | Bordas padrão, dividers          |
| Gray 300 | `#DEE2E6` | Bordas de inputs, progress track |
| Gray 400 | `#CED4DA` | Bordas de checkboxes, disabled   |

### Semânticas

| Nome    | Hex       | RGB                 | Uso                            |
|---------|-----------|---------------------|--------------------------------|
| Success | `#2E7D32` | `rgb(46, 125, 50)`  | Confirmações, status positivo  |
| Warning | `#F57C00` | `rgb(245, 124, 0)`  | Alertas, atenção               |
| Error   | `#C62828` | `rgb(198, 40, 40)`  | Erros, exclusão, status crítico|
| Info    | `#1565C0` | `rgb(21, 101, 192)` | Informações, dicas             |

### Gradientes

| Nome         | CSS                                                  | Uso                          |
|--------------|------------------------------------------------------|------------------------------|
| Navy         | `linear-gradient(135deg, #001321, #002C4A)`          | Fundos de cards, hero sections |
| Gold         | `linear-gradient(135deg, #B19365, #C9AD82)`          | CTAs premium, badges         |
| Navy → Gold  | `linear-gradient(135deg, #001321, #B19365)`          | Barras de progresso, acentos |
| Soft Blend   | `linear-gradient(135deg, #002C4A, #C9AD82)`          | Backgrounds decorativos      |

---

## Tipografia

### Fontes

| Tipo       | Família             | Uso                                          |
|------------|---------------------|----------------------------------------------|
| Primária   | **Poppins** | Headlines, body, labels, botões            |
| Monospace  | **JetBrains Mono**    | Código, dados numéricos, hex values, tokens |

**CDN:**
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Escala Tipográfica

| Token       | Tamanho | Peso | Line-height | Tracking  | Uso                          |
|-------------|---------|------|-------------|-----------|------------------------------|
| Display     | 48px    | 800  | 1.1         | -1.5px    | Hero headlines               |
| Heading 1   | 36px    | 800  | 1.15        | -1px      | Títulos de página            |
| Heading 2   | 28px    | 700  | 1.2         | -0.5px    | Títulos de seção             |
| Heading 3   | 22px    | 700  | 1.3         | -0.3px    | Sub-seções                   |
| Heading 4   | 18px    | 600  | 1.4         | 0         | Card titles, sub-headers     |
| Body        | 14px    | 400  | 1.6         | 0         | Parágrafos, descrições       |
| Small       | 12px    | 500  | 1.5         | 0         | Metadados, timestamps        |
| Overline    | 11px    | 700  | 1.4         | 1.5px     | Labels de categoria (UPPERCASE) |
| Code        | 13px    | 400  | 1.5         | 0         | Código, valores (JetBrains Mono) |

### Exemplo de CSS

```css
/* Display */
.display {
  font-family: 'Poppins', sans-serif;
  font-size: 48px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1.5px;
  color: var(--navy-dark);
}

/* Body */
.body {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--navy-dark);
}

/* Overline / Label */
.overline {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--gold);
}

/* Code */
.code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 400;
  color: var(--navy-70);
}
```

---

## Ícones

> Ícones SVG outline com `stroke-width: 2`, sem fill. Tamanhos: 24×24px (padrão), 20×20px (inline), 16×16px (compacto).

### Conjunto Base

| Ícone         | Nome SVG    | Uso                              |
|---------------|-------------|----------------------------------|
| 🏠 Home       | `home`      | Navegação principal              |
| 👤 Perfil     | `user`      | Conta, avatar                    |
| 🛡 Segurança  | `shield`    | Proteção, verificação            |
| 🔍 Buscar     | `search`    | Campos de busca, filtros         |
| 📊 Dashboard  | `layout`    | Painel, visão geral              |
| 📄 Documento  | `file-text` | Arquivos, conteúdo               |
| ✉️ Email      | `mail`      | Mensagens, comunicação           |
| 🔔 Notificação| `bell`      | Alertas, updates                 |
| ⚙️ Config     | `settings`  | Configurações, preferências      |
| 💰 Finanças   | `dollar`    | Pagamentos, receita              |
| 📈 Analytics  | `bar-chart` | Métricas, relatórios             |
| 📉 Métricas   | `activity`  | Performance, monitoramento       |
| ✅ Sucesso    | `check-circle` | Confirmação, completo         |
| ❌ Erro       | `x-circle`  | Erro, falha                      |
| ⚠️ Alerta     | `alert-triangle` | Atenção, warning            |
| ℹ️ Info       | `info`      | Informação, ajuda                |
| 💳 Cartão     | `credit-card` | Pagamento, billing             |
| 💬 Chat       | `message-square` | Suporte, conversas          |
| 👥 Equipe     | `users`     | Times, colaboradores             |
| 💼 Trabalho   | `briefcase` | Projetos, portfólio              |
| 📍 Localização| `map-pin`   | Endereços, geo                   |
| 📅 Calendário | `calendar`  | Datas, agendamento               |
| 🔗 Link       | `external-link` | Links externos               |
| ⬇️ Download  | `download`  | Baixar arquivos                  |
| ☁️ Upload     | `upload-cloud` | Enviar arquivos               |

### Regras de Uso

- **Estilo:** Sempre outline (stroke), nunca preenchido (fill)
- **Stroke width:** 2px para todos os tamanhos
- **Cor padrão:** `var(--navy-dark)` — herda `currentColor`
- **Hover:** Pode usar `var(--gold)` para interações

### Exemplo SVG

```html
<!-- Ícone Home 24x24 -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  <polyline points="9 22 9 12 15 12 15 22"/>
</svg>
```

---

## Botões

> Componentes de ação com hierarquia visual clara. Cada variante serve um propósito específico no fluxo da interface.

### Variantes

| Variante      | Background         | Texto              | Borda                  | Uso                        |
|---------------|--------------------|--------------------|------------------------|----------------------------|
| Primary       | `--navy-dark`      | `--white`          | Nenhuma                | Ação principal             |
| Gold          | `--gold`           | `--white`          | Nenhuma                | CTA premium, conversão     |
| Outline       | Transparente       | `--navy-dark`      | `--navy-15` (1.5px)   | Ação secundária            |
| Outline Gold  | Transparente       | `--gold`           | `--gold` (1.5px)       | Destaque secundário        |
| Ghost         | Transparente       | `--navy-dark`      | Nenhuma                | Cancelar, ações terciárias |
| Ghost Gold    | Transparente       | `--gold`           | Nenhuma                | Links estilizados          |
| Danger        | `--error`          | `--white`          | Nenhuma                | Excluir, ações destrutivas |
| Success       | `--success`        | `--white`          | Nenhuma                | Confirmar, salvar          |

### Tamanhos

| Token | Padding         | Font Size | Border Radius |
|-------|-----------------|-----------|---------------|
| LG    | `14px 28px`     | 15px      | 10px (md)     |
| MD    | `10px 22px`     | 13.5px    | 6px (sm)      |
| SM    | `7px 16px`      | 12px      | 6px (sm)      |

### Estados

| Estado   | Efeito                                                |
|----------|-------------------------------------------------------|
| Default  | Estilo base da variante                               |
| Hover    | Primary/Gold: fundo mais claro + `shadow-md`. Outline: borda escurece + bg `navy-05` |
| Disabled | `opacity: 0.4`, `cursor: not-allowed`, sem pointer events |
| Focus    | Outline de 3px com cor da variante (gold-lightest para gold, navy-05 para navy) |

### Botão com Ícone

- Ícone de 16×16px ao lado do texto
- Gap de 8px entre ícone e texto
- Ícone à esquerda para "criar/adicionar", à direita para "próximo/avançar"

### Botão Icon-Only

| Tamanho | Dimensão | Radius |
|---------|----------|--------|
| LG      | 48×48px  | 10px   |
| MD      | 40×40px  | 6px    |
| SM      | 32×32px  | 6px    |

### Exemplo de CSS

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

.btn-lg { padding: 14px 28px; font-size: 15px; border-radius: var(--radius-md); }
.btn-md { padding: 10px 22px; font-size: 13.5px; }
.btn-sm { padding: 7px 16px; font-size: 12px; }

.btn-primary { background: var(--navy-dark); color: var(--white); }
.btn-primary:hover { background: var(--navy); box-shadow: var(--shadow-md); }

.btn-gold { background: var(--gold); color: var(--white); }
.btn-gold:hover { background: var(--gold-light); box-shadow: var(--shadow-md); }

.btn-outline { background: transparent; color: var(--navy-dark); border: 1.5px solid var(--navy-15); }
.btn-outline:hover { border-color: var(--navy-dark); background: var(--navy-05); }

.btn-outline-gold { background: transparent; color: var(--gold); border: 1.5px solid var(--gold); }
.btn-outline-gold:hover { background: var(--gold-lightest); }

.btn-ghost { background: transparent; color: var(--navy-dark); }
.btn-ghost:hover { background: var(--navy-05); }

.btn-danger { background: var(--error); color: var(--white); }
.btn-success { background: var(--success); color: var(--white); }

.btn:disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
```

---

## Cards

> Containers para agrupar conteúdo relacionado. Variações para diferentes contextos e hierarquias visuais.

### Variantes

| Variante     | Background     | Borda                | Imagem/Header                                      |
|--------------|----------------|----------------------|-----------------------------------------------------|
| Default      | `--white`      | `--gray-200` (1px)   | `linear-gradient(135deg, --navy-dark, --navy)`       |
| Dark         | `--navy-dark`  | Nenhuma              | `linear-gradient(135deg, --navy, --gold)`            |
| Gold Accent  | `--white`      | `--gold-lighter` (1px)| `linear-gradient(135deg, --gold, --gold-light)`     |

### Estrutura do Card de Conteúdo

```
┌──────────────────────────┐
│       Card Image         │  height: 180px
│       (gradient bg)      │  Badge: position absolute, top-right
│                          │
├──────────────────────────┤
│  OVERLINE TAG            │  11px, uppercase, gold, tracking 1.2px
│  Card Title              │  17px, weight 700
│  Card description text   │  13px, navy-50, line-height 1.6
│  [  Full-width Button  ]│  btn-md, width 100%
├──────────────────────────┤
│  Meta left    Meta right │  14px padding, border-top gray-200
└──────────────────────────┘
```

- **Border radius:** `var(--radius-lg)` — 14px
- **Hover:** `translateY(-4px)` + `shadow-lg`
- **Transition:** `transform 0.25s, box-shadow 0.25s`

### Card de Estatísticas

```
┌──────────────────────────┐
│  [Icon Box]              │  40×40px, radius-sm
│                          │  Navy: bg navy-dark, icon white
│  R$ 47.8K                │  28px, weight 800, tracking -1px
│  Receita do mês          │  12.5px, navy-50
│  ↑ +12.5%                │  Badge pill, 12px, weight 600
└──────────────────────────┘
```

- **Padding:** 24px
- **Border:** 1px `--gray-200`
- **Hover:** `translateY(-2px)` + `shadow-md`
- **Change up:** `background: #E8F5E9`, `color: var(--success)`
- **Change down:** `background: #FFEBEE`, `color: var(--error)`

### Card de Perfil

```
┌──────────────────────────┐
│         [Avatar]         │  64×64px, circle
│       Nome Completo      │  16px, weight 700
│         Cargo            │  12.5px, gold, weight 600
│  ─────────────────────── │
│   152      47K     4.9   │
│  Produtos  Alunos  Rating│
└──────────────────────────┘
```

- **Avatar:** Gradient navy-dark → navy, iniciais em gold
- **Padding:** 28px, text-align center

---

## Barras de Progresso

### Linear

| Variante       | Cor/CSS                                              |
|----------------|------------------------------------------------------|
| Navy           | `background: var(--navy-dark)`                       |
| Gold           | `background: var(--gold)`                            |
| Gradient       | `background: linear-gradient(90deg, var(--navy-dark), var(--gold))` |
| Success        | `background: var(--success)`                         |
| Warning        | `background: var(--warning)`                         |
| Error          | `background: var(--error)`                           |

### Tamanhos da Track

| Token | Altura | Uso                              |
|-------|--------|----------------------------------|
| LG    | 12px   | Metas principais, dashboards     |
| MD    | 8px    | Padrão geral                     |
| SM    | 5px    | Inline, contextos compactos      |
| XS    | 3px    | Indicadores sutis, loading bars  |

### Estrutura

```css
.progress-track {
  height: 8px;
  border-radius: 100px;
  background: var(--gray-200);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 100px;
  transition: width 1s ease;
}
```

### Layout do Progress Item

```
Label de contexto                75%
[████████████████████░░░░░░░░░░░░]
```

- Header: `display: flex; justify-content: space-between`
- Label: 13px, weight 600
- Value: JetBrains Mono, 12px, navy-50

### Circular

- **Tamanho:** 100×100px
- **Track:** `stroke: var(--gray-200)`, `stroke-width: 6`, sem fill
- **Fill:** `stroke-width: 6`, `stroke-linecap: round`
- **Cálculo:** `stroke-dasharray: 264` (circunferência), `stroke-dashoffset: 264 × (1 - percentual)`
- **Rotação:** `transform: rotate(-90deg)` no SVG

```css
/* Exemplo: 75% */
.circular-fill {
  fill: none;
  stroke: var(--navy-dark);
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: 264;
  stroke-dashoffset: 66;  /* 264 × (1 - 0.75) = 66 */
}
```

### Steps / Etapas

```
[✓]───[✓]───[3]───[4]
Done   Done  Active Pending
```

| Estado  | Círculo                              | Linha                                    |
|---------|--------------------------------------|------------------------------------------|
| Done    | bg navy-dark, border navy-dark, ✓ white | bg navy-dark                           |
| Active  | bg gold, border gold, número white   | `linear-gradient(90deg, navy-dark, gray-300)` |
| Pending | bg white, border gray-300, número navy-30 | bg gray-300                          |

- **Círculo:** 32×32px, border-radius 50%, border 2px
- **Número:** 12px, weight 700
- **Linha:** height 2px, flex: 1

---

## Formulários

### Input de Texto

```css
.form-input {
  width: 100%;
  padding: 10px 14px;
  font-family: 'Poppins', sans-serif;
  font-size: 13.5px;
  border: 1.5px solid var(--gray-300);
  border-radius: var(--radius-sm);     /* 6px */
  background: var(--white);
  color: var(--navy-dark);
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.form-input:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px var(--gold-lightest);
}

.form-input::placeholder {
  color: var(--navy-30);
}

.form-input.error {
  border-color: var(--error);
}
```

### Labels e Hints

| Elemento    | Font Size | Weight | Cor          |
|-------------|-----------|--------|--------------|
| Label       | 12.5px    | 600    | `--navy-70`  |
| Hint        | 11px      | 400    | `--navy-30`  |
| Hint Error  | 11px      | 400    | `--error`    |

### Checkbox

| Estado     | Background     | Borda         | Ícone        |
|------------|----------------|---------------|--------------|
| Unchecked  | `--white`      | `--gray-400`  | Nenhum       |
| Checked    | `--navy-dark`  | `--navy-dark` | ✓ branco, 12px |

- **Tamanho:** 18×18px, border-radius 4px, border 1.5px

### Radio Button

| Estado     | Borda         | Inner dot     |
|------------|---------------|---------------|
| Unchecked  | `--gray-400`  | Nenhum        |
| Checked    | `--gold`      | 9×9px, gold   |

- **Tamanho:** 18×18px, border-radius 50%, border 1.5px

### Toggle

| Estado | Background    | Knob Position |
|--------|---------------|---------------|
| Off    | `--gray-300`  | `left: 3px`  |
| On     | `--gold`      | `left: 23px` |

- **Track:** 44×24px, border-radius 100px
- **Knob:** 18×18px, border-radius 50%, white, `box-shadow: 0 1px 3px rgba(0,0,0,0.15)`

---

## Alertas & Badges

### Alertas

| Variante | Background | Cor texto   | Ícone           |
|----------|------------|-------------|-----------------|
| Info     | `#E3F2FD`  | `--info`    | `info`          |
| Success  | `#E8F5E9`  | `--success` | `check-circle`  |
| Warning  | `#FFF3E0`  | `--warning` | `alert-triangle` |
| Error    | `#FFEBEE`  | `--error`   | `x-circle`      |

- **Padding:** 14px 18px
- **Border radius:** `var(--radius-sm)` — 6px
- **Font size:** 13px
- **Layout:** flex, align-items flex-start, gap 10px
- **Ícone:** 18×18px, flex-shrink 0

### Badges

| Variante | Background      | Cor texto     | Borda                |
|----------|-----------------|---------------|----------------------|
| Navy     | `--navy-dark`   | `--white`     | Nenhuma              |
| Gold     | `--gold`        | `--white`     | Nenhuma              |
| Outline  | Transparente    | `--navy-dark` | `--navy-15` (1.5px)  |
| Success  | `#E8F5E9`       | `--success`   | Nenhuma              |
| Warning  | `#FFF3E0`       | `--warning`   | Nenhuma              |
| Error    | `#FFEBEE`       | `--error`     | Nenhuma              |

- **Font size:** 11px, weight 700
- **Padding:** 4px 10px
- **Border radius:** 100px (pill)

---

## Espaçamento

> Escala base-4 para manter consistência e ritmo visual.

| Token | Valor | Uso                                    |
|-------|-------|----------------------------------------|
| xs    | 4px   | Gaps mínimos, ícone-texto inline       |
| sm    | 8px   | Gaps entre badges, elementos compactos |
| md    | 12px  | Padding interno de pills, gaps médios  |
| base  | 16px  | Padding padrão, gaps entre componentes |
| lg    | 20px  | Padding de cards, seções               |
| xl    | 24px  | Seções internas, card body             |
| 2xl   | 32px  | Separação entre blocos de conteúdo     |
| 3xl   | 40px  | Separação entre seções                 |
| 4xl   | 48px  | Padding de página, margens externas    |
| 5xl   | 64px  | Gaps entre seções grandes              |
| 6xl   | 80px  | Margens hero, separação macro          |

---

## Sombras & Border Radius

### Sombras

| Token     | CSS                                     | Uso                              |
|-----------|-----------------------------------------|----------------------------------|
| shadow-sm | `0 1px 3px rgba(0,19,33,0.08)`         | Dropdowns, tooltips              |
| shadow-md | `0 4px 12px rgba(0,19,33,0.10)`        | Cards hover, botões hover        |
| shadow-lg | `0 8px 30px rgba(0,19,33,0.12)`        | Modals, cards elevados           |
| shadow-xl | `0 16px 50px rgba(0,19,33,0.16)`       | Overlays, hero elements          |

### Border Radius

| Token     | Valor | Uso                              |
|-----------|-------|----------------------------------|
| radius-sm | 6px   | Botões MD/SM, inputs, badges     |
| radius-md | 10px  | Botões LG, color cards, tooltips |
| radius-lg | 14px  | Cards, containers                |
| radius-xl | 20px  | Modals, grandes containers       |
| full      | 50%   | Avatares, toggles, pills         |

---

## CSS Variables (Tokens)

Copie e cole este bloco na raiz do seu projeto:

```css
:root {
  /* === CORES PRIMÁRIAS === */
  --navy-dark: #001321;
  --navy: #002C4A;
  --white: #FFFFFF;
  --gold: #B19365;

  /* === GOLD VARIAÇÕES === */
  --gold-light: #C9AD82;
  --gold-lighter: #E8D9C2;
  --gold-lightest: #F5EDE1;

  /* === NAVY OPACIDADES === */
  --navy-90: rgba(0, 19, 33, 0.9);
  --navy-70: rgba(0, 19, 33, 0.7);
  --navy-50: rgba(0, 19, 33, 0.5);
  --navy-30: rgba(0, 19, 33, 0.3);
  --navy-15: rgba(0, 19, 33, 0.15);
  --navy-10: rgba(0, 19, 33, 0.10);
  --navy-05: rgba(0, 19, 33, 0.05);

  /* === GRAYSCALE === */
  --gray-50: #F8F9FA;
  --gray-100: #F1F3F5;
  --gray-200: #E9ECEF;
  --gray-300: #DEE2E6;
  --gray-400: #CED4DA;

  /* === SEMÂNTICAS === */
  --success: #2E7D32;
  --warning: #F57C00;
  --error: #C62828;
  --info: #1565C0;

  /* === BORDER RADIUS === */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;

  /* === SOMBRAS === */
  --shadow-sm: 0 1px 3px rgba(0, 19, 33, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 19, 33, 0.10);
  --shadow-lg: 0 8px 30px rgba(0, 19, 33, 0.12);
  --shadow-xl: 0 16px 50px rgba(0, 19, 33, 0.16);

  /* === TIPOGRAFIA === */
  --font-primary: 'Poppins', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

## Cores das Colunas da Planilha

> Cores pastel por categoria para facilitar a leitura da planilha tipo spreadsheet.

| Categoria | Header | Células | Hex |
|-----------|--------|---------|-----|
| Investimento / CPM | Azul escuro | Azul claro pastel | `#EBF5FF` |
| Faturamento / Vendas / Lucro / Margem | Verde escuro | Verde claro pastel | `#E8F5E9` |
| Order Bumps (1-5) | Amarelo escuro | Amarelo claro pastel | `#FFF8E1` |
| Upsell / Downsell | Roxo escuro | Roxo claro pastel | `#F3E5F5` |
| Tráfego (CTR, Page Views, Checkout, Funil) | Laranja escuro | Laranja claro pastel | `#FFF3E0` |
| CPA / Ticket Médio | Cinza escuro | Cinza claro | `#F5F5F5` |

### Cores dinâmicas nos valores

| Campo | Condição | Cor |
|-------|----------|-----|
| Lucro | Positivo | Verde `#2E7D32` |
| Lucro | Negativo | Vermelho `#C62828` |
| Margem % | Acima de 0% | Verde `#2E7D32` |
| Margem % | Abaixo de 0% | Vermelho `#C62828` |

---

> **Design System v1.1** — Atualizado em Março 2026
> Fonte primária alterada de Plus Jakarta Sans para Poppins.
> Adicionadas cores pastel por categoria para colunas da planilha.
