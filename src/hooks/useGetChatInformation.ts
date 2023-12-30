import { useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { chatItemsAtom, modelsAtom } from '@/atoms'
import { getModelName } from '@/utils/modelName'

export default function useGetChatInformation(urlUuid: string, selectId?:number) {
  const chatItemLists =  useAtomValue(chatItemsAtom)
  const models = useAtomValue(modelsAtom)

  const currentChatItem = useMemo(() => (
    chatItemLists.find(item => item.itemUuid === urlUuid)
  ), [chatItemLists, urlUuid])

  // Getting model to match data from the database
  const currentChatModel = useMemo(() => (
    models.find(model => model.id === currentChatItem?.modelPrimaryId)
  ), [currentChatItem?.modelPrimaryId, models])

  // To satisfy openAi api modelName
  const modelName = useMemo(() => {
    const currentChatModelId = selectId || currentChatItem?.modelPrimaryId || 0 // first consider selectId
    // (when in chat home page the selectId is defined)
    return getModelName(currentChatModelId)
  }, [currentChatItem?.modelPrimaryId, selectId])

  return {
    currentChatModel,
    modelName
  }
}
