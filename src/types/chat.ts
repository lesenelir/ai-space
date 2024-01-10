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
  imageUrls: string[]
  chatItemPrimaryId: number
  userPrimaryId: number
}

export type TMessage = {
  id: string
  messageContent: string
  messageRole: string
  imageUrls: string[]
}

export type TImage = {
  id: string
  url: string
}

export type TMyCopilot = {
  id: string,
  copilotName: string,
  copilotPrompt: string
}
