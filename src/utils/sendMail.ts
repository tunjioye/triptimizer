import { serverRuntimeConfig } from '@/config'
import nodemailer from 'nodemailer'

const smtpUsername = serverRuntimeConfig.SMTP_USER
const smtpPassword = serverRuntimeConfig.SMTP_PASS
const smtpHost = serverRuntimeConfig.SMTP_HOST
const smtpPort = serverRuntimeConfig.SMTP_PORT
const fromEmail = serverRuntimeConfig.SMTP_FROM
const toEmail = serverRuntimeConfig.SMTP_FROM

const sendMail = ({
  to = toEmail,
  subject,
  htmlContent,
}: {
  to: string
  subject: string
  htmlContent: string
}) => {
  let transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: true,
    auth: {
      user: smtpUsername,
      pass: smtpPassword,
    },
  })
  let mailOptions = {
    from: fromEmail,
    to: to,
    subject: subject,
    html: htmlContent,
  }
  return transporter.sendMail(mailOptions) // promise
}

export default sendMail
