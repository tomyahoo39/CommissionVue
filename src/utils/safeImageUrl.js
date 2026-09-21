const rawApiUrl = import.meta.env.VITE_API_URL || ''

const resolvedBaseOrigin = (() => {
  const envOrigin = import.meta.env.VITE_API_ORIGIN
  if (envOrigin) return envOrigin

  try {
    return new URL(rawApiUrl).origin
  } catch {
    return 'https://localhost:7015'
  }
})()

const allowedHosts = new Set([
  new URL(resolvedBaseOrigin).host,
  'res.cloudinary.com'
])

export const getImageUrl = (path) => {
  if (typeof path !== 'string') return ''

  const value = path.trim()
  if (!value) return ''

  if (value.startsWith('/')) {
    return `${resolvedBaseOrigin}${value}`
  }

  try {
    const url = new URL(value)
    if (!['https:', 'http:'].includes(url.protocol)) return ''
    if (!allowedHosts.has(url.host)) return ''
    return url.toString()
  } catch {
    return ''
  }
}
