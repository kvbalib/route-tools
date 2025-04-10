import { matchPath } from './utils/matchPath'

import type { RouteDefinitions, RouteParamList } from './index.types'

/**
 * Checks if a given `href` corresponds to one of the defined application routes.
 *
 * Accepts full URLs (e.g. "https://domain.com/user/42?x=y") or relative paths
 * (with or without a leading slash). It ignores query strings and fragments,
 * considering only the path portion for matching.
 *
 * @param href - The URL or path to check.
 * @param routeDefinitions - An object mapping route keys to their path template strings.
 * @returns `true` if the path (ignoring query parameters) matches any route pattern, `false` otherwise.
 */
export function isAppPath<ParamList extends RouteParamList>(
  href: string,
  routeDefinitions: RouteDefinitions<ParamList>
): boolean {
  let path = ''
  try {
    // Use URL API for absolute URLs to extract pathname (excluding domain, query, fragment)
    path = new URL(href).pathname
  } catch {
    // For relative paths, strip query parameters or fragments and ensure a leading slash
    path = href.replace(/[?#].*$/, '')
    if (path !== '' && !path.startsWith('/')) path = '/' + path
  }
  if (path === '') path = '/' // Treat empty path as root

  // Check if the normalized path matches any route pattern
  return Object.values(routeDefinitions).some((pattern) => matchPath(pattern, path))
}
