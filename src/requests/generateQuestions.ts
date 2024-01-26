import type { TSendContent } from '@/types'

export const generateQuestions = async (
  sendContent: TSendContent[],
  modelName: string
) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        send_content: sendContent,
        model_name: modelName
      })
    }

    return await fetch('/api/chat/generateQuestions', options)
  } catch (e) {
    console.log('generateChatTitle Failed', e)
  }
}
