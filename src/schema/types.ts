import { Distance, Duration } from '@googlemaps/google-maps-services-js'
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

export type TripApiResponse = {
  payload: {
    requestId: string
    optimalTrip: OptimalTripMap
  }
}
