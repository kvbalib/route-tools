/**
 * Converts legacy route definitions with trailing optional parameters to make it work with new path-to-regexp.
 * (e.g. '/more/:slug/:secondSlug?') to the new syntax
 * (e.g. '/more/:slug/{.:secondSlug}') for use with path-to-regexp.
 *
 * Note: This is a basic implementation and may need adjustments for more complex routes.
 */
export function convertLegacyRoute(route: string, splatKey?: string): string {
  return (
    route
      // Handle optional parameters (?)
      .replace(/\/:([a-zA-Z0-9_]+)\?/g, '/{.:$1}')
      // Handle optional splat (*)
      .replace(/\/\*/g, `{/*${splatKey || 'path'}}`)
      // TODO: Handle repeating parameters (+)
      // .replace(/\/:([a-zA-Z0-9_]+)\+/g, '/*$1');
  )
}
