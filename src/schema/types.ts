import GooglePlacesAutocompleteProps, { Option } from 'react-google-places-autocomplete/build/types'

export type PublicRuntimeConfig = {
  APP_NAME: string
  GOOGLE_MAPS_API_KEY: string
}

export type GooglePlacesAutocompleteSelectProps = Pick<GooglePlacesAutocompleteProps, 'selectProps'>

export type GooglePlacesAddress = Option

export type ApiError = {
  message: string
}
