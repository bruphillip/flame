import { render, waitFor } from '@testing-library/react'
import { Factory } from 'src/factory'
import { describe, test, expect } from 'vitest'

describe('[Factory]', () => {
  describe('[METHODS]', () => {
    class Test extends Factory<{ name: string }> {}
    test('it should instanciate an Factory model', () => {
      const factoryImpl = new Test({ name: 'Teste Name' })

      expect(factoryImpl).toHaveProperty('data')
      expect(factoryImpl.data.name).toBe('Teste Name')
    })

    test('it should update when called next(object parameter)', () => {
      const factoryImpl = new Test({ name: 'Teste Name' })

      expect(factoryImpl.data.name).toBe('Teste Name')

      factoryImpl.next({ name: 'New' })

      expect(factoryImpl.data.name).toBe('New')
    })

    test('it should update when called next(callback parameter)', async () => {
      const factoryImpl = new Test({ name: 'Teste Name' })

      expect(factoryImpl.data.name).toBe('Teste Name')

      factoryImpl.next(() => ({
        name: 'New',
      }))

      expect(factoryImpl.data.name).toBe('New')
    })

    test('it should update when called next(promise parameter)', async () => {
      const factoryImpl = new Test({ name: 'Teste Name' })

      expect(factoryImpl.data.name).toBe('Teste Name')
      await factoryImpl.next(async (prop) => {
        expect(prop.name).toBe('Teste Name')

        return new Promise<{ name: string }>((resolve) => {
          setTimeout(() => {
            resolve({
              name: 'New',
            })
          }, 200)
        })
      })
      expect(factoryImpl.data.name).toBe('New')
    })
  })

  describe('[COMPONENT]', () => {
    type UserStoreType = {
      name: string
      age: number
      email: string
    }

    class UserStore extends Factory<UserStoreType> {}

    describe('[STATE]', () => {
      test('it should show user-name info inside component', async () => {
        function StoreComponent() {
          return <div data-testid="user-name">{userStore.state.name}</div>
        }

        const userStore = new UserStore({
          age: 20,
          email: 'teste@email',
          name: 'custom',
        })

        const rendered = render(<StoreComponent></StoreComponent>)

        const value = await rendered.findByTestId('user-name')
        expect(value.innerHTML).toBe(userStore.data.name)
        rendered.unmount()
      })

      test('it should update user-name info inside component', async () => {
        const userStore = new UserStore({
          age: 20,
          email: 'teste@email',
          name: 'old',
        })

        function UpdateComponent() {
          return <div data-testid="user-name-updt">{userStore.state.name}</div>
        }

        const rendered = render(<UpdateComponent></UpdateComponent>)
        const old = await rendered.findByTestId('user-name-updt')
        expect(old.innerHTML).toBe('old')
        userStore.next({ name: 'new' })
        const value = await waitFor(() =>
          rendered.findByTestId('user-name-updt')
        )

        expect(value.innerHTML).toBe('new')
        rendered.unmount()
      })
    })

    describe('[HOOKS]', () => {
      test('it update user-name info inside component', async () => {
        function StoreComponent() {
          return <div data-testid="user-name">{userStore.state.name}</div>
        }

        const userStore = new UserStore({
          age: 20,
          email: 'teste@email',
          name: 'custom',
        })

        const rendered = render(<StoreComponent></StoreComponent>)

        const value = await rendered.findByTestId('user-name')
        expect(value.innerHTML).toBe(userStore.data.name)
        rendered.unmount()
      })
    })
  })
})
