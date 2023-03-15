import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'
import { enableMapSet } from 'immer';
import application from './application/reducer'

enableMapSet();

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false
})

const PERSISTED_KEYS: string[] = [ 'application.blockNumber' ]
const store = configureStore({
    reducer: {
        application,
    },
    middleware: [...getDefaultMiddleware({ thunk: false, serializableCheck: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
})

export default store
export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch