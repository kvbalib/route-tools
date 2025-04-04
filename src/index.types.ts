/**
 * Generic mapping of route keys to their path parameter types.
 * - If a route has parameters, map it to an object type describing the parameters.
 * - If a route has no parameters, use `undefined` as the type.
 *
 * For example:
 * type AppRoutes = {
 *   home: undefined;
 *   userProfile: { userId: string };
 *   search: { query?: string };
 * };
 */
export type RouteParamList = Record<string, unknown>

/**
 * Type for the route definitions object mapping route keys to path templates.
 * Each path template string can include dynamic segments prefixed with ":".
 * An optional parameter can be indicated by a trailing "?" in the template.
 *
 * The keys of this object should match exactly the keys of the ParamList.
 */
export type RouteDefinitions<ParamList extends RouteParamList> = {
  [K in keyof ParamList]: string
}

/**
 * Internal type for the options passed to the prepared route function for a given route.
 * - If the route has no parameters (ParamList[R] is undefined), then `params` should not be provided.
 * - If the route has parameters (ParamList[R] is an object type), then `params` must be provided
 *   and match the defined shape.
 * - In both cases, an optional `query` object can be provided to append a query string.
 */
export type PrepareRouteOptions<
  ParamList extends RouteParamList,
  R extends keyof ParamList,
> = undefined extends ParamList[R]
  ? { params?: never; query?: qs.ParsedQs }
  : { params: ParamList[R]; query?: qs.ParsedQs }
