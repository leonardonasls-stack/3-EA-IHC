# 🧾 CaixaRápido — PDV & Gestão de Estoque

**CaixaRápido** é um sistema de Ponto de Venda (PDV) e Gestão de Estoque desenvolvido como Progressive Web App (PWA). Projetado para pequenos comércios como mercearias, padarias e conveniências, o sistema oferece uma interface moderna, responsiva e funcional — pronto para ser utilizado tanto em computadores quanto em dispositivos móveis.

> Projeto desenvolvido para a **3ª Etapa Avaliativa (EA)**.

---

## 📸 Funcionalidades

### Frente de Caixa (PDV)
- 🔍 **Busca de produtos** por nome ou código de barras
- 🏷️ **Filtro por categorias**: Bebidas, Frios, Mercearia, Limpeza e Padaria
- 🛒 **Carrinho de compras** com edição de quantidade inline
- 💳 **Formas de pagamento**: PIX, Cartão e Dinheiro
- ✅ **Finalização de venda** com abatimento automático de estoque
- 🚫 **Bloqueio inteligente** que impede venda de itens esgotados ou acima do estoque

### Gestão & Estoque
- 📊 **Resumo financeiro do dia**: Vendas Brutas, Capital de Giro (50% das vendas) e Lucro Livre Estimado
- 🚦 **Semáforo de estoque**: indicadores visuais (verde/amarelo/vermelho) para cada produto
- 🔄 **Reposição de estoque** via modal com quantidade personalizável
- ⚠️ **Alertas de produtos** com baixo estoque ou esgotados

### Alertas & Notificações
- 🔔 Barra de avisos no PDV com contagem em tempo real de produtos em baixa ou esgotados
- 📋 Modais detalhados exibindo lista dos produtos que necessitam atenção

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Função |
|---|---|---|
| **React** | 19.x | Biblioteca de UI |
| **TypeScript** | 6.x | Tipagem estática |
| **Vite** | 8.x | Bundler e dev server |
| **Tailwind CSS** | 4.x | Estilização utilitária |
| **React Router DOM** | 7.x | Navegação SPA |
| **Phosphor Icons** | 2.x | Biblioteca de ícones |
| **Vite PWA Plugin** | 1.x | Suporte a PWA/Service Worker |
| **Oxlint** | 1.x | Linter de código |

---

## 📂 Estrutura do Projeto

```
caixarapido/
├── index.html                  # Ponto de entrada HTML
├── package.json                # Dependências e scripts
├── vite.config.ts              # Configuração do Vite + PWA
├── tailwind.config.js          # Tema e cores customizadas
├── tsconfig.json               # Configuração TypeScript
│
├── public/                     # Arquivos estáticos (favicon, ícones PWA)
│
└── src/
    ├── main.tsx                # Bootstrap da aplicação
    ├── App.tsx                 # Rotas e providers
    ├── types.ts                # Tipos globais (Product, CartItem)
    │
    ├── assets/css/
    │   └── index.css           # Estilos globais + Tailwind
    │
    ├── components/
    │   ├── common/
    │   │   └── AlertContainer  # Barra de alertas de estoque
    │   └── layout/
    │       └── Header          # Cabeçalho com logo e status
    │
    ├── contexts/
    │   ├── CartContext          # Estado do carrinho de compras
    │   ├── ModalContext         # Sistema de modais/feedback
    │   └── ProductsContext      # Catálogo, estoque e vendas
    │
    └── pages/
        ├── POS/                # Tela principal do PDV
        └── Inventory/          # Tela de Gestão & Estoque
```

---

## 🚀 Como Rodar

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18 ou superior)
- npm (incluído com o Node.js)

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta do projeto
cd caixarapido

# Instale as dependências
npm install
```

### Desenvolvimento

```bash
npm run dev
```

O servidor de desenvolvimento iniciará em `http://localhost:5173` (acessível pela rede local via `--host`).

### Build de Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Preview da Build

```bash
npm run preview
```

---

## 💾 Persistência de Dados

O sistema utiliza **`localStorage`** para manter os dados entre sessões:

| Chave | Descrição |
|---|---|
| `@CaixaRapido:products_v2` | Catálogo de produtos com estoque atualizado |
| `@CaixaRapido:grossSales_v2` | Acumulado de vendas brutas do dia |

> ⚠️ Para resetar os dados, limpe o `localStorage` do navegador (DevTools → Application → Local Storage → Clear).

---

## 📱 PWA (Progressive Web App)

O CaixaRápido pode ser **instalado como aplicativo** diretamente pelo navegador, funcionando como um app nativo:

- ✅ Funciona offline (após primeiro carregamento)
- ✅ Ícone na tela inicial do celular/desktop
- ✅ Experiência em tela cheia (`standalone`)
- ✅ Atualização automática do Service Worker

---

## 🎨 Design System

- **Tipografia**: Inter (Google Fonts)
- **Paleta principal**: Azul Marinho (`#1e3a8a`), Verde (`#22c55e`), Vermelho (`#dc2626`)
- **Tema**: Fundo claro com cards brancos e bordas suaves
- **Responsividade**: Layout adaptativo para mobile (coluna única com scroll) e desktop (painéis lado a lado)

---

## 👥 Autores

Projeto desenvolvido para fins acadêmicos — **3ª Etapa Avaliativa**.

---

## 📄 Licença

Este projeto é de uso acadêmico e não possui licença de distribuição comercial.
