export type TChatItem = {
  id: number
  itemName: string
  itemUuid: string
  createdAt: string
  updatedAt: string
  userPrimaryId: number
}

export type TCategorizedChatItems = {
  [key: string]: TChatItem[]
}
