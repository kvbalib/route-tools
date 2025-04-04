import { prepareRoute } from './prepareRoute'

import type { PrepareRouteOptions, RouteDefinitions, RouteParamList } from './index.types'

/**
 * Creates a typed route path generator function for a given set of routes.
 *
 * @param routeDefinitions - An object mapping route keys to their path template strings.
 * @returns A `prepareRoute` function that generates the complete path string with parameters and query strings.
 */
export function createRoutePrepare<ParamList extends RouteParamList>(
  routeDefinitions: RouteDefinitions<ParamList>
) {
  return function <Name extends keyof ParamList>(
    routeName: Name,
    options?: PrepareRouteOptions<ParamList, Name>
  ): string {
    return prepareRoute(routeDefinitions, routeName, options)
  }
}

/**
 * Initializes a service object for route preparation.
 *
 * @param routeDefinitions - An object mapping route keys to their path template strings.
 * @returns An object containing the `prepareRoute` function.
 */
export default function init<ParamList extends RouteParamList>(
  routeDefinitions: RouteDefinitions<ParamList>
) {
  return {
    prepareRoute: createRoutePrepare<ParamList>(routeDefinitions),
  }
}

export type { RouteParamList, RouteDefinitions, PrepareRouteOptions }
