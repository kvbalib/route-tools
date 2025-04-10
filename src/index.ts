import { isAppPath } from './isAppPath'
import { parseHref } from './parseHref'
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
 * Creates a typed route parser function for a given set of routes.
 * @param routeDefinitions
 */
export function createParseHref<ParamList extends RouteParamList>(
  routeDefinitions: RouteDefinitions<ParamList>
) {
  return function (href: string) {
    return parseHref(href, routeDefinitions)
  }
}

/**
 * Creates a function to check if a given `href` corresponds to one of the defined application routes.
 *
 * @param routeDefinitions - An object mapping route keys to their path template strings.
 * @returns A function that checks if the provided path matches any route pattern.
 */
export function createIsAppPath<ParamList extends RouteParamList>(
  routeDefinitions: RouteDefinitions<ParamList>
) {
  return function (href: string): boolean {
    return isAppPath(href, routeDefinitions)
  }
}

/**
 * Initializes a service object for route preparation.
 *
 * @param routeDefinitions - An object mapping route keys to their path template strings.
 * @returns An object containing the `prepareRoute` function.
 */
const init = <ParamList extends RouteParamList>(routeDefinitions: RouteDefinitions<ParamList>) => ({
  parseHref: createParseHref<ParamList>(routeDefinitions),
  prepareRoute: createRoutePrepare<ParamList>(routeDefinitions),
  isAppPath: createIsAppPath<ParamList>(routeDefinitions),
})

export type { RouteParamList, RouteDefinitions, PrepareRouteOptions }
export default init
