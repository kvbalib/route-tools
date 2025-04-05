import { pathToRegexp } from 'path-to-regexp'

import { convertLegacyRoute } from './convertLegacyRoutes'

/**
 * Checks if a given path matches a specific pattern.
 *
 * @param {string} pattern - The pattern to match against.
 * @param {string} path - The path to check.
 * @returns {boolean} - Returns true if the path matches the pattern, false otherwise.
 */
export function matchPath(pattern: string, path: string): boolean {
  try {
    return pathToRegexp(pattern).regexp.test(path)
  } catch {
    const converted = convertLegacyRoute(pattern)

    try {
      return pathToRegexp(converted).regexp.test(path)
    } catch (error) {
      console.error('Error in pathToRegexp after conversion:', error)
    }

    return false
  }
}
