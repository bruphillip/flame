import { Factory } from '.'

class Root<T> extends Factory<T> {
  constructor(initialData: T) {
    super(initialData)
  }
}

export function useCreateStore<T>(initialData: T): Factory<T> {
  return new Root(initialData)
}
