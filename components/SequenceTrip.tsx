import React, { useState, useEffect } from 'react'
import styles from '@/style/sequenceTrip.module.scss'
import clsx from 'clsx'
import { page, resetSequenceTripForm, setAddresses, setOptimalTrip } from '@/store/page'
import NoSSR from 'react-no-ssr'
import SequenceTripForm from 'components/SequenceTripForm'
import SequenceTripResult from 'components/SequenceTripResult'
import { kv } from '@vercel/kv'
import { useRouter } from 'next/router'
import { TripApiResponse } from '@/schema/types'
import { toast } from 'react-hot-toast'

export const MAX_NUMBER_OF_ADDRESSES = 10

function SequenceTrip() {
  const router = useRouter()
  const { trip: requestId } = router.query
  const { optimalTrip, optimizeTripBy = 'distance' } = page.use()
  const isViewingResult = requestId && typeof requestId === 'string'
  const showStartNewTripButton = isViewingResult || optimalTrip != null

  const [step, setStep] = useState<number>(1)
  const changeToStep = (newStep: number) => {
    if (step === newStep) {
      setStep(0)
      return
    }
    setStep(newStep)
  }
  useEffect(() => {
    if (optimalTrip != null) {
      setStep(2)
      if (isViewingResult) {
        return
      }
      if (optimalTrip.requestId && optimalTrip.optimalTrip) {
        // expire in 2 days
        kv.set(optimalTrip.requestId, optimalTrip, { ex: 60 * 60 * 24 * 2 }).catch(() => null)
      }
    }
  }, [optimalTrip, isViewingResult])
  useEffect(() => {
    if (!router.isReady) return
    if (requestId && typeof requestId === 'string') {
      kv.get(requestId)
        .then((responseData) => {
          const data = responseData as TripApiResponse['payload']
          if (data && data.requestId === requestId) {
            // set result
            setOptimalTrip(data)
            const optimalTrips = data.optimalTrip[optimizeTripBy]
            const optimalTripAddresses = optimalTrips.map((trip) => trip.startAddress)
            // set addresses
            setAddresses(optimalTripAddresses)
            return
          }
          toast.error('The result is no longer available. \nWe save results for just 2 days.')
        })
        .catch((error) => toast.error(error.message))
    }
  }, [router.isReady, requestId, optimizeTripBy])

  return (
    <NoSSR>
      <section className={clsx(styles.sequenceTrip)}>
        <div>
          {!isViewingResult && (
            <details
              data-step={1}
              open={step === 1}
              onClick={(e) => e.preventDefault()}
              // className={clsx({ disabled: optimalTrip != null })}
            >
              <summary onClick={() => changeToStep(1)}>
                <strong>STEP 1 &middot; Sequence Trip</strong>
              </summary>
              <SequenceTripForm showHeading={false} />
            </details>
          )}

          <details
            data-step={2}
            open={step === 2}
            onClick={(e) => e.preventDefault()}
            className={clsx({ disabled: optimalTrip == null })}
          >
            <summary onClick={() => changeToStep(2)}>
              {isViewingResult ? (
                <strong
                  style={{
                    display: 'inline-flex',
                    justifyContent: 'space-between',
                    gap: '0.25rem',
                  }}
                >
                  <span>Sequence Result </span>
                  <span className={clsx(styles.startAddressIndicator)}>{requestId}</span>
                </strong>
              ) : (
                <strong>STEP 2 &middot; Sequence Result</strong>
              )}
            </summary>
            <SequenceTripResult showHeading={false} />
          </details>
        </div>

        <div style={{ flex: 1 }} />

        {showStartNewTripButton && (
          <div className="hide-on-print">
            <button
              onClick={async () => {
                let confirmMessage = 'Are you sure you want to start a new trip? '
                if (!isViewingResult) {
                  confirmMessage += 'Starting a new trip will reset your current trip.'
                }

                const confirmed = await window.confirm(confirmMessage)
                if (confirmed) {
                  resetSequenceTripForm()
                  setStep(1)
                  if (isViewingResult) {
                    router.push('/')
                    return
                  }
                }
              }}
              style={{
                maxWidth: 200,
                marginLeft: 'auto',
                marginBottom: 0,
              }}
            >
              Start New Trip
            </button>
          </div>
        )}
      </section>
    </NoSSR>
  )
}

export default SequenceTrip
