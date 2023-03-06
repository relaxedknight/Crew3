import { Card, CardBody, Flex } from '@chakra-ui/react'

import { List, New } from '../../components'
import { JotsProvider } from '../../context'

export const Jotter = () => {

  return <JotsProvider>
    <Card 
      alignSelf='center'
      justifySelf='center'
      maxWidth='480px'
      maxHeight='500px'
      overflowX='hidden'
      overflowY='auto'
      width='100%'>
      <CardBody>
        <List />
      </CardBody>
    </Card>

    <Flex 
      alignSelf='flex-end' 
      justifySelf='flex-end'
      maxWidth='400px'>
      <New />
    </Flex>
  </JotsProvider>
};
