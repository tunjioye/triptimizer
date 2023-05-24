import { OptimalRoute, OptimalTrip } from '@/schema/types'
import { DistanceMatrixResponseData, DistanceMatrixRowElement } from '@googlemaps/google-maps-services-js'

export const getOptimalTrips = (
  distanceMatrixResData: DistanceMatrixResponseData,
  optimizeBy: 'distance' | 'duration' = 'distance'
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

      // filter addressElements to get unvisited destination addresses
      const unvisitedElements = addressElements.filter((_, index) => {
        return !routeIndices.includes(index)
      })
      const minDistance = Math.min(...unvisitedElements.map((a) => a.distance.value))
      const minDuration = Math.min(...unvisitedElements.map((a) => a.duration.value))
      const findFn = (a: DistanceMatrixRowElement) => {
        if (optimizeBy === 'distance') {
          return a.distance.value === minDistance
        }
        return a.duration.value === minDuration
      }
      const minElement = addressElements.find(findFn)
      const minElementIndex = addressElements.findIndex(findFn)
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
