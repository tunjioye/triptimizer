import React, { MouseEventHandler } from 'react'
import styles from '@/style/sequenceTrip.module.scss'
import clsx from 'clsx'
import { FaMinusCircle, FaTrash } from 'react-icons/fa'
import { page, setAddresses, runTrip } from '@/store/page'
import NoSSR from 'react-no-ssr'
import { GoogleApiWrapper, IProvidedProps } from 'google-maps-react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { publicRuntimeConfig } from '@/config'
import { GooglePlacesAddress } from '@/schema/types'
import { MAX_NUMBER_OF_ADDRESSES } from 'components/SequenceTrip'

type Props = IProvidedProps & {
  readonly showHeading?: boolean
}

function SequenceTripForm(props: Props) {
  const { showHeading = true } = props
  const [address, setAddress] = React.useState<GooglePlacesAddress | null>(null)

  const { addresses = [], fetchingOptimalTrip } = page.use()
  const addAddress = () => {
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
      <div>
        {showHeading && <h4 className={styles.heading}>Sequence Trip</h4>}
        {/* address form */}
        <form onSubmit={(e) => e.preventDefault()} className={styles.sequenceTripForm}>
          <div style={{ width: 'calc(100% - 100px - 0.5rem)' }}>
            <GooglePlacesAutocomplete
              apiKey={publicRuntimeConfig.GOOGLE_MAPS_API_KEY}
              apiOptions={{ language: 'en', region: 'ca' }}
              autocompletionRequest={{
                componentRestrictions: {
                  country: ['ca'],
                },
              }}
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
                onKeyDown: (e: any) => {
                  if (address == null) {
                    return
                  }
                  switch (e.key) {
                    case 'Enter':
                      addAddress()
                      break
                    default:
                      break
                  }
                },
              }}
            />
          </div>
          <button
            type="button"
            onClick={addAddress}
            className={styles.addButton}
            disabled={disableForm}
          >
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
    </NoSSR>
  )
}

export default GoogleApiWrapper({
  apiKey: publicRuntimeConfig.GOOGLE_MAPS_API_KEY,
  libraries: ['places'],
})(SequenceTripForm)
