export abstract class OnInit {
  abstract onInit(): Promise<void>
}

export function hasOnInit(module: unknown): module is OnInit {
  if ((module as OnInit)?.onInit) return true
  return false
}
