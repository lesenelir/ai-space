import type { TImage } from '@/types'

export const saveUserInputRequest = async (
  message: string = '',
  itemUuid: string,
  remoteUrls: TImage[]
) => {
  try {
    const options = { // when a user is in chat/[id] page, the parameter 'router.query.id' is not undefined.
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        chat_item_uuid: itemUuid,
        image_urls: remoteUrls.length > 0 ? remoteUrls.map(item => item.url) : []
      })
    }
    return await fetch('/api/chat/saveUserInput', options)
  } catch (e) {
    console.log('save user input error', e)
  }
}
