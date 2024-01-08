import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { encodingForModel } from 'js-tiktoken'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge-friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export default async function handler(req: Request) {
  const { messages, maxTokens, temperature, modelName, chat_item_uuid, userId, remoteUrls } = await req.json()
  const enc = encodingForModel(modelName)
  let partialCompletion = '' // TODO: handle network connection error, and save the partial completion to the database
  let completionTokens = 0

  let finalMessages = messages
  if (modelName === 'gpt-4-vision-preview' && remoteUrls.length > 0) {
    const initialMessages = messages.slice(0, -1)
    const currentMessages = messages[messages.length - 1]
    const tempContent = []
    tempContent.push({ type: 'text', text: currentMessages.content })
    for (const url of remoteUrls) {
      tempContent.push({ type: 'image_url', image_url: url})
    }
    finalMessages= [
      ...initialMessages,
      {
        ...currentMessages,
        content: tempContent
      }
    ]
  }

  try {
    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: finalMessages,
      stream: true,
      max_tokens: maxTokens,
      temperature
    })

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response, {
      onToken: async (token: string) => {
        partialCompletion += token
        completionTokens += enc.encode(token).length
      },
      onFinal: async (completion: string) => {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            completion,
            chat_item_uuid,
            cost_tokens: completionTokens,
            userId
          })
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        await fetch(`${apiUrl}/api/chat/saveRobotMessage`, options)
      }
    })

    // Respond with the stream
    return new StreamingTextResponse(stream)
  } catch (error) {
    // Check if the error is an APIError
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error
      return NextResponse.json({ name, status, headers, message }, { status })
    } else {
      throw error
    }
  }
}
