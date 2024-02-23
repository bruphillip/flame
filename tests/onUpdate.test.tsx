import { Factory } from 'src/factory'
import { OnUpdate } from 'src/onUpdate/onUpdate.abstract'
import { setup } from 'src/setup'
import { describe, test, expect, vi } from 'vitest'

describe('[HOOK]', () => {
  type UserStoreType = {
    name: string
    age: number
    email: string
  }

  test('it should call onInit method', async () => {
    const onUpdate = vi.fn()

    class UserStoreWithOnInit
      extends Factory<UserStoreType>
      implements OnUpdate<UserStoreType>
    {
      onUpdate(data: UserStoreType): void {
        onUpdate(data)
      }
    }
    new UserStoreWithOnInit({
      age: 20,
      email: 'teste@teste',
      name: 'Teste User',
    })

    setup.config()

    expect(onUpdate).toBeCalled()
    expect(onUpdate).toBeCalledWith({
      age: 20,
      email: 'teste@teste',
      name: 'Teste User',
    })
  })

  test('it shouldnt call onInit method', async () => {
    const onUpdate = vi.fn()

    class UserStoreWithOnInit extends Factory<UserStoreType> {}
    new UserStoreWithOnInit({
      age: 20,
      email: 'teste@teste',
      name: 'Teste User',
    })

    setup.config()

    expect(onUpdate).not.toBeCalled()
  })
})
