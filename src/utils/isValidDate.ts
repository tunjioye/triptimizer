/**
 * returns true if string is a valid date
 *
 * @param {string} date a date string
 * @return {boolean} true or false
 */
export const isValidDate = (date: string) => Boolean(new Date(date).toString() !== 'Invalid Date')

export default isValidDate
