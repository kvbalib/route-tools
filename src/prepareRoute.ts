import qs from 'qs'

import type { PrepareRouteOptions, RouteDefinitions, RouteParamList } from './index.types'

/**
 * Generates the complete path string for a given route name and options.
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
    const paramValues = (options?.params || {}) as Record<string, string | number | undefined>
    const template = routeDefinitions[routeName]

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
    finalPath = finalPath.replace(/\/\?/g, '')
    finalPath = finalPath.replace(/\/+/g, '/')
    if (finalPath.endsWith('/')) {
      finalPath = finalPath.slice(0, -1)
    }

    if (options?.query) {
      const queryString = qs.stringify(options.query, { addQueryPrefix: true })
      finalPath += queryString
    }

    return finalPath.replace(/\/$/, '')
  } catch (err) {
    console.error(`Error in prepareRoute for "${String(routeName)}":`, err)
    return routeDefinitions[routeName]
  }
}
