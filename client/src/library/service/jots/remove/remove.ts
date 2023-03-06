import type { JotsType } from '../../../../context'

import { error } from '../../..'

import * as Type from './remove.type'
import { endpoint } from '../endpoint/endpoint'

export async function remove(id: JotsType.Item['id']): Promise<Type.Create> {

  try {

    await endpoint({
      path: '/jot',
      init: {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ id })
      }
    })

    return {
      ok: true
    }
  } catch (e) {

    return error.handle(e)
  }
}
