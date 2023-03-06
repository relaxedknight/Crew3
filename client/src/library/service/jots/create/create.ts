import type { JotsType } from '../../../../context'

import { endpoint } from '../endpoint/endpoint'
import { error } from '../../..'

import * as Type from './create.type'

export async function create(jot: JotsType.Item['properties']): Promise<Type.Create> {

  try {

    const resp = await endpoint({
      path: '/jot',
      init: {
        method: 'POST',
        body: JSON.stringify(jot),
        headers: {
          'content-type': 'application/json'
        }
      }
    })
    
    const json: {
      result: JotsType.Item
    } = await resp.json()

    return {
      ok: true,
      result: json.result
    }
  } catch (e) {

    return error.handle(e)
  }
}
