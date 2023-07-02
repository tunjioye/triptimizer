import { customAlphabet } from 'nanoid'

// const getAlphabets = (n = 4) => customAlphabet('ABCDEFGHJKMNPQRSTUVWXYZ', n);
// const getNumbers = (n = 4) => customAlphabet('123456789', n);
const getAlphabetsAndNumbers = (n = 4) => {
  return customAlphabet('ABCDEFGHJKMNPQRSTUVWXYZ123456789', n)
}

export const generatePass = () => `TP${getAlphabetsAndNumbers()(6)}`
