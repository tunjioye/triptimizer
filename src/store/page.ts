import { AuthUtils } from '@/utils'
import { entity } from 'simpler-state'

// initial state
const initialState = {
  isDarkMode: false,
}

// entity
export const auth = entity(initialState)

// entity updaters
export const setDarkModeEnabled = (payload = false) => {
  if (payload === false && AuthUtils.getDarkMode()) {
    AuthUtils.setDarkMode(false)
  } else if (payload) {
    AuthUtils.setDarkMode(true)
  }

  return auth.set((value) => ({
    ...value,
    isDarkMode: payload,
  }))
}

// entity actions
export const toggleDarkMode = () => {
  const { isDarkMode } = auth.get()
  return setDarkModeEnabled(!isDarkMode)
}
