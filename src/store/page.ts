import { ApiError, GooglePlacesAddress, OptimalTrip, TripApiResponse } from '@/schema/types'
import { handleApiError } from '@/utils'
import { entity, persistence } from 'simpler-state'

export type ColorSchemeType = 'light' | 'dark'

export type PageStoreStateType = {
  colorScheme: ColorSchemeType
  addresses: GooglePlacesAddress[]
  startAddressIndex: number
  fetchingOptimalTrips: boolean
  optimalTrips: OptimalTrip[] | null
}

// initial state
const initialState: PageStoreStateType = {
  colorScheme: 'light',
  addresses: [],
  startAddressIndex: -1,
  fetchingOptimalTrips: false,
  optimalTrips: null,
}

// entity
export const page = entity(initialState, [
  persistence('tm_page', {
    serializeFn: (val) => {
      // remove fetchingOptimalTrips & optimalTrips from persisted state
      const { fetchingOptimalTrips, optimalTrips, ...rest } = val
      return JSON.stringify({ ...rest })
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

export const setAddresses = (addresses: GooglePlacesAddress[] = []) => {
  return page.set((value) => ({
    ...value,
    addresses,
  }))
}

export const setStartAddressIndex = (index: number = -1) => {
  return page.set((value) => ({
    ...value,
    startAddressIndex: index,
  }))
}

export const setFetchingOptimalTrips = (fetchingOptimalTrips: boolean = false) => {
  return page.set((value) => ({
    ...value,
    fetchingOptimalTrips,
  }))
}

export const setOptimalTrips = (optimalTrips: OptimalTrip[] | null = null) => {
  return page.set((value) => ({
    ...value,
    optimalTrips,
  }))
}

// entity actions
export const toggleColorScheme = () => {
  const { colorScheme } = page.get()
  setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
}

export const runTrip = async () => {
  const { addresses } = page.get()
  try {
    setFetchingOptimalTrips(true)
    const res: TripApiResponse = await fetch('/api/trip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
    if (res.payload && res.payload.optimalTrips) {
      setOptimalTrips(res.payload.optimalTrips)
    }
  } catch (error) {
    handleApiError(error as ApiError)
  } finally {
    setFetchingOptimalTrips(false)
  }
}
