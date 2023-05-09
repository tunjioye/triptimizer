import { entity, persistence } from 'simpler-state'

export type ColorSchemeType = 'light' | 'dark'

export type PageStoreStateType = {
  colorScheme: ColorSchemeType
  addresses: string[]
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

export const setAddresses = (addresses: string[] = []) => {
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
