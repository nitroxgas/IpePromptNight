# Dashboard 3D de Contribuições Ipê City

Este projeto foi constuido como resposta para o desafio proposto na **Prompt Nights da Founder Haus** de 05/03/2026, que consistia em construir com auxilio de IA um dashboard com informações para cidades do futuro. O desafio foi proposto pela **Ipê City** - Pop-up City que vai ocorrer no mês de abril em Florianópolis.

Dashboard web interativo que visualiza as contribuições dos repositórios da **Ipê City** em forma de cidade 3D (estilo Git City). Cada edificação representa um projeto, com altura proporcional à quantidade de contribuições, permitindo uma visualização intuitiva da atividade dos repositórios.
A ideia é visualizar a construção da Ipê City (Seus projetos), a medida que eles forem sendo implementados durante o período em que ela ocorrer.



## 🎯 Funcionalidades

- **Visualização 3D em Cidade**: Cada prédio representa um repositório da organização, com nome visível no topo e altura proporcional às contribuições
- **Interatividade**: 
  - Tooltip ao passar o mouse sobre as edificações
  - Clique para selecionar um projeto e visualizar detalhes
  - Painel lateral com informações detalhadas (abrir/fechar)
- **Métricas de Contribuição**: 
  - Visualização por projeto (total de contribuições por repositório)
  - Visualização por desenvolvedor (contribuições individuais)
  - Métrica composta: commits + pull requests
- **Acesso Público**: Página web acessível pela internet, sem necessidade de autenticação

## 🛠️ Tecnologias

- **React 18** - Biblioteca para construção da interface
- **TypeScript 5.x** - Tipagem estática
- **React Three Fiber (R3F)** - Renderização 3D com React
- **Three.js** - Engine gráfica 3D
- **@react-three/drei** - Helpers e utilitários para R3F
- **Vite** - Build tool e dev server
- **Vitest** - Framework de testes unitários
- **Playwright** - Testes end-to-end

## 📋 Pré-requisitos

- **Node.js** 18 ou superior
- **npm** ou **pnpm** para gerenciamento de pacotes

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd cfo
```

2. Instale as dependências:
```bash
cd frontend
npm install
```

3. Verifique se existe o arquivo de dados:
   - O arquivo `frontend/public/data/seed.json` deve conter os dados fictícios (15 projetos, 20 desenvolvedores)
   - Consulte `specs/001-ipe-city-dashboard/contracts/seed-data.md` para o formato esperado

## 💻 Executando o Projeto

### Modo Desenvolvimento

```bash
cd frontend
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

### Build para Produção

```bash
cd frontend
npm run build
```

Os arquivos estáticos serão gerados em `frontend/dist/`. Para visualizar localmente:

```bash
npm run preview
```

Ou use qualquer servidor de arquivos estáticos:
```bash
npx serve frontend/dist
```

## 📁 Estrutura do Projeto

```
.
├── frontend/                    # Aplicação React
│   ├── src/
│   │   ├── components/         # Componentes React (City, Building, SidePanel)
│   │   ├── data/              # Loader de dados e tipos TypeScript
│   │   ├── App.tsx             # Componente principal
│   │   └── main.tsx           # Entry point
│   ├── public/
│   │   └── data/
│   │       └── seed.json      # Dados fictícios (15 projetos, 20 devs)
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── specs/                       # Documentação da feature
│   └── 001-ipe-city-dashboard/
│       ├── spec.md             # Especificação completa
│       ├── plan.md              # Plano de implementação
│       ├── quickstart.md       # Guia rápido
│       ├── data-model.md       # Modelo de dados
│       ├── contracts/          # Contratos de dados
│       └── tasks.md            # Tarefas de implementação
└── tests/                       # Testes (E2E, integração, unitários)
    ├── e2e/
    ├── integration/
    └── unit/
```

## 📊 Modelo de Dados

O projeto utiliza dados estáticos em formato JSON com a seguinte estrutura:

- **Project**: Representa um repositório (id, name, totalContributions)
- **Developer**: Representa um contribuidor (id, name)
- **Contribution**: Métrica composta por par (projeto, desenvolvedor) com commits e pull requests

A altura de cada edificação é calculada a partir de `totalContributions` do projeto, que é a soma de todas as contribuições (commits + PRs) daquele repositório.

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes em modo watch
npm run test:watch

# Testes end-to-end
npm run test:e2e
```

## 📚 Documentação Adicional

- **[Especificação Completa](./specs/001-ipe-city-dashboard/spec.md)** - Requisitos funcionais e critérios de sucesso
- **[Guia Rápido](./specs/001-ipe-city-dashboard/quickstart.md)** - Setup e execução rápida
- **[Plano de Implementação](./specs/001-ipe-city-dashboard/plan.md)** - Arquitetura e decisões técnicas
- **[Modelo de Dados](./specs/001-ipe-city-dashboard/data-model.md)** - Estrutura de entidades e relacionamentos
- **[Contrato de Dados](./specs/001-ipe-city-dashboard/contracts/seed-data.md)** - Formato do JSON de seed

## 🌐 Deploy

Para tornar o dashboard acessível publicamente na internet, faça deploy da pasta `frontend/dist/` em qualquer serviço de hospedagem estática:

- **Vercel**: Conecte o repositório e configure o diretório de build como `frontend`
- **Netlify**: Configure o build command como `cd frontend && npm run build` e publish directory como `frontend/dist`
- **GitHub Pages**: Use GitHub Actions para fazer build e deploy automático

## 🎨 Características Visuais

- Cena 3D com iluminação ambiente e direcional
- Fog (névoa) para profundidade visual
- Controles de câmera (rotação, zoom, pan)
- Tooltip informativo ao passar o mouse
- Painel lateral responsivo com detalhes dos projetos e desenvolvedores

## ✅ Critérios de Sucesso

- ✅ Página carrega em menos de 10 segundos em conexão típica
- ✅ Todas as edificações exibem nome e altura proporcional às contribuições
- ✅ Dados de contribuição acessíveis por projeto e por desenvolvedor
- ✅ Funciona em navegadores desktop modernos (Chrome, Firefox, Edge, Safari)

## 📝 Status do Projeto

**Versão**: 0.0.1  
**Status**: MVP com dados fictícios  
**Branch**: `001-ipe-city-dashboard`

## 🤝 Contribuindo

Este projeto segue princípios de desenvolvimento orientado a testes (TDD) e documentação estruturada. Consulte a documentação em `specs/` para entender os requisitos e padrões do projeto.

## 📄 Desenvolvido com o uso do Cursor e Speckit

---

**Desenvolvido para a organização Ipê City** 🌳
