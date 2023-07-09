import { Resend } from 'resend'
import { serverRuntimeConfig } from '@/config'

const fromEmail = serverRuntimeConfig.FROM_EMAIL
const toEmail = serverRuntimeConfig.TO_EMAIL

export const sendMail = ({
  to = toEmail,
  subject,
  html,
}: {
  to?: string
  subject: string
  html: string
}) => {
  const resend = new Resend(serverRuntimeConfig.RESEND_API_KEY)
  const mailOptions = {
    from: fromEmail,
    to,
    subject,
    html,
  }
  return resend.emails.send(mailOptions)
}

export default sendMail
