import { isAppPath } from './isAppPath'
import { parseHref } from './parseHref'
import { prepareRoute } from './prepareRoute'

import type {
  PrepareArgs,
  PrepareRouteOptions,
  RouteDefinitions,
  RouteParamList,
} from './index.types'

export function createRoutePrepare<
  ParamList extends RouteParamList,
  Defs extends RouteDefinitions<ParamList> = RouteDefinitions<ParamList>,
>(routeDefinitions: Defs) {
  return function <Name extends keyof ParamList>(
    ...args: PrepareArgs<ParamList, Name>
  ): Defs[Name] {
    // Normalize args for the runtime implementation
    const [routeName, options] = args as unknown as [Name, PrepareRouteOptions<ParamList, Name>]
    return prepareRoute(routeDefinitions, routeName, options)
  }
}

export function createParseHref<
  ParamList extends RouteParamList,
  Defs extends RouteDefinitions<ParamList> = RouteDefinitions<ParamList>,
>(routeDefinitions: Defs) {
  return function (href: string) {
    return parseHref(href, routeDefinitions)
  }
}

export function createIsAppPath<
  ParamList extends RouteParamList,
  Defs extends RouteDefinitions<ParamList> = RouteDefinitions<ParamList>,
>(routeDefinitions: Defs) {
  return function (href: string): boolean {
    return isAppPath(href, routeDefinitions)
  }
}

const init = <
  ParamList extends RouteParamList,
  Defs extends RouteDefinitions<ParamList> = RouteDefinitions<ParamList>,
>(
  routeDefinitions: Defs
) => ({
  parseHref: createParseHref<ParamList, Defs>(routeDefinitions),
  prepareRoute: createRoutePrepare<ParamList, Defs>(routeDefinitions),
  isAppPath: createIsAppPath<ParamList, Defs>(routeDefinitions),
})

export type { RouteParamList, RouteDefinitions, PrepareRouteOptions }
export default init
