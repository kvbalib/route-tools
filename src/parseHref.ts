import qs, { ParsedQs } from 'qs'

import type { RouteDefinitions, RouteParamList } from './index.types'
import { createRoutePatternMatcher } from './utils/createRoutePatternMatcher'

/**
 * Parses a given `href` (URL or path) and extracts the route name, parameters, and query string.
 */
export function parseHref<ParamList extends RouteParamList>(
  href: string,
  routeDefinitions: RouteDefinitions<ParamList>
): { route: keyof ParamList; params?: ParamList[keyof ParamList]; query?: ParsedQs } | null {
  // Parse the input URL (works for both absolute URLs and relative paths)
  let url: URL
  if (href.startsWith('http')) url = new URL(href)
  else {
    // Prepend a dummy base for relative URLs to use URL parser
    const base = 'http://dummy'
    url = href.startsWith('/') ? new URL(href, base) : new URL(`/${href}`, base)
  }
  const pathname = url.pathname
  const queryString = url.search.startsWith('?') ? url.search.substring(1) : url.search
  const query = qs.parse(queryString) // parse query string into ParsedQs object

  for (const [routeName, pattern] of Object.entries(routeDefinitions)) {
    const matcher = createRoutePatternMatcher(pattern)

    if (!matcher) continue // Skip if matcher creation failed

    const result = matcher(pathname)
    if (result) {
      const rawParams = result.params // path parameters from the URL
      const params: Record<string, any> = {}

      // Coerce parameters to the expected types defined in ParamList
      for (const [key, val] of Object.entries(rawParams)) {
        if (val == null) continue // skip if param is undefined or null (optional param not present)
        if (typeof val === 'string') {
          const valueStr = val
          const lower = valueStr.toLowerCase()
          if (lower === 'true' || lower === 'false') {
            // Convert "true"/"false" to boolean
            params[key] = lower === 'true'
          } else if (valueStr !== '' && !isNaN(Number(valueStr))) {
            // Convert numeric strings to number (integer or float)
            params[key] = Number(valueStr)
          } else {
            // Keep string as-is for other cases
            params[key] = valueStr
          }
        } else {
          // If value is already a number or boolean (unlikely from path match), or an array (in case of repeat params), use it directly
          params[key] = val
        }
      }

      // Build the result object with route name, params (if any), and query (if any)
      const resultObject: any = { route: routeName as keyof ParamList }
      if (Object.keys(params).length > 0) {
        resultObject.params = params as ParamList[typeof routeName]
      }
      if (Object.keys(query).length > 0) {
        resultObject.query = query
      }
      return resultObject
    }
  }

  // No route matched
  return null
}
