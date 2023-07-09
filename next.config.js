/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  env: {
    KV_URL: process.env.KV_URL,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN,
  },
  serverRuntimeConfig: {
    // Will be available only on server-side
    GOOGLE_SHEETS_API_KEY: process.env.GOOGLE_SHEETS_API_KEY,
    GOOGLE_SHEETS_SHEET_ID: process.env.GOOGLE_SHEETS_SHEET_ID,
    GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    SMTP_TO: process.env.SMTP_TO,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    APP_NAME: process.env.APP_NAME,
    APP_URL: process.env.APP_URL,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
}

module.exports = nextConfig
