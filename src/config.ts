import getConfig from 'next/config'
import { PublicRuntimeConfig, ServerRuntimeConfig } from '@/schema/types'

export const {
  publicRuntimeConfig,
  serverRuntimeConfig,
}: {
  publicRuntimeConfig: PublicRuntimeConfig
  serverRuntimeConfig: ServerRuntimeConfig
} = getConfig()
