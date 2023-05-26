import React from 'react'
import styles from '@/style/sequenceTrip.module.scss'
import clsx from 'clsx'
import { FaMinusCircle, FaTrash } from 'react-icons/fa'
import { page, setAddresses, runTrip } from '@/store/page'
import NoSSR from 'react-no-ssr'
import { GoogleApiWrapper } from 'google-maps-react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { publicRuntimeConfig } from '@/config'
import { GooglePlacesAddress } from '@/schema/types'
import SequenceTripResult from 'components/SequenceTripResult'

const MAX_NUMBER_OF_ADDRESSES = 10

function SequenceTrip() {
  const [address, setAddress] = React.useState<GooglePlacesAddress | null>(null)

  const { addresses = [], fetchingOptimalTrip } = page.use()
  const addAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (addresses.length >= MAX_NUMBER_OF_ADDRESSES) {
      window.alert('You can add a maximum of 10 addresses.')
      return
    }
    if (address === null) return
    setAddresses([...addresses, address])
    setAddress(null)
  }
  const removeAddress = (index: number) => () => {
    setAddresses(addresses.filter((_, i) => i !== index))
  }
  const clearAddresses = () => setAddresses([])

  const disableForm = addresses.length >= MAX_NUMBER_OF_ADDRESSES
  const disableSequenceTripButton = addresses.length < 2

  return (
    <NoSSR>
      <div className={clsx('grid', styles.sequenceTrip)}>
        {/* sequence trip form */}
        <div>
          <h4 className={styles.heading}>Sequence</h4>
          {/* address form */}
          <form onSubmit={addAddress} className={styles.sequenceTripForm}>
            {/* <input
              type="text"
              placeholder="Enter address"
              required
              value={address}
              onChange={handleInputChange}
              disabled={disableForm}
            /> */}
            <div style={{ width: 'calc(100% - 100px - 0.5rem)' }}>
              <GooglePlacesAutocomplete
                apiKey={publicRuntimeConfig.GOOGLE_MAPS_API_KEY}
                // apiOptions={{ language: 'en', region: 'ca' }}
                selectProps={{
                  value: address,
                  onChange: setAddress,
                  required: true,
                  placeholder: 'Enter address',
                  isDisabled: disableForm,
                  theme: (theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: ' #00acc125',
                      primary50: ' #00acc150',
                      primary75: ' #00acc175',
                      primary: '#00acc1',
                    },
                  }),
                  styles: {
                    control: (provided, state) => {
                      if (state.isFocused) {
                        return {
                          ...provided,
                          backgroundColor: 'var(--form-element-background-color)',
                          color: 'var(--form-element-color)',
                          height:
                            'calc(1rem * var(--line-height) + var(--form-element-spacing-vertical) * 2 + var(--border-width) * 2)',
                          boxShadow: '0 0 0 var(--outline-width) var(--form-element-focus-color)',
                          borderColor: 'var(--form-element-active-border-color)',
                          ':hover': {
                            borderColor: 'var(--form-element-active-border-color)',
                          },
                        }
                      }
                      return {
                        ...provided,
                        backgroundColor: 'var(--form-element-background-color)',
                        color: 'var(--form-element-color)',
                        height:
                          'calc(1rem * var(--line-height) + var(--form-element-spacing-vertical) * 2 + var(--border-width) * 2)',
                        borderColor: 'var(--form-element-border-color)',
                        ':hover': {
                          borderColor: 'var(--form-element-border-color)',
                        },
                      }
                    },
                    valueContainer: (provided, state) => ({
                      ...provided,
                      padding: '0 var(--form-element-spacing-horizontal)',
                      cursor: state.isDisabled ? undefined : 'text',
                      color: 'var(--form-element-color)',
                    }),
                    input: (provided) => ({
                      ...provided,
                      color: 'var(--form-element-color)',
                      input: {
                        boxShadow: 'none',
                        height: 'max-content',
                        color: 'var(--form-element-color)',
                      },
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: 'var(--form-element-placeholder-color)',
                      whiteSpace: 'nowrap',
                    }),
                    menu: (provided) => ({
                      ...provided,
                      borderRadius: 'var(--border-radius)',
                      backgroundColor: 'var(--dropdown-background-color)',
                      color: 'var(--dropdown-color)',
                    }),
                    option: (provided) => ({
                      ...provided,
                      ':hover': {
                        cursor: 'pointer',
                      },
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: 'var(--form-element-color)',
                    }),
                    indicatorSeparator: (provided) => ({
                      ...provided,
                      backgroundColor: 'var(--form-element-border-color)',
                    }),
                  },
                }}
              />
            </div>
            <button type="submit" className={styles.addButton} disabled={disableForm}>
              Add
            </button>
          </form>

          {/* list of addresses */}
          <div className={styles.addressesContainer}>
            <div className={styles.addressesHeadingContainer}>
              <h5 className={styles.addressesHeading}>Addresses</h5>
              {addresses.length > 0 && (
                <button
                  type="button"
                  className={clsx(styles.clearButton, 'secondary')}
                  onClick={async () => {
                    const question = 'Are you sure you want to clear all addresses?'
                    const confirmed = await window.confirm(question)
                    if (confirmed) clearAddresses()
                  }}
                >
                  <FaTrash />
                  <span>clear all</span>
                </button>
              )}
            </div>
            {addresses.length === 0 && <p>No address added yet. Please add address.</p>}
            {addresses.length > 0 && (
              <ol className={styles.addresses}>
                {addresses.map((address, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      className={clsx(styles.removeButton, 'secondary')}
                      onClick={removeAddress(index)}
                    >
                      <FaMinusCircle />
                    </button>
                    <span>
                      {index + 1}. {typeof address === 'object' ? address.label : address}
                    </span>
                  </li>
                ))}
              </ol>
            )}
            {addresses.length === 1 && <p>Add at least 2 addresses to triptimize</p>}
          </div>

          <button
            className={styles.sequenceTripButton}
            disabled={disableSequenceTripButton}
            aria-busy={fetchingOptimalTrip}
            onClick={runTrip}
          >
            Triptimize
          </button>
        </div>

        {/* sequence trip result */}
        <SequenceTripResult />
      </div>
    </NoSSR>
  )
}

export default GoogleApiWrapper({
  apiKey: publicRuntimeConfig.GOOGLE_MAPS_API_KEY,
  libraries: ['places'],
})(SequenceTrip)
