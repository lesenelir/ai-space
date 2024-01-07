export type TChatItem = {
  id: number
  itemName: string
  itemUuid: string
  createdAt: string
  updatedAt: string
  isStarred: boolean
  userPrimaryId: number
  modelPrimaryId: number
}

export type TModel = {
  id: number
  modelName: string
}

export type TCategorizedChatItems = {
  [key: string]: TChatItem[]
}

export type TChatMessages = {
  id: number
  messageType: string
  messageContent: string
  messageRole: string
  createdAt: string
  costTokens: number
  chatItemPrimaryId: number
  userPrimaryId: number
}

export type TImage = {
  id: string
  url: string
}
