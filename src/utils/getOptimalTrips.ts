import { OptimalRoute, OptimalTrip, OptimizeTripByType } from '@/schema/types'
import { DistanceMatrixResponseData, DistanceMatrixRowElement } from '@googlemaps/google-maps-services-js'

export const getOptimalTrips = (
  distanceMatrixResData: DistanceMatrixResponseData,
  optimizeBy: OptimizeTripByType = 'distance'
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
      const findMinFn = (a: DistanceMatrixRowElement) => {
        if (routeIndices.includes(addressElements.indexOf(a))) return false // skip visited addresses
        if (optimizeBy === 'distance') {
          return a.distance.value === minDistance
        }
        return a.duration.value === minDuration
      }
      const minElement = addressElements.find(findMinFn)
      const minElementIndex = addressElements.findIndex(findMinFn)
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
