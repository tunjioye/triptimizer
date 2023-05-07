import isBrowser from "./isBrowser"

const darkModeStorageKey = 'tm_dark_mode'

type StorageValue = string | boolean

const setKeyInStorage = (storageKey: string, defaultValue: StorageValue = '') => {
  return window.localStorage.setItem(storageKey, JSON.stringify(defaultValue))
}
const getKeyFromStorage = (storageKey: string, defaultValue: StorageValue = '') => {
  if (!storageKey) return defaultValue

  try {
    return isBrowser() && window.localStorage[storageKey] ? JSON.parse(window.localStorage[storageKey]) : ''
  } catch (error) {
    void error
  }

  return defaultValue
}

export const setDarkMode = (enabled = false) => setKeyInStorage(darkModeStorageKey, enabled)
export const getDarkMode = () => getKeyFromStorage(darkModeStorageKey, false)

export const AuthUtils = {
  setDarkMode,
  getDarkMode,
}

export default AuthUtils
