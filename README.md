# 🔥 Flame

> Lightweight and reactive state management for React powered by RxJS and TypeScript.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://react.dev/)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-e7007b.svg)](https://rxjs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Flame aims to simplify state management in React applications by unifying object-oriented (OOP) and functional paradigms with RxJS observables under the hood.

---

## 📑 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
  - [1. Functional Approach (`createStore`)](#1-functional-approach-createstore)
  - [2. Object-Oriented Approach (`Factory`)](#2-object-oriented-approach-factory)
  - [3. Hook Factory Approach (`hookFactory`)](#3-hook-factory-approach-hookfactory)
- [Lifecycle Hooks (`onInit` & `onUpdate`)](#-lifecycle-hooks-oninit--onupdate)
  - [Configuring via `createStore`](#configuring-via-createstore)
  - [Configuring via Class Implementation](#configuring-via-class-implementation)
  - [Activating Lifecycle Hooks (`SetupProvider` or `setup.config()`)](#activating-lifecycle-hooks-setupprovider-or-setupconfig)
- [State Persistence & Hydration](#-state-persistence--hydration)
- [API Reference](#-api-reference)
- [Roadmap & Known Considerations](#-roadmap--known-considerations)
- [License](#-license)

---

## ✨ Features

- **Multi-paradigm**: Create stores with standard functions, OOP classes, or React hooks.
- **RxJS Under the Hood**: Pure reactive core backed by `BehaviorSubject` and `Observable`.
- **Flexible Updates**: Pass partial state objects, sync callbacks, or async Promise callbacks to `.next()`.
- **React 18 Ready**: Leverages `useSyncExternalStore` for external store subscriptions.
- **Lifecycle Integration**: Built-in support for `onInit` and `onUpdate` side effects.
- **Persistence Provider**: Optional local storage hydration via `HydrateProvider`.

---

## 📦 Installation

```bash
# Using Yarn
yarn add flame

# Using NPM
npm install flame
```

> **Peer Dependencies:** Make sure `react` and `react-dom` (>= 18.0.0) are installed in your project.

---

## 🚀 Quick Start

### 1. Functional Approach (`createStore`)

The functional API is the fastest way to get started:

```tsx
import React from 'react'
import { createStore } from 'flame'

interface UserState {
  name: string
  age: number
}

export const userStore = createStore<UserState>({
  name: 'John Doe',
  age: 30,
})

export function UserProfile() {
  return (
    <div>
      {/* Access reactive state directly in your component */}
      <h1>{userStore.state.name}</h1>
      <p>Age: {userStore.state.age}</p>

      {/* Update using partial object */}
      <button onClick={() => userStore.next({ age: 31 })}>Birthday</button>

      {/* Update using callback */}
      <button onClick={() => userStore.next((prev) => ({ age: prev.age + 1 }))}>
        Increment Age
      </button>

      {/* Update using async callback */}
      <button
        onClick={() =>
          userStore.next(async (prev) => {
            const res = await fetch('/api/user')
            const data = await res.json()
            return { name: data.name }
          })
        }
      >
        Sync Profile
      </button>
    </div>
  )
}
```

---

### 2. Object-Oriented Approach (`Factory`)

If you prefer class-based domain models, extend the `Factory` class:

```tsx
import React from 'react'
import { Factory } from 'flame'

interface CounterState {
  count: number
}

class CounterStore extends Factory<CounterState> {
  increment() {
    this.next((state) => ({ count: state.count + 1 }))
  }

  decrement() {
    this.next((state) => ({ count: state.count - 1 }))
  }
}

export const counterStore = new CounterStore({ count: 0 })

export function Counter() {
  return (
    <div>
      <p>Count: {counterStore.state.count}</p>
      <button onClick={() => counterStore.increment()}>+</button>
      <button onClick={() => counterStore.decrement()}>-</button>
    </div>
  )
}
```

---

### 3. Hook Factory Approach (`hookFactory`)

If you prefer tuple-like React hooks (`[state, setState]`):

```tsx
import React from 'react'
import { createStore, hookFactory } from 'flame'

const authStore = createStore({
  isAuthenticated: false,
  token: null as string | null,
})

export const useAuth = hookFactory(authStore)

export function AuthStatus() {
  const [auth, setAuth] = useAuth()

  if (!auth.isAuthenticated) {
    return (
      <button onClick={() => setAuth({ isAuthenticated: true, token: 'xyz123' })}>
        Log In
      </button>
    )
  }

  return (
    <div>
      <p>Logged in with token: {auth.token}</p>
      <button onClick={() => setAuth({ isAuthenticated: false, token: null })}>
        Log Out
      </button>
    </div>
  )
}
```

---

## 🔄 Lifecycle Hooks (`onInit` & `onUpdate`)

Stores can respond to initialization (`onInit`) and state mutations (`onUpdate`).

### Configuring via `createStore`

```ts
import { createStore } from 'flame'

export const userStore = createStore(
  { name: 'Alice', email: 'alice@example.com' },
  {
    onInit: async () => {
      console.log('User store initialized')
    },
    onUpdate: async (data) => {
      console.log('User state changed:', data)
    },
  }
)
```

### Configuring via Class Implementation

```ts
import { Factory } from 'flame'
import { OnInit } from 'flame/onInit/onInit.abstract'
import { OnUpdate } from 'flame/onUpdate/onUpdate.abstract'

interface SettingsState {
  theme: 'dark' | 'light'
}

class SettingsStore
  extends Factory<SettingsState>
  implements OnInit, OnUpdate<SettingsState>
{
  async onInit(): Promise<void> {
    const savedTheme = (localStorage.getItem('theme') as 'dark' | 'light') || 'light'
    this.next({ theme: savedTheme })
  }

  async onUpdate(state: SettingsState): Promise<void> {
    localStorage.setItem('theme', state.theme)
  }
}

export const settingsStore = new SettingsStore({ theme: 'light' })
```

### Activating Lifecycle Hooks (`SetupProvider` or `setup.config()`)

Trigger lifecycle hooks either via a React Provider or imperatively:

#### Option A: Using `<SetupProvider>`
```tsx
import React from 'react'
import { SetupProvider } from 'flame'

export function App() {
  return (
    <SetupProvider>
      <MainContent />
    </SetupProvider>
  )
}
```

#### Option B: Imperative Bootstrap
```ts
import { setup } from 'flame/setup'

// Call once during application bootstrap (e.g., main.tsx)
await setup.config()
```

---

## 💾 State Persistence & Hydration

Flame provides a built-in `HydrateProvider` that can persist your store state to `localStorage`:

```tsx
import React from 'react'
import { HydrateProvider, createStore } from 'flame'

class SessionStore extends Factory<{ sessionId: string }> {}
const sessionStore = new SessionStore({ sessionId: 'guest' })

export function App() {
  return (
    <HydrateProvider modules={[sessionStore]}>
      <div>Session: {sessionStore.state.sessionId}</div>
    </HydrateProvider>
  )
}
```

---

## 📚 API Reference

| Export | Type | Description |
|---|---|---|
| `Factory<T>` | Class | Base store class wrapping RxJS `BehaviorSubject`. |
| `createStore<T>(initial, config?)` | Function | Factory function creating a reactive store instance. |
| `hookFactory(store)` | Function | Converts a store instance into a React hook `() => [state, set]`. |
| `SetupProvider` | Component | Mounts and executes `onInit` and `onUpdate` handlers for registered stores. |
| `HydrateProvider` | Component | Hydrates and syncs store state with `localStorage`. |
| `store.state` | Getter | Subscribes current React component to store updates via `useSyncExternalStore`. |
| `store.data` | Getter | Direct synchronous access to current snapshot (non-reactive). |
| `store.observable` | Getter | Returns standard RxJS `Observable<T>` for pipe/subscription composition. |
| `store.next(payload)` | Method | Mutates store via partial object, sync callback, or async Promise. |

---

## 🛠 Roadmap & Known Considerations

- [ ] **Granular Selectors**: Add state selector support (`useStore(state => state.foo)`) to prevent unnecessary component re-renders.
- [ ] **SSR Compatibility**: Safely guard browser globals (`localStorage`, `window`) for Next.js / Remix environments.
- [ ] **Minification Safety for Hydration**: Decouple module registration keys from `constructor.name` to avoid production build collisions.
- [ ] **DevTools Integration**: Provide Redux DevTools extension bridge for time-travel debugging.

---

## 📄 License

MIT © [Bruno Philippe](https://github.com/bruphillip)
