import { render } from '@testing-library/react'
import { createStore, Factory, useStore } from 'src'
import { LocalStorageProvider } from 'src/localStorage'
import { setup } from 'src/setup'
import { describe, test, expect } from 'vitest'

describe('[SECURITY & FIXES]', () => {
  describe('[useStore Hook]', () => {
    test('it renders state correctly with useStore hook', async () => {
      const counterStore = createStore({ count: 10 })

      function CounterComponent() {
        const count = useStore(counterStore, (s) => s.count)
        return <div data-testid="count">{count}</div>
      }

      const rendered = render(<CounterComponent />)
      const element = await rendered.findByTestId('count')
      expect(element.innerHTML).toBe('10')

      counterStore.next({ count: 20 })
      const updated = await rendered.findByTestId('count')
      expect(updated.innerHTML).toBe('20')
      rendered.unmount()
    })

    test('it works without selector using default identity', async () => {
      const store = createStore({ name: 'Alice' })

      function Profile() {
        const state = useStore(store)
        return <div data-testid="name">{state.name}</div>
      }

      const rendered = render(<Profile />)
      const element = await rendered.findByTestId('name')
      expect(element.innerHTML).toBe('Alice')
      rendered.unmount()
    })
  })

  describe('[LocalStorageProvider Error Handling & SSR]', () => {
    test('it returns empty object on invalid JSON without throwing', () => {
      const provider = new LocalStorageProvider()
      localStorage.setItem('corrupted_key', '{ invalid json ...')

      expect(() => {
        const result = provider.get('corrupted_key')
        expect(result).toEqual({})
      }).not.toThrow()
    })

    test('it handles set, remove and clear gracefully', () => {
      const provider = new LocalStorageProvider()
      provider.set('test_key', { foo: 'bar' })
      expect(provider.get('test_key')).toEqual({ foo: 'bar' })

      provider.remove('test_key')
      expect(provider.get('test_key')).toEqual({})

      provider.set('another_key', 123)
      provider.clear()
      expect(provider.get('another_key')).toEqual({})
    })
  })

  describe('[Store Key & Setup Cleanup]', () => {
    test('it supports explicit key on Factory and createStore', () => {
      const store1 = createStore({ val: 1 }, undefined, 'custom_key_1')
      expect(store1.key).toBe('custom_key_1')

      class CustomStore extends Factory<{ val: number }> {}
      const store2 = new CustomStore({ val: 2 }, 'custom_key_2')
      expect(store2.key).toBe('custom_key_2')
    })

    test('it allows removing and resetting modules in Setup', () => {
      const store = createStore({ val: 1 })
      expect(setup.modules.includes(store)).toBe(true)

      setup.remove(store)
      expect(setup.modules.includes(store)).toBe(false)

      setup.reset()
      expect(setup.modules.length).toBe(0)
    })
  })
})
