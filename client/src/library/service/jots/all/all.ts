import type { JotsType } from '../../../../context'

import { endpoint } from '../endpoint/endpoint'
import { error } from '../../..'

import * as Type from './all.type'

export async function all(): Promise<Type.All> {

  try {

    const resp = await endpoint({
      path: '/jots'
    })

    const json: {
      results: JotsType.Item[]
    } = await resp.json()

    return {
      ok: true,
      results: json.results
    }
  } catch (e) {

    return error.handle(e)
  }
}
