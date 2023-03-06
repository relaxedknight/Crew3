import { createContext, useContext, useReducer } from 'react'

import * as Type from './Jots.type'

const JotsContext = createContext<Type.Context>({
  jots: [],
  dispatch: () => null
})

const jotsReducer: Type.Reducer = (jots, action) => {

  switch(action.type) {
    case 'set':

      return [...(
        Array.isArray(action.payload) ? 
        action.payload : 
        [action.payload]
      ), ...jots]
    case 'delete':

      return jots.filter((_, idx) => idx !== action.payload)
    default: 
    
      return jots
  }
}

export const JotsProvider: Type.Provider = (prop) => {

  const [jots, dispatch] = useReducer(jotsReducer, [])

  return <JotsContext.Provider value={{ jots, dispatch }}>
    {prop.children}
  </JotsContext.Provider>
}

export const useJots = () => useContext(JotsContext)
