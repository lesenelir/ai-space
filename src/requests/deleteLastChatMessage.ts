export const deleteLastChatMessage = async (
  itemUuid: string | undefined
) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        item_uuid: itemUuid
      })
    }

    await fetch('/api/chat/deleteLastChatMessage', options)
  } catch (e) {
    console.log('delete Last Chat Message error', e)
  }
}
