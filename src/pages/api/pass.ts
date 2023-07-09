import { NextApiRequest, NextApiResponse } from 'next'
import { PassApiRequestBody } from '@/schema/types'
import { PassService } from '@/utils/PassService'
import { sendMail } from '@/utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const pass = new PassService()
      const payload = await pass.addUserToSheet(req.body as PassApiRequestBody)
      if (payload) {
        sendMail({
          subject: 'Triptimizer - New Early Access User',
          html: `
          <div>
            <h4>New Early Access User</h4>
            <p>First Name: ${payload.user.firstname}</p>
            <p>Last Name: ${payload.user.lastname}</p>
            <p>Email: ${payload.user.email}</p>
            <p>Phone: ${payload.user.phone}</p>
            <p>Profession: ${payload.user.profession}</p>
            <p>Pass: ${payload.user.pass}</p>
            <p>Limit: ${payload.user.limit}</p>
            <p>Usage: ${payload.user.usage}</p>
            <p>Created: ${payload.user.created}</p>
          </div>
          `,
        })
      }
      res.status(200).json({ payload })
    } catch (e: any) {
      console.error(e)
      res.status(400).json({ ...e, message: e.message })
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
