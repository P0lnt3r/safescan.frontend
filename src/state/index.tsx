import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { enableMapSet } from 'immer';
import application from './application/reducer'

enableMapSet();

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false
})

const store = configureStore({
    reducer: {
        application
    },
    middleware : customizedMiddleware
})

export default store
export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch