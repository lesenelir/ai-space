import { useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { chatItemsAtom, modelsAtom } from '@/atoms'
import { getModelName } from '@/utils/modelName'

export const useGetChatInformation = (
  urlUuid: string | undefined,
  selectId: number
) => {
  const chatItemLists =  useAtomValue(chatItemsAtom)
  const models = useAtomValue(modelsAtom)

  const currentChatItem = useMemo(() => (  // when urlUuid is undefined, return undefined
    chatItemLists.find(item => item.itemUuid === urlUuid)
  ), [chatItemLists, urlUuid])

  // get currentChatModel from the models' table
  const currentChatModel = useMemo(() => {
    if (!urlUuid) {
      return models.find(model => model.id === selectId)
    } else {
      return models.find(model => model.id === currentChatItem?.modelPrimaryId)
    }
  }, [currentChatItem?.modelPrimaryId, models, selectId, urlUuid])

  // To satisfy openAi api modelName
  const modelName = useMemo(() => {
    const currentChatModelId = currentChatModel?.id!
    // (when in chat home page the selectId is defined)
    return getModelName(currentChatModelId)
  }, [currentChatModel?.id])

  return {
    currentChatModel,
    modelName
  }
}

// export default function useGetChatInformation(urlUuid: string | undefined, selectId: number) {
//   const chatItemLists =  useAtomValue(chatItemsAtom)
//   const models = useAtomValue(modelsAtom)
//
//   const currentChatItem = useMemo(() => (  // when urlUuid is undefined, return undefined
//     chatItemLists.find(item => item.itemUuid === urlUuid)
//   ), [chatItemLists, urlUuid])
//
//   // get currentChatModel from the models' table
//   const currentChatModel = useMemo(() => {
//     if (!urlUuid) {
//       return models.find(model => model.id === selectId)
//     } else {
//       return models.find(model => model.id === currentChatItem?.modelPrimaryId)
//     }
//   }, [currentChatItem?.modelPrimaryId, models, selectId, urlUuid])
//
//   // To satisfy openAi api modelName
//   const modelName = useMemo(() => {
//     const currentChatModelId = currentChatModel?.id!
//     // (when in chat home page the selectId is defined)
//     return getModelName(currentChatModelId)
//   }, [currentChatModel?.id])
//
//   return {
//     currentChatModel,
//     modelName
//   }
// }
