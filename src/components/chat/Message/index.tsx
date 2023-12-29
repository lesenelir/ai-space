import { useChat } from 'ai/react'

import HeaderContent from '@/components/chat/Message/HeaderContent'
import MainContent from '@/components/chat/Message/MainContent'
import FooterContent from '@/components/chat/Message/FooterContent'

export default function Message() {
  const {
    messages,
    setMessages,
    setInput,
    append,
    isLoading,
    input,
    handleInputChange,
    handleSubmit
  } = useChat({
    api: '/api/chat/sendMessage',
    // onFinish: async (message) => {
    //   const options = {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       completion: message.content,
    //       chat_item_uuid: router.query.id,
    //     })
    //   }
    //
    //   try {
    //     await fetch(`/api/chat/saveRobotMessage`, options)
    //   } catch (e) {
    //     console.log(e)
    //   }
    // }
  })

  return (
    <div className={'flex-1 w-full flex flex-col bg-gray-50 dark:bg-chatpage-message-background-dark dark:text-chatpage-message-text-dark'}>
      <HeaderContent/>
      <MainContent isLoading={isLoading} messages={messages} setMessages={setMessages}/>
      <FooterContent
        isLoading={isLoading}
        input={input}
        setInput={setInput}
        append={append}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}
