import React, { useEffect, useMemo } from 'react'
import styles from '@/style/sequenceTrip.module.scss'
import { page } from '@/store/page'
import NoSSR from 'react-no-ssr'

function SequenceTripResult() {
  const [selectedAddress, setSelectedAddress] = React.useState<string | null>(null)
  const [startIndex, setStartIndex] = React.useState<number>(-1)

  const { startAddressIndex, optimalTrips } = page.use()
  useEffect(() => {
    // set startIndex when optimalTrips changes
    // this is the startAddressIndex of the optimalTrips
    setStartIndex(startAddressIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optimalTrips])

  const optimalTripAddresses: string[] = useMemo(() => {
    if (optimalTrips == null) return []
    return optimalTrips.map((trip) => trip.startAddress)
  }, [optimalTrips])

  // auto select address when optimalTripAddresses changes
  useEffect(() => {
    if (optimalTripAddresses.length > 0) {
      if (startIndex >= 0) {
        setSelectedAddress(optimalTripAddresses[startIndex])
        return
      }
      // set selectedAddress to the first address if startIndex is not set
      setSelectedAddress(optimalTripAddresses[0])
    }
  }, [optimalTripAddresses, startIndex])

  const selectedAddressOptimalTrip = useMemo(() => {
    if (optimalTrips == null) return null
    return optimalTrips.find((trip) => trip.startAddress === selectedAddress)
  }, [optimalTrips, selectedAddress])

  return (
    <NoSSR>
      <section>
        <h4 className={styles.heading}>Sequence Result</h4>
        <div>
          {optimalTrips == null && (
            <p>
              Click <b>Triptimize</b> button and see the result here.
            </p>
          )}
          {optimalTrips != null && optimalTrips.length === 0 && (
            <p>Sorry but there is no possible sequence for the given addresses. Please try again</p>
          )}
          {optimalTrips != null && optimalTrips.length > 0 && (
            <div>
              {/* select dropdown for addresses */}
              <details role="list">
                <summary
                  aria-haspopup="listbox"
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    paddingRight: 'calc(var(--form-element-spacing-horizontal) + 1.125em)',
                  }}
                >
                  {selectedAddress || 'Select address'}
                </summary>
                <ul role="listbox">
                  {optimalTripAddresses.map((address, index) => (
                    <li key={index}>
                      <label
                        htmlFor={`${index}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          // toggle open attribute of parent details tag
                          const details = e.currentTarget.closest('details')
                          if (details == null) return
                          details.removeAttribute('open')
                        }}
                      >
                        <input
                          type="radio"
                          id={`${index}`}
                          name="selectedAddress"
                          value={address}
                          checked={selectedAddress === address}
                          onChange={() => setSelectedAddress(address)}
                          style={{ minWidth: '1.25em' }}
                        />
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {address}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </details>
              <div style={{ height: '0.5rem' }} />
              {/* optimal trip result */}
              <div className={styles.addressesContainer}>
                <div className={styles.addressesHeadingContainer}>
                  <h5 className={styles.addressesHeading}>Optimal Route</h5>
                </div>
                {selectedAddressOptimalTrip == null && (
                  <div>Could not find optimal route for selected address. Please try again.</div>
                )}
                {selectedAddressOptimalTrip != null && (
                  <div>
                    {selectedAddressOptimalTrip.optimalRoute.length === 0 && (
                      <p>No optimal route for selected address.</p>
                    )}
                    {selectedAddressOptimalTrip.optimalRoute.length > 0 && (
                      <ol className={styles.addresses}>
                        <li style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                          <span>
                            <b>FROM</b>
                          </span>
                          <span>{selectedAddress}</span>
                          <br />
                          <span>
                            <b>TO</b>
                          </span>
                        </li>
                        {selectedAddressOptimalTrip.optimalRoute.map((route, index) => {
                          const { address, distance, duration } = route
                          return (
                            <li
                              key={index}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.125rem',
                              }}
                            >
                              <span>&bull; {address},</span>
                              <span>
                                <b>{distance.text}</b> ~ <b>{duration.text}</b>
                              </span>
                            </li>
                          )
                        })}
                      </ol>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </NoSSR>
  )
}

export default SequenceTripResult
