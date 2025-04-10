import qs from 'qs'

import type { PrepareRouteOptions, RouteDefinitions, RouteParamList } from './index.types'

/**
 * Generates the complete path string for a given route name and options,
 * including support for splat routes (/*).
 *
 * @param routeDefinitions - The route definitions object.
 * @param routeName - The name of the route.
 * @param options - Optional parameters and query for the route.
 * @returns The generated path string.
 */
export function prepareRoute<ParamList extends RouteParamList, Name extends keyof ParamList>(
  routeDefinitions: RouteDefinitions<ParamList>,
  routeName: Name,
  options?: PrepareRouteOptions<ParamList, Name>
): string {
  try {
    const template = routeDefinitions[routeName]

    // Step 1: Extract regular parameter names and check for splat
    const paramMatches = Array.from(template.matchAll(/:([A-Za-z0-9_]+)\??/g))
    const regularParamNames = paramMatches.map((m) => m[1])
    const hasSplat = template.endsWith('/*')

    // Step 2: Prepare parameter values
    const paramValues = (options?.params || {}) as Record<string, string | number | undefined>

    // Step 3: Replace regular parameters
    let finalPath = template.replace(/:([A-Za-z0-9_]+)\??/g, (_, paramName: string) => {
      if (
        paramName in paramValues &&
        paramValues[paramName] != null &&
        paramValues[paramName] !== ''
      ) {
        return String(paramValues[paramName])
      } else {
        return ''
      }
    })

    // Step 4: Handle splat if present
    if (hasSplat) {
      // Identify keys not used for regular parameters
      const providedKeys = Object.keys(paramValues)
      const splatKeys = providedKeys.filter((key) => !regularParamNames.includes(key))

      // Collect splat values in insertion order
      const splatValues = splatKeys
        .map((key) => String(paramValues[key]))
        .filter((v) => v != null && v !== '')

      // Remove /* from finalPath and append splat values
      const pathWithoutSplat = finalPath.replace(/\/\*$/g, '')
      const splatPart = splatValues.length > 0 ? '/' + splatValues.join('/') : ''
      finalPath = pathWithoutSplat + splatPart
    }

    // Step 5: Cleanup
    finalPath = finalPath.replace(/\/\?/g, '') // Remove any leftover /?
    finalPath = finalPath.replace(/\/+/g, '/') // Collapse multiple slashes
    if (finalPath.endsWith('/')) finalPath = finalPath.slice(0, -1) // Remove trailing slash

    // Step 6: Handle query string
    if (options?.query) {
      const queryString = qs.stringify(options.query, { addQueryPrefix: true })
      finalPath += queryString
    }

    return finalPath
  } catch (err) {
    console.error(`Error in prepareRoute for "${String(routeName)}":`, err)
    return routeDefinitions[routeName]
  }
}
