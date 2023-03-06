import type { FC } from 'react'

import { useColorModeValue } from '@chakra-ui/react'
import { Picker } from 'emoji-mart'
import { useEffect, useRef } from 'react'

import * as Type from './EmojiPicker.type'

const emoji: Type.Track = {
  called: false,
  data: undefined,
}

export const EmojiPicker: FC<Type.Prop> = (prop) => {

  const theme = useColorModeValue('light', 'dark')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {

    if (!emoji.called) {

      emoji.called = true

      ;(async() => {

        emoji.data = (await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data')).json()
      })()
    }
  }, [])

  useEffect(() => {
    
    if (emoji.data instanceof Promise) {

      new Picker({
        data: async () => await emoji.data,
        ref,
        onEmojiSelect: prop.onSelect,
        theme
      })
    }
  }, [prop.onSelect, theme])

  return <div ref={ref} />
}
