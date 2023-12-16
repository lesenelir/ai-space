import { atom } from 'jotai'
import { TChatItem } from '@/types'

// client atoms:
export const isMenuOpenAtom = atom<boolean>(true)


// server atoms:
export const chatItemsAtom = atom<TChatItem[]>([])
