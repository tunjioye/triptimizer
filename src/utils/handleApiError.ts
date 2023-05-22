import toast from 'react-hot-toast'
import { ApiError } from '@/schema/types'

export const handleApiError = (error: ApiError) => {
  if (error && error.message) {
    toast.error(error.message)
    return
  }
  console.error(error)
}

export default handleApiError
