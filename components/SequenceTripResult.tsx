import React, { useEffect, useMemo } from 'react'
import styles from '@/style/sequenceTrip.module.scss'
import { page, setOptimizeTripBy } from '@/store/page'
import NoSSR from 'react-no-ssr'
import { OptimizeTripByType } from '@/schema/types'
import clsx from 'clsx'
import BigNumber from 'bignumber.js'

type Props = {
  readonly showHeading?: boolean
}

function SequenceTripResult(props: Props) {
  const { showHeading = true } = props
  const [selectedAddress, setSelectedAddress] = React.useState<string | null>(null)
  const [requestId, setRequestId] = React.useState<string | null>(null)
  const [openAddressListbox, setOpenAddressListbox] = React.useState(false)

  const { optimizeTripBy, optimalTrip } = page.use()
  // auto select 1st address when optimalTrip changes
  useEffect(() => {
    if (optimalTrip == null) return
    if (requestId === optimalTrip.requestId) return
    const optimalTrips = optimalTrip.optimalTrip[optimizeTripBy]
    const optimalTripAddresses = optimalTrips.map((trip) => trip.startAddress)
    if (optimalTripAddresses.length > 0) {
      setSelectedAddress(optimalTripAddresses[0])
      setRequestId(optimalTrip.requestId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optimalTrip])

  const optimalTrips = useMemo(() => {
    if (optimalTrip == null) return null
    return optimalTrip.optimalTrip[optimizeTripBy]
  }, [optimalTrip, optimizeTripBy])

  const optimalTripAddresses: string[] = useMemo(() => {
    if (optimalTrips == null) return []
    return optimalTrips.map((trip) => trip.startAddress)
  }, [optimalTrips])

  const selectedAddressOptimalTrip = useMemo(() => {
    if (optimalTrips == null) return null
    return optimalTrips.find((trip) => trip.startAddress === selectedAddress)
  }, [optimalTrips, selectedAddress])

  const [totalDistance, totalDuration] = useMemo(() => {
    if (selectedAddressOptimalTrip == null) {
      return [null, null]
    }

    const [totalDistanceBN, totalDurationBN] = selectedAddressOptimalTrip.optimalRoute.reduce(
      (acc, route) => {
        return [acc[0].plus(route.distance.value), acc[1].plus(route.duration.value)]
      },
      [new BigNumber(0), new BigNumber(0)]
    )
    return [
      totalDistanceBN.div(1000).decimalPlaces(1).toNumber(),
      Math.ceil(totalDurationBN.div(60).decimalPlaces(1).toNumber()),
    ]
  }, [selectedAddressOptimalTrip])

  return (
    <NoSSR>
      <div>
        {showHeading && <h4 className={styles.heading}>Sequence Result</h4>}
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
              <h5 className={styles.heading}>Change Start Address</h5>
              <details
                role="list"
                open={openAddressListbox}
                onClick={(e) => {
                  e.preventDefault()
                  setOpenAddressListbox(!openAddressListbox)
                }}
              >
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
                          e.preventDefault()
                          setSelectedAddress(address)
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
                  <div data-tooltip="Optimize By" style={{ border: 0 }}>
                    <select
                      value={optimizeTripBy}
                      onChange={(e) => {
                        const value = e.target.value as OptimizeTripByType
                        setOptimizeTripBy(value)
                      }}
                      style={{
                        padding: '0.1rem 2.5rem 0.1rem 0.5rem',
                        fontSize: '0.85rem',
                        margin: 0,
                        cursor: 'pointer',
                      }}
                    >
                      <option value="distance">distance</option>
                      <option value="duration">duration</option>
                    </select>
                  </div>
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
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <b>FROM</b>{' '}
                            <span className={clsx(styles.startAddressIndicator)}>
                              START ADDRESS
                            </span>
                          </span>
                          <span>{selectedAddress}</span>
                        </li>
                        <ol className={styles.toAddresses}>
                          <li
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.125rem',
                              margin: '0 0 0 -1.75rem',
                            }}
                          >
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
                                  display: 'list-item',
                                  listStyleType: 'decimal-leading-zero',
                                  margin: 0,
                                }}
                              >
                                <span
                                  style={{
                                    flex: 1,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '0.25rem',
                                  }}
                                >
                                  <span>{address}</span>
                                  <span>
                                    <b>{distance.text}</b> ~ <b>{duration.text}</b>
                                  </span>
                                </span>
                              </li>
                            )
                          })}
                        </ol>
                        <li style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <b>TOTAL DISTANCE & DURATION</b>
                          </span>
                          <span>
                            <b>{totalDistance} km</b> ~ <b>{totalDuration} mins</b>
                          </span>
                        </li>
                      </ol>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </NoSSR>
  )
}

export default SequenceTripResult
