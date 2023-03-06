import type { FC } from 'react'

import { Fragment, useEffect, useRef, useState } from 'react'
import { 
  Collapse, 
  Divider, 
  Flex, 
  Heading, 
  IconButton, 
  Spacer, 
  Text, 
  VStack 
} from '@chakra-ui/react'
import { DeleteIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

import { useJots } from '../../context'
import { service } from '../../library'

export const List: FC = () => {

  const { jots, dispatch } = useJots()
  const [activeJot, setActiveJot] = useState<undefined | number>()

  const loaded = useRef(false)
  
  useEffect(() => {

    (async() => {

      if (!loaded.current) {
        
        loaded.current = true

        const jots = await service.jots.all()

        if (jots.ok) {

          dispatch({
            type: 'set',
            payload: jots.results
          })
        }
      }
    })()

  }, [dispatch, jots.length])

  return <VStack 
    align='stretch' 
    divider={<Divider />}>
    {!jots.length && <Text textAlign='center'>You currently have no jots</Text>}    
    {jots.map(({ id, properties: { title, content } }, idx) => <Fragment key={idx}>
      <Flex
        align='center'>
        <Heading 
          as='h4'
          size='sm'>{title}</Heading>
        <Spacer />
        <IconButton
          alignSelf='flex-end'
          aria-label={`View ${title}`}
          icon={idx === activeJot ? <ViewOffIcon /> : <ViewIcon />}
          onClick={() => {

            setActiveJot(idx === activeJot ? undefined : idx)
          }}
          variant='ghost' />
        <IconButton 
          alignSelf='flex-end'
          aria-label={`Delete ${title}`} 
          colorScheme='red'
          icon={<DeleteIcon />}
          onClick={async () => {

            await service.jots.remove(id)
            
            setActiveJot(undefined)
            
            dispatch({
              type: 'delete',
              payload: idx
            })
          }}
          variant='ghost' />
      </Flex>
      <Collapse 
        in={activeJot === idx} 
        unmountOnExit={true}>
        <Text
          whiteSpace='pre-line'>{content}</Text>
      </Collapse>
    </Fragment>)}
  </VStack> 
}
