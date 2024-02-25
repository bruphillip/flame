import { render } from '@testing-library/react'
import { HydrateProvider, createStore } from 'src/index'
import { describe, test, expect } from 'vitest'

describe('[HYDRATE]', () => {
  describe('[PROVIDER]', () => {
    type UserStoreType = {
      name: string
      age: number
      email: string
    }

    test('it shouldnt hydrate the app when store is not passed as a module', async () => {
      async function firstContext() {
        const userStore = createStore<UserStoreType>({
          age: 20,
          email: 'teste@teste',
          name: 'Teste User',
        })

        function Base() {
          return (
            <HydrateProvider>
              <div data-testid="user.name">{userStore.state.name}</div>
            </HydrateProvider>
          )
        }

        const component = render(<Base></Base>)
        const oldUser = await component.findByTestId('user.name')
        expect(oldUser.innerHTML).toBe('Teste User')
        userStore.next({ name: 'New Name' })

        const newUser = await component.findByTestId('user.name')
        expect(newUser.innerHTML).toBe('New Name')
        component.unmount()
      }

      async function secondContext() {
        const userStore = createStore<UserStoreType>({
          age: 20,
          email: 'teste@teste',
          name: 'Teste User',
        })

        function Base() {
          return (
            <HydrateProvider>
              <div data-testid="user.name">{userStore.state.name}</div>
            </HydrateProvider>
          )
        }
        const newComponent = render(<Base></Base>)
        const hydratedUser = await newComponent.findByTestId('user.name')
        expect(hydratedUser.innerHTML).not.toBe('New Name')
        newComponent.unmount()
      }

      await firstContext()
      await secondContext()
    })

    test('it should hydrate the app when store is passed as a module', async () => {
      async function firstContext() {
        const userStore = createStore<UserStoreType>({
          age: 20,
          email: 'teste@teste',
          name: 'Teste User',
        })

        function Base() {
          return (
            <HydrateProvider modules={[userStore]}>
              <div data-testid="user.name">{userStore.state.name}</div>
            </HydrateProvider>
          )
        }

        const component = render(<Base></Base>)
        const oldUser = await component.findByTestId('user.name')
        expect(oldUser.innerHTML).toBe('Teste User')
        userStore.next({ name: 'New Name' })

        const newUser = await component.findByTestId('user.name')
        expect(newUser.innerHTML).toBe('New Name')
        component.unmount()
      }

      async function secondContext() {
        const userStore = createStore<UserStoreType>({
          age: 20,
          email: 'teste@teste',
          name: 'Teste User',
        })

        function Base() {
          return (
            <HydrateProvider modules={[userStore]}>
              <div data-testid="user.name">{userStore.state.name}</div>
            </HydrateProvider>
          )
        }
        const newComponent = render(<Base></Base>)
        const hydratedUser = await newComponent.findByTestId('user.name')
        expect(hydratedUser.innerHTML).toBe('New Name')
        newComponent.unmount()
      }

      await firstContext()
      await secondContext()
    })
  })
})
