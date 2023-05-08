import React from 'react'
import styles from '../src/style/SequenceTrip.module.scss'
import clsx from 'clsx'
import { FaMinusCircle, FaTrash } from 'react-icons/fa'

const MAX_NUMBER_OF_ADDRESSES = 10

function SequenceTrip() {
  const [addresses, setAddresses] = React.useState<string[]>([])
  const addAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (addresses.length >= MAX_NUMBER_OF_ADDRESSES) {
      window.alert('You can add a maximum of 10 addresses.')
      return
    }
    setAddresses([...addresses, address])
    setAddress('')
  }
  const removeAddress = (index: number) => () => {
    setAddresses(addresses.filter((_, i) => i !== index))
  }
  const clearAddresses = () => () => {
    setAddresses([])
  }

  const [address, setAddress] = React.useState<string>('')
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
  }

  const disableForm = addresses.length >= MAX_NUMBER_OF_ADDRESSES
  const disableSequenceTripButton = addresses.length < 2

  return (
    <div className={clsx('grid', styles.sequenceTrip)}>
      {/* sequence trip form */}
      <div>
        <h4 className={styles.heading}>Sequence</h4>
        {/* address form */}
        <form onSubmit={addAddress} className={styles.sequenceTripForm}>
          <input
            type="text"
            placeholder="Enter address"
            required
            value={address}
            onChange={handleInputChange}
            disabled={disableForm}
          />
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
                onClick={clearAddresses()}
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
                  <span>{index + 1}.</span>
                  <span>{address}</span>
                </li>
              ))}
            </ol>
          )}
          {addresses.length === 1 && <p>Add at least 2 addresses to sequence trip</p>}
        </div>

        <button className={styles.sequenceTripButton} disabled={disableSequenceTripButton}>
          Sequence Trip
        </button>
      </div>

      {/* sequence trip result */}
      <div>
        <h4 className={styles.heading}>Sequence Result</h4>
        <div>
          <p>
            Click <b>Sequence Trip</b> button and see the result here.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SequenceTrip
