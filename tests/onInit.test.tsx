import { Factory } from 'src/factory'
import { OnInit } from 'src/onInit/onInit.abstract'
import { setup } from 'src/setup'
import { describe, test, expect, vi } from 'vitest'

describe('[HOOK]', () => {
  type UserStoreType = {
    name: string
    age: number
    email: string
  }

  test('it should call onInit method', async () => {
    const onInit = vi.fn()

    class UserStoreWithOnInit extends Factory<UserStoreType> implements OnInit {
      onInit(): Promise<void> {
        onInit()
        return Promise.resolve()
      }
    }
    new UserStoreWithOnInit({
      age: 20,
      email: 'teste@teste',
      name: 'Teste User',
    })

    setup.config()

    expect(onInit).toBeCalled()
  })

  test('it shouldnt call onInit method', async () => {
    const onInit = vi.fn()

    class UserStoreWithOnInit extends Factory<UserStoreType> {}
    new UserStoreWithOnInit({
      age: 20,
      email: 'teste@teste',
      name: 'Teste User',
    })

    setup.config()

    expect(onInit).not.toBeCalled()
  })
})
