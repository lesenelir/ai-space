export const saveCompletionRequest = async (
  completion: string,
  modelName: string,
  itemUuid: string | undefined,
  data?: any
) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        completion,
        model_name: modelName,
        chat_item_uuid: itemUuid ? itemUuid : data.newChatItem.item_uuid,
      })
    };
    await fetch('/api/chat/saveRobotMessage', options)
  } catch (e) {
    console.log('save response error', e)
  }
}
