import type { TSendContent } from '@/types'

export const generateChatTitle = async (
  sendContent: TSendContent[],
  modelName: string,
  itemUuid: string,
) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        send_content: sendContent,
        model_name: modelName,
        item_uuid: itemUuid
      })
    }

    return await fetch('/api/chat/generateChatTitle', options)
  } catch (e) {
    console.log('generateChatTitle Failed', e)
  }
}
