export enum KeyCode {
  PENCIL = 'p',
  CLEAR = 'x',
  EDIT = 'e',
}

type Handler = (e: KeyboardEvent) => void

interface Options {
  /**
   * Check for the meta key (cmd on mac, win on windows)
   * @default false
   */
  meta: boolean
}

export function handleKey(
  key: KeyCode,
  handler: Handler,
  { meta = false }: Options = {
    meta: false,
  },
) {
  return function handleKeyDown(event: KeyboardEvent) {
    if (event.key === key) {
      if ((meta && event.metaKey) || !meta) {
        handler(event)
      }
    }
  }
}
