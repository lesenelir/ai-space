import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge-friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export default async function handler(req: Request) {
  const { messages, chat_item_uuid, userId } = await req.json()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  let partialCompletion = '' // TODO: handle network connection error, and save the partial completion to the database

  try {
    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages
    })

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response, {
      onToken: async (token: string) => {
        partialCompletion += token
      },
      onCompletion: async (completion: string) => {
        // Completion to the database. In edge, this will be sent to the origin server.
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            completion,
            chat_item_uuid,
            userId
          })
        }

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
