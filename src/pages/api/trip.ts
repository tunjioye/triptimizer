import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // const { addresses, startAddressIndex } = req.body
    res.status(200).json({ reqBody: req.body })
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
