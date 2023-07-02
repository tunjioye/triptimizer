import React, { useState } from 'react'
import styles from '@/style/sequenceTrip.module.scss'
import { page, setPass } from '@/store/page'
import NoSSR from 'react-no-ssr'
import Link from 'next/link'

type Props = {
  readonly showHeading?: boolean
  readonly onSet: () => void
}

function SetPass(props: Props) {
  const { showHeading = true, onSet } = props
  const { pass = '' } = page.use()
  const [passState, setPassState] = useState(pass)

  const handleSetPass = () => {
    setPass(passState)
    onSet()
  }
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSetPass()
  }

  return (
    <NoSSR>
      <div>
        {showHeading && <h4 className={styles.heading}>Set Early Access Pass</h4>}
        <div style={{ marginBottom: '0.5rem' }}>
          Early Access Pass is required to use this service.
        </div>
        <form onSubmit={onSubmit} className={styles.sequenceTripForm}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Early Access Pass (TP******)"
              required
              value={passState}
              onChange={(e) => setPassState(e.target.value.toUpperCase().trim().slice(0, 8))}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleSetPass()
                }
              }}
            />
            <Link href="/pass">
              <small>Request for Early Access Pass</small>
            </Link>
          </div>
          <button
            type="submit"
            onClick={handleSetPass}
            className={styles.addButton}
            disabled={passState.length < 8}
            style={{ alignSelf: 'flex-start' }}
          >
            Set
          </button>
        </form>
      </div>
    </NoSSR>
  )
}

export default SetPass
