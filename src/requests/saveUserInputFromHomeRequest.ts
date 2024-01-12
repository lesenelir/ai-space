import type { TImage } from '@/types'

export const saveUserInputFromHomeRequest = async (
  message: string = '',
  selectedModelId: number,
  remoteUrls: TImage[]
) => {
  try {
    const options = { // when a user is in chat home page, the parameter 'router.query.id' is undefined.
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        model_primary_id: selectedModelId,
        image_urls: remoteUrls.length > 0 ? remoteUrls.map(item => item.url) : []
      })
    }

    return await fetch('api/chat/newChatFromHome', options)
  } catch (e) {
    console.log('save user input from home request failed', e)
  }
}
