/**
 * Converts legacy route definitions with trailing optional parameters to make it work with new path-to-regexp.
 * (e.g. '/more/:slug/:secondSlug?') to the new syntax
 * (e.g. '/more/:slug/{.:secondSlug}') for use with path-to-regexp.
 *
 * Note: This is a basic implementation and may need adjustments for more complex routes.
 */
export function convertLegacyRoute(route: string, splatKey?: string): string {
  // Handle optional parameters (?)
  let converted = route.replace(/\/:([a-zA-Z0-9_]+)\?/g, '/{.:$1}')

  // Handle splat (*)
  converted = converted.replace(/\/\*/g, `{/*${splatKey || 'path'}}`)

  // TODO: Handle repeating parameters (+)
  // converted = converted.replace(/\/:([a-zA-Z0-9_]+)\+/g, '/*$1');

  return converted
}