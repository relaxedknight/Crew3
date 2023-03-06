import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import { mutate } from '../../../util'

export function beToFe(input: PageObjectResponse) {

  return {
    id: input.id,
    properties: Object.entries(input.properties)
      .reduce((result: Record<keyof PageObjectResponse['properties'], string>, [propKey, prop]) => {

      const value = 'rich_text' in prop ? 
        prop.rich_text[0]?.plain_text || '' : 
        'title' in prop ? 
        prop.title[0].plain_text : 'Unknown field '

      return {
        ...result,
        [mutate.toCamelCase(propKey)]: value
      }
    }, {})
  }
}
