import { createHmac } from "crypto"
const { AS_TOKEN } = process.env

export function getHmac(input: string) {
  const hmac = createHmac("sha256", AS_TOKEN!)
  hmac.update(input)
  return hmac.digest("hex")
}

export function getHmac32(input: string) {
  return getHmac(input).slice(0, 32)
}
