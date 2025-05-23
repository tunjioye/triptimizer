import {
  ApiError,
  GooglePlacesAddress,
  // OptimalTripMap,
  OptimizeTripByType,
  PassApiRequestBody,
  PassApiResponse,
  TripApiResponse,
} from '@/schema/types'
import { handleApiError } from '@/utils'
import { entity, persistence } from 'simpler-state'

export type ColorSchemeType = 'light' | 'dark'

export type PageStoreStateType = {
  colorScheme: ColorSchemeType
  pass: string
  addresses: Array<GooglePlacesAddress | string>
  fetchingOptimalTrip: boolean
  optimizeTripBy: OptimizeTripByType
  optimalTrip: TripApiResponse['payload'] | null
}

// initial state
const initialState: PageStoreStateType = {
  colorScheme: 'light',
  pass: '',
  addresses: [],
  fetchingOptimalTrip: false,
  optimizeTripBy: 'distance',
  optimalTrip: null,
}

// entity
export const page = entity(initialState, [
  persistence('tm_page', {
    serializeFn: (val) => {
      const { colorScheme = 'light', addresses = [], pass = '' } = val
      return JSON.stringify({ colorScheme, addresses, pass })
    },
  }),
])

// entity updaters
export const setColorScheme = (colorScheme: ColorSchemeType = 'light') => {
  return page.set((value) => ({
    ...value,
    colorScheme,
  }))
}

export const setPass = (pass: string = '') => {
  return page.set((value) => ({
    ...value,
    pass,
  }))
}

export const setAddresses = (addresses: Array<GooglePlacesAddress | string> = []) => {
  return page.set((value) => ({
    ...value,
    addresses,
  }))
}

export const setFetchingOptimalTrip = (fetchingOptimalTrip: boolean = false) => {
  return page.set((value) => ({
    ...value,
    fetchingOptimalTrip,
  }))
}

export const setOptimizeTripBy = (optimizeTripBy: OptimizeTripByType = 'distance') => {
  return page.set((value) => ({
    ...value,
    optimizeTripBy,
  }))
}

export const setOptimalTrip = (optimalTrip: TripApiResponse['payload'] | null = null) => {
  return page.set((value) => ({
    ...value,
    optimalTrip,
  }))
}

// entity actions
export const toggleColorScheme = () => {
  const { colorScheme } = page.get()
  setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
}

export const resetSequenceTripForm = () => {
  return page.set((value) => ({
    ...value,
    addresses: [],
    optimizeTripBy: 'distance',
    optimalTrip: null,
  }))
}

export const runTrip = async () => {
  const { pass, addresses } = page.get()
  try {
    setFetchingOptimalTrip(true)
    const res: TripApiResponse = await fetch('/api/trip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pass,
        addresses,
      }),
    }).then((res) => {
      return new Promise(async (resolve, reject) => {
        if (res.ok) {
          resolve(res.json())
          return
        }
        const error: ApiError = await res.json()
        reject({ status: res.status, message: error.message || res.statusText })
      })
    })
    if (res.payload && res.payload.requestId) {
      setOptimizeTripBy('distance')
      setOptimalTrip(res.payload)
    }
  } catch (error) {
    handleApiError(error as ApiError)
  } finally {
    setFetchingOptimalTrip(false)
  }
}

export const requestForPass = async (requestData: PassApiRequestBody): Promise<PassApiResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res: PassApiResponse = await fetch('/api/pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      }).then((res) => {
        return new Promise(async (resolve, reject) => {
          if (res.ok) {
            resolve(res.json())
            return
          }
          const error: ApiError = await res.json()
          reject({ status: res.status, message: error.message || res.statusText })
        })
      })
      resolve(res)
    } catch (error) {
      handleApiError(error as ApiError)
      reject(error)
    }
  })
}
