import getConfig from 'next/config'
import { PublicRuntimeConfig } from '@/schema/types'

export const { publicRuntimeConfig }: { publicRuntimeConfig: PublicRuntimeConfig } = getConfig()
