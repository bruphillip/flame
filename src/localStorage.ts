export class LocalStorageProvider {
  private isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  }

  get(key: string) {
    if (!this.isAvailable()) return {}

    try {
      const object = localStorage.getItem(key)
      if (object) return JSON.parse(object)
      return {}
    } catch {
      return {}
    }
  }

  set<T>(key: string, object: T) {
    if (!this.isAvailable()) return

    try {
      localStorage.setItem(key, JSON.stringify(object))
    } catch {
      // Ignore write errors (e.g. quota exceeded or disabled storage)
    }
  }

  clear() {
    if (!this.isAvailable()) return

    try {
      localStorage.clear()
    } catch {
      // Ignore storage errors
    }
  }

  remove(key: string) {
    if (!this.isAvailable()) return

    try {
      localStorage.removeItem(key)
    } catch {
      // Ignore storage errors
    }
  }
}
