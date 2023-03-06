import type { FC } from 'react'
import type { JotsType } from '../../context'

import { 
  Button, 
  Collapse, 
  HStack, 
  Input, 
  Popover, PopoverArrow, PopoverContent, PopoverTrigger, 
  Text, Textarea 
} from '@chakra-ui/react'
import { useRef, useState } from 'react'

import { EmojiPicker } from '../../components'
import { useJots } from '../../context'
import { useOutsideClick } from '../../hook'
import { service } from '../../library'

import * as Type from './New.type'

export const New: FC = () => {

  const { dispatch: setJots } = useJots()
  const [error, setError] = useState<Record<keyof JotsType.Item['properties'], boolean>>({
    title: false,
    content: false
  })
  const [jot, setJot] = useState<JotsType.Item['properties']>({
    title: '',
    content: ''
  })
  const [show, setShow] = useState(false)

  const toggleShow = () => setShow(!show)

  const updateError = <A extends keyof JotsType.Item['properties']>(field: A, value: boolean) => setError({
    ...error,
    [field]: value
  })
  const updateJot = <A extends keyof JotsType.Item['properties']>(field: A, value: JotsType.Item['properties'][A]) => setJot({
    ...jot,
    [field]: value
  })

  const body = {
    selected: [0, 0]
  }

  const ref = {
    textarea: useRef<HTMLTextAreaElement>(null),
    button: {
      quote: useRef<HTMLButtonElement>(null)
    }
  }

  useOutsideClick([ref.textarea, ref.button.quote], () => {

    body.selected = [0, 0]
  })

  return <Collapse 
    in={show}
    startingHeight='34px'>
    <Button 
      borderBottomRadius='0'
      borderTopRightRadius={show ? undefined : '0'}
      height='34px'
      justifySelf='flex-end'
      left={!show ? `calc(100% - 34px)` : '0'}
      minW='34px'
      onClick={toggleShow}
      padding='0'
      transition='all ease-out .1s'
      width={show ? '100%' : '34px'}>
      <Text 
        transform={`rotate(${show ? '45' : '0'}deg)`} 
        transition='transform ease .2s'>+</Text>
    </Button>
    <Input 
      backgroundColor='whiteAlpha.200'
      borderColor={error.title ? 'red.300' : undefined}
      onChange={({ currentTarget }) => {
        
        updateJot('title', currentTarget.value)
        updateError('title', false)
      }}
      padding='4'
      placeholder='Add a title...'
      type='text'
      value={jot.title}
      variant='flushed' />
    <Textarea 
      backgroundColor='whiteAlpha.200'
      borderColor={error.content ? 'red.300' : undefined}
      onChange={({ currentTarget }) => {

        updateJot('content', currentTarget.value)
        updateError('content', false)
      }}
      onMouseUp={({ currentTarget }: Type.TargetSelection) => {

        body.selected = [
          currentTarget.selectionStart,
          currentTarget.selectionEnd
        ]
      }}
      padding='4'
      placeholder='Add your jot...'
      ref={ref.textarea}
      resize='none'
      rows={8}
      value={jot.content}
      variant='flushed' />
    <HStack 
      backgroundColor='whiteAlpha.200'
      padding='2' 
      spacing='2'>
      <Popover>
        <PopoverTrigger>
          <Button size='xs'>{
            String.fromCodePoint(0x1F600)
          }</Button>
        </PopoverTrigger>
        <PopoverContent width='auto'>
          <PopoverArrow />
          <EmojiPicker onSelect={(e) => {
                
            ref.textarea.current?.focus()

            updateJot('content', `${jot.content.length ? `${jot.content} ` : jot.content}${e.native}`)
          }} />
        </PopoverContent>
      </Popover>
      <Button 
        onClick={() => {

          const [selectedStart, selectedEnd] = body.selected

          if (selectedStart === selectedEnd) {
            return
          }

          updateJot('content', `${
            jot.content.slice(0, selectedStart)
          }"${
            jot.content.slice(selectedStart, selectedEnd)
          }"${
            jot.content.slice(selectedEnd, jot.content.length)
          }`)

          body.selected = [0, 0]
        }}
        ref={ref.button.quote}
        size='xs'>"</Button>
    </HStack>
    <Button 
      borderRadius='0' 
      paddingY='2' 
      onClick={async () => {

        const valid = jot.title && jot.content

        if (valid) {

          const resp = await service.jots.create(jot)

          if (resp.ok) {

            setJots({
              type: 'set',
              payload: resp.result
            })
            setJot({
              title: '',
              content: ''
            })
            setShow(false)
          }
          
        } else {

          setError({
            title: !jot.title,
            content: !jot.content
          })
        }
      }}
      width='100%'>Add</Button>
  </Collapse>
}
