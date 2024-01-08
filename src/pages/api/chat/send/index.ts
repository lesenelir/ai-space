import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge-friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export default async function handler(req: Request) {
  const { content } = await req.json()

  try {
    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      messages: [{role: 'user', content}],
      model: 'gpt-4-1106-preview',
      stream: true,
    })

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response)

    // Respond with the stream
    return new StreamingTextResponse(stream)
  } catch (error) {
    throw error
  }
}

/**
 *
 *  const res = await fetch('/api/chat/send', {
 *    method: 'POST',
 *    headers: {
 *      'Content-Type': 'application/json'
 *    },
 *           body: JSON.stringify({content: message})
 *         })
 *
 *         if (!res.ok || !res.body) {
 *           return
 *         }
 *
 *         const reader = res.body.getReader()
 *         const decoder = new TextDecoder()
 *         let finalResult = ''
 *         while (true) {
 *           const {value, done} = await reader.read()
 *           const text = decoder.decode(value)
 *           finalResult += text
 *           console.log(finalResult)
 *           if (done) {
 *             break
 *           }
 *         }
 *
 *
 */
