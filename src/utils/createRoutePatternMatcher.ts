import { convertLegacyRoute } from './convertLegacyRoutes'
import { match } from 'path-to-regexp'

/**
 * Creates a route pattern matcher using path-to-regexp.
 */
export function createRoutePatternMatcher(pattern: string) {
  try {
    return match(pattern, { decode: decodeURIComponent })
  } catch {
    try {
      const converted = convertLegacyRoute(pattern)

      return match(converted, { decode: decodeURIComponent })
    } catch (error) {
      // If both attempts fail, log the error and return null
      console.error('Error in pathToRegexp after conversion:', error)
      return null
    }
  }
}
