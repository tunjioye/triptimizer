import { PassApiResponse } from '@/schema/types'
import { requestForPass } from '@/store/page'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input'

type FormState = {
  firstname: string
  lastname: string
  email: string
  phone?: string
  professionOption: string
  profession: string
}

function PassPage() {
  const [submitting, setSubmitting] = useState(false)
  const [formState, setFormState] = useState<FormState>({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    professionOption: 'Realtor',
    profession: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (!formState.phone) {
        const errorMessage = 'Phone number is required'
        window.alert(errorMessage)
        throw new Error(errorMessage)
      }
      const parsedPhone = parsePhoneNumber(formState.phone)
      if (!parsedPhone || !parsedPhone.isValid()) {
        const errorMessage = 'Invalid phone number'
        window.alert(errorMessage)
        throw new Error(errorMessage)
      }

      const { country, countryCallingCode, nationalNumber } = parsedPhone
      const earlyAccessUser = {
        firstname: formState.firstname,
        lastname: formState.lastname,
        email: formState.email,
        phone: `${country}-${countryCallingCode}-${nationalNumber}`,
        profession:
          formState.professionOption === 'Other'
            ? formState.profession
            : formState.professionOption,
      }

      setSubmitting(true)
      const res = await requestForPass({ earlyAccessUser })
      toast.success(res.payload.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="container">
      <hgroup>
        <h2>Get Pass</h2>
        <p>Register for early access to get pass</p>
      </hgroup>

      <form onSubmit={onSubmit}>
        <div className="grid">
          <label htmlFor="firstname">
            First name
            <input
              type="text"
              id="firstname"
              name="firstname"
              placeholder="First name"
              required
              value={formState.firstname}
              onChange={handleChange}
            />
          </label>

          <label htmlFor="lastname">
            Last name
            <input
              type="text"
              id="lastname"
              name="lastname"
              placeholder="Last name"
              required
              value={formState.lastname}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="grid">
          <label htmlFor="email">
            Email address
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email address"
              required
              value={formState.email}
              onChange={handleChange}
            />
            <small>We may contact you.</small>
          </label>

          <label htmlFor="phone">
            Phone number
            <PhoneInput
              defaultCountry="CA"
              countries={['CA', 'US']}
              placeholder="Phone number"
              value={formState.phone}
              onChange={(phone) => setFormState({ ...formState, phone })}
            />
          </label>
        </div>

        <div className="grid">
          <label htmlFor="professionOption">
            Select Profession
            <select
              id="professionOption"
              required
              name="professionOption"
              value={formState.professionOption}
              onChange={handleChange}
            >
              <option value="Realtor">Realtor</option>
              <option value="Other">Other</option>
            </select>
          </label>
          {formState.professionOption === 'Other' && (
            <label htmlFor="profession">
              Profession
              <input
                type="text"
                id="profession"
                name="profession"
                placeholder="Profession"
                required
                value={formState.profession}
                onChange={handleChange}
              />
            </label>
          )}
        </div>

        <br />

        <button type="submit" aria-busy={submitting}>
          Register for Early Access
        </button>
      </form>

      <br />
    </main>
  )
}

export default PassPage
