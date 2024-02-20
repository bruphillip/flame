export abstract class OnUpdate<T> {
  abstract onUpdate(data: T): void
}

export function hasOnUpdate(module: unknown): module is OnUpdate<unknown> {
  if ((module as OnUpdate<unknown>)?.onUpdate) return true
  return false
}
