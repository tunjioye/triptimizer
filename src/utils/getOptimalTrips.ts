import { OptimalRoute, OptimalTrip } from '@/schema/types'
import { DistanceMatrixResponseData } from '@googlemaps/google-maps-services-js'

export const getOptimalTrips = (
  distanceMatrixResData: DistanceMatrixResponseData
): OptimalTrip[] => {
  const {
    destination_addresses: destinationAddresses,
    origin_addresses: originAddresses,
    rows,
  } = distanceMatrixResData

  const optimalTrips: OptimalTrip[] = []
  for (let i = 0; i < originAddresses.length; i++) {
    const startAddress = originAddresses[i]

    const optimalRoute: OptimalRoute = []
    const routeIndices: number[] = [i] // indices of visited destination addresses starting with the current origin address
    for (let j = 0; j < destinationAddresses.length; j++) {
      const nextIndex = routeIndices[routeIndices.length - 1]
      const addressElements = rows[nextIndex].elements

      // filter addressElements without visited destination addresses
      const filteredElements = addressElements.filter((_, index) => {
        return !routeIndices.includes(index)
      })
      const minDistance = Math.min(...filteredElements.map((a) => a.distance.value))
      const minElement = addressElements.find((a) => a.distance.value === minDistance)
      const minElementIndex = addressElements.findIndex((a) => a.distance.value === minDistance)
      if (!minElement) break

      routeIndices.push(minElementIndex)
      optimalRoute.push({
        address: destinationAddresses[minElementIndex],
        distance: minElement.distance,
        duration: minElement.duration,
      })
    }

    optimalTrips.push({
      startAddress,
      optimalRoute,
    })
  }

  return optimalTrips
}

export default getOptimalTrips
