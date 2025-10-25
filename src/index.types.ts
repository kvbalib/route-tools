import type { ParsedQs } from 'qs'

export type RouteParamList = object

export type RouteDefinitions<ParamList extends RouteParamList> = {
  [K in keyof ParamList]: string
}

export type PrepareRouteOptions<
  ParamList extends RouteParamList,
  R extends keyof ParamList,
> = undefined extends ParamList[R]
  ? { params?: never; query?: ParsedQs }
  : { params: ParamList[R]; query?: ParsedQs }

export type PrepareArgs<
  ParamList extends RouteParamList,
  R extends keyof ParamList,
> = undefined extends ParamList[R]
  ? [routeName: R, options?: { query?: ParsedQs }] // paramless routes -> options is OPTIONAL
  : [routeName: R, options: { params: ParamList[R]; query?: ParsedQs }] // paramful routes -> options is REQUIRED
