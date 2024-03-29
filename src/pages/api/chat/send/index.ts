import OpenAI, { OpenAIError } from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge-friendly!)
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || ''
// })

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export default async function handler(req: Request) {
  const { send_content, temperature, max_tokens, model_name, api_key } = await req.json()

  try {
    const openai = new OpenAI({
      apiKey: api_key
    })

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      // messages: [{role: 'user', content}],
      messages: send_content,
      model: model_name,
      stream: true,
      temperature,
      max_tokens
    })

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response)

    // Respond with the stream
    return new StreamingTextResponse(stream)
  } catch (error) {
    if (error instanceof OpenAIError && error.message.includes('401')) {
      return new Response('Incorrect API key provided', { status: 401 })
    }
    return new Response('Network Error', { status: 500 })
  }
}

// const sendContent = [ // image input
//   {
//     role: 'user',
//     content: 'what is this?'
//   },
//   {
//     role: 'user',
//     content: [
//       { type: 'text', text: 'What’s in this image?' },
//       {
//         type: 'image_url',
//         image_url: 'https://pic1'
//       },
//       {
//         type: 'image_url',
//         image_url: 'https://pic2'
//       }
//     ]
//   }
// ]
