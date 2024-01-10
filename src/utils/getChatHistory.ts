import { TChatMessages, TImage, TMessage } from '@/types'

type TSendContent = {
  role: string
  content: string | {
    type: string
    text?: string
    image_url?: string
  }[]
}

const createTextContent = (text: string): TSendContent => {
  return {
    role: 'user',
    content: text
  }
}

const createImageContent = (text: string, imageUrls: string[]): TSendContent => {
  return {
    role: 'user',
    content: [
      { type: 'text', text },
      ...imageUrls.map(url => ({
        type: 'image_url',
        image_url: url
      }))
    ]
  }
}

export const getChatHistory = (
  remoteUrls: TImage[],
  value: string,
  messages: TMessage[],
  maxHistorySize: number,
  chatMessages: TChatMessages[]
): TSendContent[] => {
  const sendContent: TSendContent[] = []

  if (remoteUrls.length > 0) {
    const imageUrls = remoteUrls.map(item => item.url)
    sendContent.push(createImageContent(value, imageUrls))
  } else {
    sendContent.push(createTextContent(value))
  }

  const combinedMessages = [...messages.slice().reverse(), ...chatMessages.slice().reverse()]

  for (const message of combinedMessages) {
    if (sendContent.length >= maxHistorySize) break

    if (remoteUrls.length > 0) {
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
        ] : message.messageContent
      })
    } else {
      // normal text input
      sendContent.unshift({
        role: message.messageRole,
        content: message.messageContent
      })
    }
  }

  return sendContent
}


// export const getChatHistory = (
//   remoteUrls: TImage[],
//   value: string,
//   messages: TMessage[],
//   maxHistorySize: number,
//   chatMessages: TChatMessages[]
// ): TSendContent[] => {
//   let sendContent: TSendContent[] = []
//   if (remoteUrls.length > 0) {
//     // image input
//     let count = 0
//     const temp = remoteUrls.map(item => ({
//       type: 'image_url',
//       image_url: item.url
//     }))
//     const content = [
//       {
//         type: 'text',
//         text: value
//       },
//       ...temp
//     ]
//     const currentChatMessage = {
//       role: 'user',
//       content
//     }
//     sendContent.push(currentChatMessage)
//     count++
//
//     for (let i = messages.length - 1; i >= 0; i--) {
//       if (count === maxHistorySize) break
//       const message = messages[i]
//       sendContent.unshift({
//         role: message.messageRole,
//         content: message.messageRole === 'user' ? [
//           {
//             type: 'text',
//             text: message.messageContent
//           },
//           ...message.imageUrls.map(url => ({
//             type: 'image_url',
//             image_url: url
//           }))
//         ] : message.messageContent
//       })
//     }
//
//     if (maxHistorySize > count) {
//       for (let i = chatMessages.length - 1; i >= 0; i--) {
//         if (count === maxHistorySize) break
//         const message = chatMessages[i]
//         sendContent.unshift({
//           role: message.messageRole,
//           content: message.messageRole === 'user' ? [
//             {
//               type: 'text',
//               text: message.messageContent
//             },
//             ...message.imageUrls.map(url => ({
//               type: 'image_url',
//               image_url: url
//             }))
//           ] : message.messageContent
//         })
//
//         count++
//       }
//     }
//
//   } else {
//     // normal text input
//     let count = 0
//     const currentChatMessage = {
//       role: 'user',
//       content: value
//     }
//     sendContent.push(currentChatMessage)
//     count++
//
//     for (let i = messages.length - 1; i >= 0; i--) {
//       if (count === maxHistorySize) break
//       const message = messages[i]
//       sendContent.unshift({
//         role: message.messageRole,
//         content: message.messageContent
//       })
//
//       count++
//     }
//
//     if (maxHistorySize > count) {
//       for (let i = chatMessages.length - 1; i >= 0; i--) {
//         if (count === maxHistorySize) break
//         const message = chatMessages[i]
//         sendContent.unshift({
//           role: message.messageRole,
//           content: message.messageContent
//         })
//
//         count++
//       }
//     }
//   }
//
//   return sendContent
// }
