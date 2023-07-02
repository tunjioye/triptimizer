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
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    GOOGLE_SHEETS_API_KEY: process.env.GOOGLE_SHEETS_API_KEY,
    GOOGLE_SHEETS_SHEET_ID: process.env.GOOGLE_SHEETS_SHEET_ID,
    GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    APP_NAME: process.env.APP_NAME,
    APP_URL: process.env.APP_URL,
  },
}

module.exports = nextConfig
