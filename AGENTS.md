# 🤖 AGENTS.md - Diretrizes de Engenharia e Arquitetura do Flame

Este documento serve como a fonte de verdade para agentes de IA e desenvolvedores que trabalham no repositório **Flame**. Ele reúne o diagnóstico técnico da arquitetura, convenções de código, restrições do React 18, vulnerabilidades conhecidas e instruções de manutenção.

---

## 🧭 Visão Geral do Projeto

O **Flame** é uma biblioteca de gerenciamento de estado reativo para React, impulsionada por **RxJS (`BehaviorSubject`)** e **TypeScript**. Ela busca unificar:
1. **Orientação a Objetos (OOP)**: Stores criadas estendendo a classe base `Factory<T>`.
2. **Abordagem Funcional**: Stores criadas via `createStore<T>(initialData, config?, key?)`.
3. **React Hooks**: Consumo via hook seletor `useStore(store, selector)` ou `hookFactory(store)`.
4. **Ciclo de Vida e Efeitos**: Interfaces de contrato `OnInit` e `OnUpdate<T>` orquestradas via `SetupProvider` ou `setup.config()`.
5. **Persistência / Hidratação**: Sincronização automatizada com `localStorage` via `HydrateProvider`.

---

## 🔍 Diagnóstico Arquitetural e Decisões de Design

### 1. Reatividade e Armazenamento
- O estado fonte da verdade reside em um `BehaviorSubject<T>` privado dentro de `Factory<T>`.
- `store.data`: Leitura direta, síncrona e não-reativa do valor atual do `BehaviorSubject`.
- `store.observable`: `Observable<T>` puro para composição com operadores RxJS (`debounceTime`, `filter`, `switchMap`, etc.).
- `store.next(...)`: Despachador de mutações. Suporta 3 assinaturas:
  - Objeto parcial (`Partial<T>`)
  - Callback síncrono (`(prev: T) => Partial<T>`)
  - Callback assíncrono via Promise (`async (prev: T) => Promise<Partial<T>>`)

---

## ⚠️ Vulnerabilidades Conhecidas e Regras de Prevenção

Qualquer agente ou desenvolvedor modificando este código **deve obedecer rigorosamente às seguintes diretrizes**:

### 1. Regras dos Hooks do React (Rules of Hooks)
- **Problema anterior**: O getter `get state()` invocava `useSyncExternalStore` internamente.
- **Risco**: Chamar `store.state` fora do ciclo de renderização de componentes React (ex: dentro de handlers de clique, `setTimeout`, funções de serviço ou condicionais) causava crash fatal (`Invalid hook call`).
- **Diretriz**:
  - Para leitura reativa dentro de componentes, use SEMPRE o hook dedicado `useStore(store, selector?)` ou o hook gerado por `hookFactory(store)`.
  - `store.state` foi mantido apenas para compatibilidade legada, mas a documentação e novas implementações devem priorizar hooks explícitos.
  - O hook `useStore` deve suportar seletores granulares para evitar re-renders desnecessários.

### 2. Minificação em Produção (Terser / Vite / Rollup)
- **Problema anterior**: A hidratação (`HydrateModule.register`) utilizava `constructor.name` como chave única de persistência.
- **Risco**:
  1. Em builds de produção minificados, os nomes das classes são renomeados para `a`, `b`, etc., gerando colisão catastrófica de chaves no storage.
  2. Todas as stores criadas por `createStore` compartilhavam a mesma classe interna `Root`, colidindo entre si.
- **Diretriz**:
  - Cada store deve ter uma chave identificadora explícita (`key`).
  - `createStore` aceita `key?: string` como parâmetro.
  - A classe `Factory` aceita `key?: string` ou uma propriedade `key` estática/de instância. O fallback para `constructor.name` só deve ser usado em desenvolvimento quando nenhuma chave for fornecida.

### 3. Vazamento de Memória (Memory Leaks) e Teardown
- **Problema anterior**: No construtor de `Factory`, a store era empurrada para um array singleton global `setup.module = this` sem nenhum meio de limpeza. O `onUpdateSetup` realizava subscrições sem `unsubscribe`.
- **Diretriz**:
  - Toda subscrição interna de observáveis deve ser armazenada e cancelada em métodos de limpeza (`unsubscribe` / `teardown`).
  - O `Setup` deve permitir limpeza e remoção de módulos obsoletos.

### 4. Ambientes SSR (Server-Side Rendering)
- **Problema anterior**: Acesso direto e desprotegido a `localStorage` quebrava em frameworks SSR (Next.js, Remix, Astro).
- **Diretriz**:
  - A camada `LocalStorageProvider` DEVE verificar a existência de `window` e `localStorage` antes de qualquer chamada.
  - Todo `JSON.parse` deve estar envelopado em bloco `try / catch` para proteger a aplicação contra corrupções no storage.

### 5. Race Conditions no `HydrateProvider`
- **Problema anterior**: O `HydrateProvider` chamava `setIsHydrated(true)` sincronamente antes da Promise de hidratação resolver.
- **Diretriz**:
  - A renderização dos componentes filhos só deve ocorrer após a conclusão da hidratação (`isHydrated === true`).

---

## 🛠 Padrões de Código e Tooling

- **Gerenciador de Pacotes**: Yarn.
- **Testes**: Vitest com React Testing Library.
  - Comando: `yarn test` ou `yarn test:coverage`.
  - Todas as novas features devem manter a cobertura em **~99% a 100%**.
- **Build**: Vite Library Mode gerando `dist/flame.js` (ESM), `dist/flame.umd.cjs` (UMD/CJS) e `dist/index.d.ts` via `vite-plugin-dts`.
  - Comando: `yarn build`.
- **Linting & Formatação**: ESLint + TypeScript ESLint.

---

## 🚀 Pipeline de CI/CD (GitHub Actions)

- **Workflow**: `.github/workflows/publish.yml`
- **Gatilho**: Push na branch `main` ou publicação de release.
- **Etapas**:
  1. Instalação de dependências (`yarn install --frozen-lockfile`)
  2. Verificação de tipos e Testes (`yarn test:coverage`)
  3. Build do pacote (`yarn build`)
  4. Publicação no **GitHub Packages** (`@bruphillip/flame`) utilizando `GITHUB_TOKEN`.
