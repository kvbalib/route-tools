# route-tools

A utility toolkit for managing routes with **full type safety** in TypeScript applications. **route-tools** helps you generate URL paths from route names and parameters without worrying about typos or mismatched params. It's designed to work seamlessly with front-end frameworks like **React** (including React Router) and **React Native** (React Navigation), as well as Node.js backends, ensuring your routes stay consistent across your project.

## Installation

You can install **route-tools** via your preferred package manager:

- **npm:**
  ```bash
  npm install route-tools
  ```
- **yarn:**
  ```bash
  yarn add route-tools
  ```
- **pnpm:**
  ```bash
  pnpm add route-tools
  ```

## Usage

### Basic Usage Example (React or Node)

First, define your route names and their path templates, then initialize `route-tools`. This creates a **type-safe** `prepareRoute` function tailored to your routes:

```ts
import init from 'route-tools'

// 1. Define a type mapping each route to its params (or undefined if none).
type AppRoutes = {
  home: undefined;
  userProfile: { userId: string };
  search: { query?: string }; // search has an optional query param
}

// 2. Define route templates with dynamic segments (`:param` for required, `:param?` for optional).
const routes: Record<keyof AppRoutes, string> = {
  home: '/home',
  userProfile: '/user/:userId',
  search: '/search/:query?', // (optional param in path)
}

// 3. Initialize route-tools with the route definitions.
const { prepareRoute } = init<AppRoutes>(routes)

// 4. Generate paths using the prepared function:
const homePath = prepareRoute('home')
// returns "/home"

const profilePath = prepareRoute('userProfile', { params: { userId: '42' } })
// returns "/user/42"

const searchPath = prepareRoute('search', { params: {}, query: { q: 'test', page: 2 } })
// returns "/search?q=test&page=2"
// (here we didn't provide the optional :query param in the path, so it was omitted, and we added query string parameters)
```

In this example:

- **`homePath`** generates a simple path with no parameters.
- **`profilePath`** replaces the `:userId` segment with the provided parameter.
- **`searchPath`** omits the optional path segment (since none provided) and appends query parameters using the `query` object.

These generated paths can be used throughout your application:
- In **React Router** for navigation (e.g., `<Link to={...}>` elements).
- In **Next.js** or similar frameworks to construct URLs programmatically.
- In **Node.js** (e.g., Express) to create redirect URLs or for HTTP requests.
- In **React Native**, to handle deep linking or with React Navigation.

### React Native Example (Multiple Route Definitions)

If you're using **React Navigation** in a React Native app, you often have multiple navigators (e.g., a stack navigator and a tab navigator). With **route-tools**, you can create separate `prepareRoute` functions for each navigator and combine them for convenient access. For example, given a `RootStackParamList` and `RootTabParamList` from your navigation setup:

```ts
import { RootStackParamList, RootTabParamList } from '@/router/Router.types'
import { stackRoutes, tabRoutes } from '@/router/routes'
import init from 'route-tools'

export const RouteToolsStack = init<RootStackParamList>(stackRoutes)
export const RouteToolsTab = init<RootTabParamList>(tabRoutes)

export const prepareRoute = {
  stack: RouteToolsStack.prepareRoute,
  tab: RouteToolsTab.prepareRoute,
}
```

In this pattern:

- **`RootStackParamList` / `stackRoutes`** define the routes for your stack navigator.
- **`RootTabParamList` / `tabRoutes`** define the routes for your tab navigator.
- Two instances of `init` create two prepared route helpers, one for each navigator.
- The combined `prepareRoute` object provides easy access to both sets via `prepareRoute.stack` and `prepareRoute.tab`.

This setup is particularly useful for **deep linking**. For example, to open a specific screen via a deep link:

```ts
const url = prepareRoute.stack('ProfileScreen', { params: { userId: '123' } })
Linking.openURL(`myapp://app${url}`)  // opens "ProfileScreen" with the userId
```

Or, to navigate within your app:

```ts
navigation.navigate('ProfileScreen', { userId: '123' })
// (React Navigation will use the defined route patterns internally)
```

## API Reference

### `init<ParamList>(routeDefinitions)`

Initializes a route utility object for a given set of routes.

- **`ParamList`**: A TypeScript type mapping each route name to its parameter type. Use `undefined` for routes without parameters. For example:
  ```ts
  type ParamList = {
    home: undefined;
    profile: { userId: string };
    search: { query?: string };
  }
  ```
- **`routeDefinitions`**: An object mapping each route name (key) to a path template (value). The keys should match exactly with those in `ParamList`. Dynamic segments are prefixed with `:` (append `?` for optional segments).  
  Example:
  ```ts
  const routeDefinitions = {
    home: '/home',
    profile: '/user/:userId',
    search: '/search/:query?',
  }
  ```
- **Returns**: An object containing a `prepareRoute` function tailored to these routes.

### `prepareRoute(routeName, options?)`

Generates a complete path string for the given route name by substituting dynamic segments and appending query parameters.

**Parameters:**

- **`routeName`** (`Name extends keyof ParamList`): The name of the route to generate. Must be one of the keys defined in your `ParamList`.
- **`options`** (optional): An object with:
    - **`params`**: An object containing values for the dynamic segments in the route. This should conform to `ParamList[routeName]`.
    - **`query`**: An optional object containing query string parameters to append to the URL.

**Returns:**  
A `string` representing the fully constructed path. All dynamic segments (e.g., `:userId`) are replaced with values from `params`. Optional segments (marked with `?`) are omitted if no value is provided, and any provided `query` object is serialized into a query string.

**Examples:**

- For a route definition `profile: '/user/:userId'` and `ParamList['profile'] = { userId: string }`:
  ```ts
  prepareRoute('profile', { params: { userId: 'abc123' } })
  // returns "/user/abc123"
  ```
- For a route definition `search: '/search'` (with no dynamic segments) and `ParamList['search'] = undefined`:
  ```ts
  prepareRoute('search', { query: { q: 'coffee', limit: 5 } })
  // returns "/search?q=coffee&limit=5"
  ```
- For a route definition `product: '/products/:category?'` (with an optional segment):
  ```ts
  prepareRoute('product', { params: { category: 'electronics' } })
  // returns "/products/electronics"

  prepareRoute('product')
  // returns "/products"  (the category segment is omitted)
  ```

Internally, `prepareRoute` leverages the [**qs** library](https://www.npmjs.com/package/qs) to handle serialization of the `query` object, supporting nested objects and arrays.

## Type Safety Advantages

One of the key benefits of **route-tools** is **type safety**:

- **Compile-Time Checks:**
    - Required parameters: TypeScript enforces that all required parameters are provided.
    - Extra parameters: Routes without parameters reject extraneous values.
- **Valid Route Names:**
    - The `routeName` argument is restricted to the keys defined in your `ParamList`, reducing typos and ensuring consistency.
- **Autocompletion:**
    - Your IDE will provide autocompletion for both route names and parameters, speeding up development and reducing errors.
- **Single Source of Truth:**
    - Defining routes and their types in one place keeps your navigation logic consistent across your application.

Even if you’re using plain JavaScript, centralizing your route definitions with **route-tools** can help avoid common pitfalls in URL construction.

## License

**route-tools** is released under the [MIT License](./LICENSE). Feel free to use, modify, and distribute this library in your projects. Contributions and feedback are highly appreciated!

---

*More tools and features are on the way – stay tuned for updates!*