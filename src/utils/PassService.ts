import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'
import { EarlyAccessSheetRow, PassApiRequestBody, PassApiResponse } from '@/schema/types'
import { serverRuntimeConfig } from '@/config'
import { generatePass } from './generatePass'
import BigNumber from 'bignumber.js'

const PASS_LIMIT = 50
const SHEET_ID = serverRuntimeConfig.GOOGLE_SHEETS_SHEET_ID
const jwt = new JWT({
  email: serverRuntimeConfig.GOOGLE_SHEETS_CLIENT_EMAIL,
  key: serverRuntimeConfig.GOOGLE_SHEETS_PRIVATE_KEY,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ],
})

export class PassService {
  private doc = new GoogleSpreadsheet(SHEET_ID, jwt)

  constructor() {}

  generate() {
    return generatePass()
  }

  validateAddUserToSheet(requestBody: PassApiRequestBody) {
    const { earlyAccessUser } = requestBody
    if (!earlyAccessUser) {
      throw new Error('Must provide early access user')
    }
    const { firstname, lastname, email, phone, profession } = earlyAccessUser
    if (!firstname) {
      throw new Error('Must provide firstname')
    }
    if (!lastname) {
      throw new Error('Must provide lastname')
    }
    if (!email) {
      throw new Error('Must provide email')
    }
    if (!phone) {
      throw new Error('Must provide phone')
    }
    if (!profession) {
      throw new Error('Must provide profession')
    }
  }

  addUserToSheet(requestBody: PassApiRequestBody) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.validateAddUserToSheet(requestBody)
      } catch (error: any) {
        reject(error)
        return
      }

      const { earlyAccessUser } = requestBody
      const { firstname, lastname, email, phone, profession } = earlyAccessUser

      try {
        await this.doc.loadInfo()
        const sheet = this.doc.sheetsByIndex[0]
        const rowsRes = await sheet.getRows()
        const rows = rowsRes.map((r) => r.toObject() as EarlyAccessSheetRow)

        // handle existing user with pass
        const existingUser = rows.find((r) => {
          return r.email && r.email === email.toLowerCase().trim()
        })
        if (
          existingUser &&
          existingUser.pass &&
          new BigNumber(existingUser.usage).isLessThan(existingUser.limit)
        ) {
          const payload: PassApiResponse['payload'] = {
            message: `Pass already generated. \nUsed ${existingUser.usage} of ${existingUser.limit} times`,
            // hide pass from response
            user: { ...existingUser, pass: existingUser.pass.replaceAll(/./g, '*') },
          }
          reject(payload)
          return
        }

        const generatedPass = this.generate()
        const newUserData = {
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          profession: profession.trim(),
          pass: generatedPass,
          limit: PASS_LIMIT,
          usage: 0,
          created: new Date().toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
          }),
        }
        const newUserRes = await sheet.addRow(newUserData)
        const newUser = newUserRes.toObject() as EarlyAccessSheetRow
        const payload: PassApiResponse['payload'] = {
          message: 'User added',
          // hide pass from response
          user: { ...newUser, pass: newUser.pass.replaceAll(/./g, '*') },
        }

        resolve(payload)
      } catch (error: any) {
        reject(error)
      }
    })
  }

  incrementUsage(pass: string): Promise<{
    status: 'OK' | 'INVALID_PASS' | 'PASS_LIMIT_REACHED' | 'ERROR'
    message: string
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.doc.loadInfo()
        const sheet = this.doc.sheetsByIndex[0]
        const rowsRes = await sheet.getRows()
        const rows = rowsRes.map((r) => r.toObject() as EarlyAccessSheetRow)

        const userIndex = rows.findIndex((r) => {
          return r.pass && r.pass === pass.toUpperCase().trim()
        })
        const user = rows[userIndex]
        if (!user) {
          reject({
            status: 'INVALID_PASS',
            message: 'Invalid Pass. \nRegister as early user to get a pass.',
          })
          return
        }

        // check if pass limit is reached
        if (new BigNumber(user.usage).isGreaterThanOrEqualTo(user.limit)) {
          reject({
            status: 'PASS_LIMIT_REACHED',
            message: 'Pass limit reached. \nRegister as early user to get a new pass.',
          })
          return
        }

        const newUsage = new BigNumber(user.usage).plus(1).toNumber()
        await rowsRes[userIndex].set('usage', newUsage)
        await rowsRes[userIndex].save()
        resolve({
          status: 'OK',
          message: `Usage incremented to ${newUsage}`,
        })
      } catch (error: any) {
        reject({
          status: 'ERROR',
          ...error,
        })
      }
    })
  }
}
