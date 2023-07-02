import { Distance, Duration } from '@googlemaps/google-maps-services-js'
import GooglePlacesAutocompleteProps, { Option } from 'react-google-places-autocomplete/build/types'

export type PublicRuntimeConfig = {
  APP_NAME: string
  APP_URL: string
  GOOGLE_MAPS_API_KEY: string
}

export type ServerRuntimeConfig = {
  GOOGLE_SHEETS_API_KEY: string
  GOOGLE_SHEETS_SHEET_ID: string
  GOOGLE_SHEETS_CLIENT_EMAIL: string
  GOOGLE_SHEETS_PRIVATE_KEY: string
}

export type GooglePlacesAutocompleteSelectProps = Pick<GooglePlacesAutocompleteProps, 'selectProps'>

export type GooglePlacesAddress = Option

export type ApiError = {
  message: string
}

export type Route = {
  address: string
  distance: Duration
  duration: Distance
}

export type OptimalRoute = Route[]

export type OptimalTrip = {
  startAddress: string
  optimalRoute: OptimalRoute
}

export type OptimalTripMap = {
  [key in OptimizeTripByType]: OptimalTrip[]
}

export type OptimizeTripByType = 'distance' | 'duration'

export type TripApiRequestBody = {
  pass: string
  addresses: Array<GooglePlacesAddress | string>
}

export type TripApiResponse = {
  payload: {
    requestId: string
    optimalTrip: OptimalTripMap
  }
}

export type EarlyAccessUser = {
  firstname: string
  lastname: string
  email: string
  phone: string
  profession: string
}

export type EarlyAccessSheetRow = EarlyAccessUser & {
  pass: string
  limit: string | number
  usage: string | number
  created: string | Date
}

export type PassApiRequestBody = {
  earlyAccessUser: EarlyAccessUser
}

export type PassApiResponse = {
  payload: {
    message: string
    user: EarlyAccessSheetRow
  }
}
