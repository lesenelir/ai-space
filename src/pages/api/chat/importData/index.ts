import * as yup from 'yup'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/utils/db.server'
import { toCamelArr } from '@/utils'

const router = createRouter<NextApiRequest, NextApiResponse>()

const chatMessageSchema = yup.object().shape({
  id: yup.number().required(),
  message_type: yup.string().required(),
  message_content: yup.string().required(),
  message_role: yup.string().required(),
  created_at: yup.date().required(),
  cost_tokens: yup.number().required(),
  image_urls: yup.array().of(yup.string()).required(),
  chat_item_primary_id: yup.number().required(),
  user_primary_id: yup.number().required(),
})

const chatItemSchema = yup.object().shape({
  id: yup.number().required(),
  item_name: yup.string().required(),
  item_uuid: yup.string().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  isStarred: yup.bool().required(),
  user_primary_id: yup.number().required(),
  model_primary_id: yup.number().required(),
  ChatMessage: yup.array().of(chatMessageSchema).optional(),
})

const handleImportData = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { jsonData } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    // runtime validation
    const jsonDataSchema = yup.array().of(chatItemSchema).required()
    await jsonDataSchema.validate(jsonData, { abortEarly: false })

    for (const item of jsonData) {
      const existingChatItem = await prisma.chatItem.findUnique({
        where: {
          item_uuid: item.item_uuid
        }
      })

      if (!existingChatItem) {
        const newChatItem = await prisma.chatItem.create({
          data: {
            item_name: item.item_name,
            item_uuid: item.item_uuid,
            created_at: item.created_at,
            updated_at: item.updated_at,
            user_primary_id: item.user_primary_id,
            model_primary_id: item.model_primary_id,
          }
        })

        if (item.chatMessages && item.chatMessages.length > 0) {
          for (const message of item.chatMessages) {
            await prisma.chatMessage.create({
              data: {
                message_type: message.message_type,
                message_content: message.message_content,
                message_role: message.message_role,
                created_at: message.created_at,
                cost_tokens: message.cost_tokens,
                image_urls: message.image_urls,
                user_primary_id: message.user_primary_id,
                chat_item_primary_id: newChatItem.id,
              }
            })
          }
        }
      }

    }

    // update chat item lists
    const userWithChatItems = await prisma.user.findUnique({
      where: {
        userId
      },
      include: {
        chatItems: true
      }
    })

    const chatItems = JSON.parse(JSON.stringify(toCamelArr(userWithChatItems!.chatItems)))

    return res.status(200).json({ status: 'Import data successful', chatItems })
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      return res.status(408).json({ status: 'Validation error', errors: e.errors })
    }
    return res.status(500).json({ error: e })}
}

router.post(handleImportData)
export default router.handler()
