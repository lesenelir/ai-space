import { v2 as cloudinary } from 'cloudinary'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import { extractPublicId } from 'cloudinary-build-url'
import type { NextApiRequest, NextApiResponse } from 'next'

const router = createRouter<NextApiRequest, NextApiResponse>()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const handleDeleteRemoteImage = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { url } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    const publicId = extractPublicId(url)
    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result === 'ok') {
      return res.status(200).json({ message: 'Image deleted.' })
    } else {
      return res.status(400).json({ error: 'Failed to delete image.' })
    }
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleDeleteRemoteImage)
export default router.handler()

