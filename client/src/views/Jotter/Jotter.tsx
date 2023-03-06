import { Flex } from '@chakra-ui/react'

import { New } from '../../components'
import { JotsProvider } from '../../context'

export const Jotter = () => {

  return <JotsProvider>
    <Flex 
      alignSelf='flex-end' 
      justifySelf='flex-end'
      maxWidth='400px'>
      <New />
    </Flex>
  </JotsProvider>
}
