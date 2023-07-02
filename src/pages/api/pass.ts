import { NextApiRequest, NextApiResponse } from 'next'
import { PassApiRequestBody } from '@/schema/types'
import { PassService } from '@/utils/PassService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const pass = new PassService()
      const payload = await pass.addUserToSheet(req.body as PassApiRequestBody)
      res.status(200).json({ payload })
    } catch (e: any) {
      console.error(e)
      res.status(400).json({ ...e, message: e.message })
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
