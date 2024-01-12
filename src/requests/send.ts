// import type { TMessage, TSendContent } from '@/types'
// import type { Dispatch, SetStateAction } from 'react'
// import { saveCompletionRequest } from '@/utils'
//
// export const send = async (
//   temperature: number,
//   maxTokens: number,
//   modelName: string,
//   itemUuid: string | undefined,
//   sendContent: TSendContent[],
//   signal: AbortSignal,
//   receivedMessage: TMessage,
//   setMessages: Dispatch<SetStateAction<TMessage[]>>
// ) => {
//   const options = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       temperature,
//       max_tokens: maxTokens,
//       model_name: modelName,
//       send_content: sendContent
//     }),
//     signal
//   }
//
//   const res = await fetch('/api/chat/send', options) // return response
//   if (!res.ok || !res.body) return
//
//   let completion = ''
//   try {
//     const reader = res.body.getReader()
//     const decoder = new TextDecoder()
//     while (true) {
//       const { done, value } = await reader.read()
//       const text = decoder.decode(value)
//       completion += text
//       receivedMessage.messageContent += text
//       setMessages(prev => prev.map(item => item.id === receivedMessage.id ? receivedMessage : item))
//
//       if (done) {
//         try {
//           await saveCompletionRequest(completion, modelName!, router.query.id as string | undefined, data)
//         } catch (e) {
//           console.log('save response error', e)
//         }
//         break
//       }
//     }
//   } catch (e) {
//
//
//   }
//
//
// }
