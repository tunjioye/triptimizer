import { NextApiRequest, NextApiResponse } from 'next'
import { Client, DistanceMatrixRequest } from '@googlemaps/google-maps-services-js'
import axios from 'axios'
import getOptimalTrips from '@/utils/getOptimalTrips'
import { TripApiRequestBody, TripApiResponse } from '@/schema/types'
import { nanoid } from 'nanoid'
import { PassService } from '@/utils/PassService'

const googleMapsClient = new Client({
  // @ts-ignore
  axiosInstance: axios.create({
    timeout: 30000,
    params: {
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  }),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { addresses, pass = 'TESTPASS' } = req.body as TripApiRequestBody
    if (addresses.length < 2) {
      res.status(400).json({ message: 'Must provide at least 2 addresses' })
      return
    }
    if (addresses.some((a) => typeof a === 'string' && a.trim() === '')) {
      res.status(400).json({ message: 'Must provide valid addresses' })
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

    try {
      const passService = new PassService()
      await passService.incrementUsage(pass)
    } catch (error: any) {
      console.error(error)
      res.status(400).json({ ...error })
      return
    }

    const payload = await googleMapsClient
      .distancematrix({
        // @ts-ignore
        params: requestParams,
        timeout: 20000,
      })
      .then((r) => {
        const invalidAddresses = mappedAddresses.filter((__a: string, i: number) => {
          return r.data.origin_addresses[i] === '' || r.data.rows[i].elements[i].status != 'OK'
        })
        if (invalidAddresses.length > 0) {
          return {
            error_message: `${invalidAddresses.length} Invalid Address${
              invalidAddresses.length === 1 ? '' : 'es'
            }. Remove the invalid address${
              invalidAddresses.length === 1 ? '' : 'es'
            } and try again.`,
            invalid_addresses: invalidAddresses,
          }
        }

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
