import { ApiError, GooglePlacesAddress } from '@/schema/types'
import { handleApiError } from '@/utils'
import { entity, persistence } from 'simpler-state'

export type ColorSchemeType = 'light' | 'dark'

export type PageStoreStateType = {
  colorScheme: ColorSchemeType
  addresses: GooglePlacesAddress[]
  startAddressIndex: number
}

// initial state
const initialState: PageStoreStateType = {
  colorScheme: 'light',
  addresses: [],
  startAddressIndex: -1,
}

// entity
export const page = entity(initialState, [persistence('tm_page')])

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

// entity actions
export const toggleColorScheme = () => {
  const { colorScheme } = page.get()
  setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
}

export const runTrip = async () => {
  const { addresses, startAddressIndex } = page.get()
  try {
    const res = await fetch('/api/trip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        addresses,
        startAddressIndex,
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
    console.log('res', res)
  } catch (error) {
    handleApiError(error as ApiError)
  }
}
