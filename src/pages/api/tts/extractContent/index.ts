import * as cheerio from 'cheerio'
import { createRouter } from 'next-connect'
import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'

const router = createRouter<NextApiRequest, NextApiResponse>()

const handleExtractContent = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req)
  const { url } = req.body

  if (!userId) {
    return res.status(400).json({ status: 'User not found' })
  }

  try {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    $('script, style, link, meta, noscript, footer, header, img').remove()
    const text = $('body').text().trim()

    return res.status(200).json({ status: 'New Chat Item', text })
  } catch (e) {
    return res.status(500).json({ error: e })}
}

router.post(handleExtractContent)
export default router.handler()
