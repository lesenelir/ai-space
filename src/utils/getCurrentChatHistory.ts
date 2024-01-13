import type { TChatMessages, TMessage, TSendContent } from '@/types'

export const getCurrentChatHistory = (
  isImageInput: boolean,
  maxHistorySize: number,
  messages: TMessage[],
  chatMessages: TChatMessages[]
) => {
  let sendContent: TSendContent[] = []

  const combinedMessages = [...messages.slice().reverse(), ...chatMessages.slice().reverse()]

  for (const message of combinedMessages) {
    if (sendContent.length >= maxHistorySize) break

    if (isImageInput) {
      // image input
      sendContent.unshift({
        role: message.messageRole,
        content: message.messageRole === 'user' ? [
          {
            type: 'text',
            text: message.messageContent
          },
          ...message.imageUrls.map(url => ({
            type: 'image_url',
            image_url: url
          }))
        ] : message.messageContent // assistant
      })

    } else {
      // normal input
      sendContent.unshift({
        role: message.messageRole,
        content: message.messageContent
      })
    }
  }

  return sendContent
}
