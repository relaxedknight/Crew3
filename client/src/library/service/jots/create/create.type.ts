import type { JotsType } from '../../../../context'

import { error } from '../../..'

export type Create = {
  ok: true
  result: JotsType.Item
} | ReturnType<typeof error.handle>
