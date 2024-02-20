import { render } from '@testing-library/react'
import { Factory } from 'src/factory'
import { hookFactory } from 'src/hook.factory'
import { describe, test, expect } from 'vitest'

describe('[HOOK]', () => {
  type UserStoreType = {
    name: string
    age: number
    email: string
  }

  class UserStore extends Factory<UserStoreType> {}

  test('it show user-name info inside component', async () => {
    const userStore = new UserStore({
      age: 20,
      email: 'teste@email',
      name: 'custom',
    })

    const useUserStore = hookFactory(userStore)

    function StoreComponent() {
      const [user] = useUserStore()

      return <div data-testid="user-name">{user.name}</div>
    }

    const rendered = render(<StoreComponent></StoreComponent>)

    const value = await rendered.findByTestId('user-name')
    expect(value.innerHTML).toBe('custom')
    rendered.unmount()
  })

  test('it update user-name info inside component', async () => {
    const userStore = new UserStore({
      age: 20,
      email: 'teste@email',
      name: 'custom',
    })

    const useUserStore = hookFactory(userStore)

    function StoreComponent() {
      const [user, setUser] = useUserStore()

      const updateName = () => setUser({ name: 'new name' })

      return (
        <div>
          <div data-testid="user-name">{user.name}</div>
          <button data-testid="update" onClick={updateName}></button>
        </div>
      )
    }

    const rendered = render(<StoreComponent></StoreComponent>)

    const value = await rendered.findByTestId('user-name')
    expect(value.innerHTML).toBe('custom')

    const btn = await rendered.findByTestId('update')
    btn.click()

    const newName = await rendered.findByTestId('user-name')

    expect(newName.innerHTML).toBe('new name')

    rendered.unmount()
  })

  test('it should update user-name info inside component even when user.next is called', async () => {
    const userStore = new UserStore({
      age: 20,
      email: 'teste@email',
      name: 'custom',
    })

    const useUserStore = hookFactory(userStore)

    function StoreComponent() {
      const [user] = useUserStore()

      return (
        <div>
          <div data-testid="user-name">{user.name}</div>
        </div>
      )
    }

    const rendered = render(<StoreComponent></StoreComponent>)

    const value = await rendered.findByTestId('user-name')
    expect(value.innerHTML).toBe('custom')

    userStore.next({ name: 'new name' })

    const newName = await rendered.findByTestId('user-name')

    expect(newName.innerHTML).toBe('new name')

    rendered.unmount()
  })
})
