import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { TChatItem, TChatMessages, TModel } from '@/types'

// client atoms:
export const resizableWidthAtom = atomWithStorage<number>('resizableWidth', 320)
export const isMenuOpenAtom = atom<boolean>(true)
export const isSearchActiveAtom = atom<boolean>(false)
export const searchQueryNameAtom = atom<string>('')
export const selectedModelIdAtom = atom<number>(1) // Must: depends model id
export const maxTokensAtom = atomWithStorage<number>('maxTokens', 1000)
export const temperatureAtom = atomWithStorage<number>('temperature', 0.5)


// server atoms:
export const isUserSaveOpenAIKeyAtom = atom<boolean>(false) // maintains the user's openAI key status
export const isUserSaveGeminiKeyAtom = atom<boolean>(false) // maintains the user's gemini key status
export const userOpenAIKeyAtom = atom<string>('') // maintains the user's openAI key
export const userGeminiKeyAtom = atom<string>('') // maintains the user's gemini key
export const chatItemsAtom = atom<TChatItem[]>([]) // maintains the chat items data
export const modelsAtom = atom<TModel[]>([]) // maintains the model data. read-only
export const chatMessagesAtom = atom<TChatMessages[]>([]) // maintains the chat content messages data

/**
 *
 *  modelsAtom value:
 *  [
 *   { id: 1, modelName: 'GPT-3.5 Turbo' },
 *   { id: 2, modelName: 'GPT-4 Turbo' },
 *   { id: 3, modelName: 'Gemini Pro' }
 *  ]
 *
 */
