import { atom } from 'jotai'
import { TChatItem } from '@/types'

// client atoms:
export const isMenuOpenAtom = atom<boolean>(true)
export const isSearchActiveAtom = atom<boolean>(false)
export const searchQueryNameAtom = atom<string>('')

// server atoms:
export const chatItemsAtom = atom<TChatItem[]>([])
