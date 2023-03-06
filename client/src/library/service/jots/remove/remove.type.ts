import { error } from '../../..'

export type Create = {
  ok: true
} | ReturnType<typeof error.handle>
