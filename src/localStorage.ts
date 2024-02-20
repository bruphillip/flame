export class LocalStorageProvider {
  get(key: string) {
    const object = localStorage.getItem(key)

    if (object) return JSON.parse(object)

    return {}
  }

  set<T>(key: string, object: T) {
    localStorage.setItem(key, JSON.stringify(object))
  }

  clear() {
    localStorage.clear()
  }

  remove(key: string) {
    localStorage.removeItem(key)
  }
}
