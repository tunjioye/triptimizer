import { NextApiRequest, NextApiResponse } from 'next'
import { Client, DistanceMatrixRequest } from '@googlemaps/google-maps-services-js'
import axios from 'axios'
import { publicRuntimeConfig } from '@/config'
import getOptimalTrips from '@/utils/getOptimalTrips'
import { TripApiResponse } from '@/schema/types'
import { nanoid } from 'nanoid'

const googleMapsClient = new Client({
  // @ts-ignore
  axiosInstance: axios.create({
    timeout: 30000,
    params: {
      key: publicRuntimeConfig.GOOGLE_MAPS_API_KEY,
    },
  }),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { addresses } = req.body
    if (addresses.length < 2) {
      res.status(400).json({ message: 'Must provide at least 2 addresses' })
      return
    }

    const mappedAddresses = addresses.map((a: any) => {
      if (a && typeof a === 'string') {
        return a
      }
      return a.label
    })
    const requestParams: DistanceMatrixRequest = {
      // language: 'en',
      // region: 'ca',
      // @ts-ignore
      origins: [...mappedAddresses],
      destinations: [...mappedAddresses],
      // mode: TravelMode.driving,
      // units: UnitSystem.metric,
      // avoid: [TravelRestriction.highways, TravelRestriction.tolls],
      // departure_time: new Date(),
      // arrival_time: new Date(),
      // transit_mode: [TransitMode.bus, TransitMode.subway, TransitMode.train, TransitMode.tram, TransitMode.rail],
      // transit_routing_preference: TransitRoutingPreference.less_walking,
    }

    const payload = await googleMapsClient
      .distancematrix({
        // @ts-ignore
        params: requestParams,
        timeout: 20000,
      })
      .then((r) => {
        const payload: TripApiResponse['payload'] = {
          requestId: nanoid(12),
          optimalTrip: {
            distance: getOptimalTrips(r.data, 'distance'),
            duration: getOptimalTrips(r.data, 'duration'),
          },
        }
        return payload
      })
      .catch((e) => {
        if (e.response?.data) {
          return e.response.data
        }
        console.error(e)
        return null
      })

    // return error message from Google Maps API
    if (payload && payload?.error_message) {
      res.status(400).json({ message: payload.error_message, data: payload })
      return
    } else if (!payload) {
      res.status(500).json({ message: 'Something went wrong' })
      return
    }

    res.status(200).json({ payload })
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
