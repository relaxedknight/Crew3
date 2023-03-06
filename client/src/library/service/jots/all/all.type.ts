import type { JotsType } from '../../../../context'

import { error } from '../../..'

export type All = {
  ok: true
  results: JotsType.Item[]
} | ReturnType<typeof error.handle>
