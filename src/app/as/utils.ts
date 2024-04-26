export function normalizeName(name: string): string {
  // Convert to lowercase
  let normalized = name.toLowerCase()

  // Remove punctuation
  normalized = normalized.replace(/[^\w\s]/g, "")

  // Replace spaces with hyphens
  normalized = normalized.replace(/\s+/g, "-")

  return normalized
}

export function generateRandomTimestamp(): number {
  const currentTimestamp = Date.now() // Current timestamp in millisecondsseconds
  const threeMonthsInMilliseconds = 90 * 24 * 60 * 60 * 1000 // 90 days in seconds
  const randomOffset =
    Math.floor(Math.random() * (2 * threeMonthsInMilliseconds + 1)) -
    threeMonthsInMilliseconds // Random offset within 3 months
  const randomTimestamp = currentTimestamp + randomOffset // Add random offset to current timestamp
  const roundedTimestamp =
    Math.round(randomTimestamp / (5 * 60 * 1000)) * (5 * 60 * 1000) // Round to nearest 5-minute interval
  return roundedTimestamp
}
export function getTimestampWithinLastYear() {
  const yearTs = 365 * 24 * 60 * 60 * 1000
  const randomWithinSixMonths = Math.floor(Math.random() * yearTs)
  return Date.now() - randomWithinSixMonths
}

export async function getRandomTag(tagsMap: Map<string, string>) {
  const tagsArray = Array.from(tagsMap.keys())
  const randomIndex = Math.floor(Math.random() * tagsArray.length)
  return tagsArray[randomIndex]
}
