import { render } from '@testing-library/react'
import { SetupProvider, useCreateStore } from 'src'
import { setup } from 'src/setup'
import { describe, test, expect, vi } from 'vitest'

describe('[SETUP PROVIDER]', () => {
  describe('[CODE]', () => {
    type UserStoreType = {
      name: string
      age: number
      email: string
    }

    test('it should not call when dont register the setup', () => {
      const onInitMock = vi.fn()
      const onUpdateMock = vi.fn()

      useCreateStore<UserStoreType>(
        {
          age: 20,
          email: 'teste@teste',
          name: 'Teste User',
        },
        {
          onInit: onInitMock,
          onUpdate: onUpdateMock,
        }
      )

      expect(onInitMock).not.toBeCalled()
      expect(onUpdateMock).not.toBeCalled()
    })

    test('it should call when registered', async () => {
      const onInitMock = vi.fn()
      const onUpdateMock = vi.fn()

      useCreateStore<UserStoreType>(
        {
          age: 20,
          email: 'teste@teste',
          name: 'Teste User',
        },
        {
          onInit: onInitMock,
          onUpdate: onUpdateMock,
        }
      )

      await setup.config()

      expect(onInitMock).toBeCalled()
      expect(onUpdateMock).toBeCalled()
      expect(onUpdateMock).toBeCalledWith({
        age: 20,
        email: 'teste@teste',
        name: 'Teste User',
      })
    })
  })

  describe('[COMPONENT]', () => {
    type UserStoreType = {
      name: string
      age: number
      email: string
    }

    test('should call when provider is not pushed', async () => {
      const onInitMock = vi.fn()
      const onUpdateMock = vi.fn()

      const userStore = useCreateStore<UserStoreType>(
        {
          age: 20,
          email: 'teste@teste',
          name: 'Teste User',
        },
        {
          onInit: onInitMock,
          onUpdate: onUpdateMock,
        }
      )

      function Base() {
        return (
          <SetupProvider>
            <div>{userStore.state.name}</div>
          </SetupProvider>
        )
      }

      const component = render(<Base></Base>)

      expect(onInitMock).toBeCalled()
      expect(onUpdateMock).toBeCalled()
      expect(onUpdateMock).toBeCalledWith({
        age: 20,
        email: 'teste@teste',
        name: 'Teste User',
      })

      component.unmount()
    })

    test('shouldnt call when provider is not pushed', async () => {
      const onInitMock = vi.fn()
      const onUpdateMock = vi.fn()

      const userStore = useCreateStore<UserStoreType>(
        {
          age: 20,
          email: 'teste@teste',
          name: 'Teste User',
        },
        {
          onInit: onInitMock,
          onUpdate: onUpdateMock,
        }
      )

      function Base() {
        return <div>{userStore.state.name}</div>
      }

      const component = render(<Base></Base>)

      expect(onInitMock).not.toBeCalled()
      expect(onUpdateMock).not.toBeCalled()
      expect(onUpdateMock).not.toBeCalledWith({
        age: 20,
        email: 'teste@teste',
        name: 'Teste User',
      })

      component.unmount()
    })
  })
})
