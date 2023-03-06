import type { Dispatch, FC, ReactNode, Reducer as ReactReducer } from 'react'

export type Item = {
  id: string
  properties: {
    title: string
    content: string
  }
}

export type Action = {
  type: 'set',
  payload: Item | Item[]
} | {
  type: 'delete',
  payload: number
}

export type Provider = FC<{
  children: ReactNode
}>

export type Context = {
  jots: Item[]
  dispatch: Dispatch<Action>
}

export type Reducer = ReactReducer<Item[], Action>
