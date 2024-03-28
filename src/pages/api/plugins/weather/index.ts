import OpenAI, { OpenAIError } from 'openai'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'

const router = createRouter<NextApiRequest, NextApiResponse>()

const handleExtractContent = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { text } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId
      }
    })

    const userOpenAIKey = await prisma.userAPIKey.findFirst({
      where: {
        user_primary_id: user!.id,
        model_primary_id: 1
      }
    })

    const openai = new OpenAI({
      apiKey: userOpenAIKey?.api_key || ''
    })

    const tools = [
      {
        "type": "function",
        "function": {
          "name": "get_current_weather",
          "description": "根据当前城市获取天气信息",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "返回当前需要的城市名"
              }
            },
            "required": ["location"]
          }
        }
      }
    ] as any

    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [{role: 'user', content: text}],
      tools: tools,
      tool_choice: 'auto'
    })

    const city = JSON.parse(response.choices[0].message.tool_calls![0].function.arguments).location

    const weatherRes = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=7704764e21731245e1f03d150a390b57`)
    const weather = await weatherRes.json()

    return res.status(200).json({ status: 'New Chat Item', weather, city  })
  } catch (e) {
    if (e instanceof OpenAIError && e.message.includes('401')) {
      return res.status(401).json({ status: 'Incorrect API key provided', message: e.message })
    }
    return res.status(500).json({ error: e })
  }
}

router.post(handleExtractContent)
export default router.handler()
