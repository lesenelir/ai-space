import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { TChatItem, TModel } from '@/types'

// client atoms:
export const resizableWidthAtom = atomWithStorage<number>('resizableWidth', 320)
export const isMenuOpenAtom = atom<boolean>(true)
export const isSearchActiveAtom = atom<boolean>(false)
export const searchQueryNameAtom = atom<string>('')
export const selectedModelIdAtom = atom<number>(1) // Must: depends model id


// server atoms:
export const chatItemsAtom = atom<TChatItem[]>([]) // maintains the chat items data
export const modelsAtom = atom<TModel[]>([]) // maintains the model data. read-only

/**
 *
 *  modelsAtom value:
 *  [
 *   { id: 1, modelName: 'GPT-3.5 Turbo' },
 *   { id: 2, modelName: 'GPT-4 Turbo' }
 *  ]
 *
 */
