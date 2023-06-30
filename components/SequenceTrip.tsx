import React, { useState, useEffect } from 'react'
import styles from '@/style/sequenceTrip.module.scss'
import clsx from 'clsx'
import { page, resetSequenceTripForm } from '@/store/page'
import NoSSR from 'react-no-ssr'
import SequenceTripForm from 'components/SequenceTripForm'
import SequenceTripResult from 'components/SequenceTripResult'

export const MAX_NUMBER_OF_ADDRESSES = 10

function SequenceTrip() {
  const { optimalTrip } = page.use()

  const [step, setStep] = useState<number>(1)
  const changeToStep = (newStep: number) => {
    if (step === newStep) {
      setStep(0)
      return
    }
    setStep(newStep)
  }
  useEffect(() => {
    if (optimalTrip != null) setStep(2)
  }, [optimalTrip])

  return (
    <NoSSR>
      <section className={clsx(styles.sequenceTrip)}>
        <div>
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

          <details
            data-step={2}
            open={step === 2}
            onClick={(e) => e.preventDefault()}
            className={clsx({ disabled: optimalTrip == null })}
          >
            <summary onClick={() => changeToStep(2)}>
              <strong>STEP 2 &middot; Sequence Result</strong>
            </summary>
            <SequenceTripResult showHeading={false} />
          </details>
        </div>
        <div style={{ flex: 1 }} />
        {optimalTrip != null && (
          <div>
            <button
              onClick={() => {
                const confirmMessage =
                  'Are you sure you want to start a new trip? this will reset the current trip.'
                if (window.confirm(confirmMessage)) {
                  resetSequenceTripForm()
                  setStep(1)
                }
              }}
              style={{ maxWidth: 200, marginLeft: 'auto' }}
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
