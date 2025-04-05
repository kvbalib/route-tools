/**
 * Converts legacy route definitions with trailing optional parameters to make it work with new path-to-regexp.
 * (e.g. '/more/:slug/:secondSlug?') to the new syntax
 * (e.g. '/more/:slug/{.:secondSlug}') for use with path-to-regexp.
 *
 * Note: This is a basic implementation and may need adjustments for more complex routes.
 */
export function convertLegacyRoute(route: string): string {
  return route.replace(/\/:([a-zA-Z0-9_]+)\?/g, '/{.:$1}')
}
