import { OnInit } from 'src/onInit/onInit.abstract'
import { OnUpdate } from 'src/onUpdate/onUpdate.abstract'

import { Factory } from '.'

export type Config<T> = {
  onInit?: () => Promise<void>
  onUpdate?: (data: T) => Promise<void>
}

class Root<T> extends Factory<T> implements OnInit, OnUpdate<T> {
  constructor(initialData: T, private config?: Config<T>) {
    super(initialData)
  }
  public async onUpdate(data: T): Promise<void> {
    this.config?.onUpdate && (await this.config?.onUpdate(data))
  }
  public async onInit(): Promise<void> {
    this.config?.onInit && (await this.config?.onInit())
  }
}

export function useCreateStore<T>(
  initialData: T,
  config?: Config<T>
): Factory<T> {
  return new Root(initialData, config)
}
