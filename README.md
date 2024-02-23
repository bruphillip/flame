# Project Title

🔥 Flame 🔥 React State Managements based on Rxjs powered by Typescript

## Overview

This project intent to be an option of state management, doing the process of manage state simple as override variable

## Features

- Can be create like classes or function or even hooks

  -- Functions

```ts
// Classes
class UserStore extends Factory<UserStoreType> {}
const userStore = new UserStore({
  age: 20,
  email: 'teste@teste',
  name: 'Teste User',
})

//Hooks
const useUserStore = hookFactory(userStore)

function Component() {
  const [user, setUser] = useUserStore()
}

// Functions
const userStore = createStore<UserStoreType>({
  age: 20,
  email: 'teste@teste',
  name: 'Teste User',
})
```

-- Setup Provider gives you acess to your bases (onUpdate | onInit)

```ts
const userStore = createStore<UserStoreType>(
  {
    age: 20,
    email: 'teste@teste',
    name: 'Teste User',
  },
  {
    onInit: () => {}, // On init program,
    onUpdate: (user) => {}, // On state update,
  }
)

function Base() {
  return (
    <SetupProvider>
      <div>{userStore.state.name}</div>
    </SetupProvider>
  )
}
```

-- It can also be iniciated in code

```ts
const userStore = createStore<UserStoreType>(
  {
    age: 20,
    email: 'teste@teste',
    name: 'Teste User',
  },
  {
    onInit: () => {}, // On init program,
    onUpdate: (user) => {}, // On state update,
  }
)

setup.config() // just calling this piece
```

-- And access in classes

```ts
class UserStoreWithOnInit extends Factory<UserStoreType> implements OnInit {
  onInit(): Promise<void> {
    // ...
  }
}

class UserStoreWithonUpdate
  extends Factory<UserStoreType>
  implements OnUpdate<UserStoreType>
{
  onUpdate(data: UserStoreType): Promise<void> {
    // ...
  }
}
```

-- Data can also be store in localStorage

```ts
function Component() {
  return (
    <HydrateProvider modules={[userStore /*... the rest of all your stores */]}>
      <div data-testid="user.name">{userStore.state.name}</div>
    </HydrateProvider>
  )
}
```

### Installation

Step-by-step guide on how to get a development environment running.

```bash
# Clone the repository
git clone https://github.com/bruphillip/flame

# Navigate into the directory
cd flame

# Install dependencies
npm test || yarn test

```
