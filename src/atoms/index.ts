import { atom } from 'jotai'
import { TChatItem } from '@/types'

export const isMenuOpenAtom = atom<boolean>(true)
export const chatItemsAtom = atom<TChatItem[]>([
  {
    id: 1,
    itemName: 'Item 1',
    itemUuid: '1',
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01'
  },
  {
    id: 2,
    itemName: 'Item 2',
    itemUuid: '2',
    createdAt: '2021-01-02',
    updatedAt: '2021-01-02'
  },
  {
    id: 3,
    itemName: 'Item 3',
    itemUuid: '3',
    createdAt: '2021-01-03',
    updatedAt: '2021-01-03'
  }
])
