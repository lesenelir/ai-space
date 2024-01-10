import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { superCopilots } from '@/utils'
import { TChatItem, TChatMessages, TModel, TMyCopilot } from '@/types'

// client atoms:
export const resizableWidthAtom = atomWithStorage<number>('resizableWidth', 320)
export const isMenuOpenAtom = atom<boolean>(true)
export const isSearchActiveAtom = atom<boolean>(false)
export const searchQueryNameAtom = atom<string>('')
export const selectedModelIdAtom = atom<number>(1) // Must: depends model id
export const maxTokensAtom = atomWithStorage<number>('maxTokens', 1000)
export const temperatureAtom = atomWithStorage<number>('temperature', 0.5)
export const maxHistorySizeAtom = atomWithStorage<number>('maxHistorySize', 3)
// get ignoreLine from localStorage => value: array of the object.
// object: {key: string, value: string[]} => key: router.query.id uuid, value: [id1, id2, id3 ...]
export const ignoreLineAtom = atomWithStorage<{key: string, value: string[]}[]>('ignoreLine', [])
export const myCopilotsAtom = atomWithStorage<TMyCopilot[]>('myCopilots', [])
export const superCopilotsAtom = atomWithStorage<TMyCopilot[]>('superCopilots', superCopilots)


// server atoms: need to hydrate from server
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
 *   { id: 3, modelName: 'GPT-4 Vision' },
 *   { id: 4, modelName: 'Gemini Pro' }
 *  ]
 *
 */
