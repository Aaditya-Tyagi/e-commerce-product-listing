# E-commerce Product Listing

A single-screen React Native app that lists products from the
[DummyJSON API](https://dummyjson.com/docs/products) with infinite scroll,
search, category filter and price sort.

React Native CLI (0.86) + TypeScript.

## Setup

Requires Node 20+ and a working React Native environment
([setup guide](https://reactnative.dev/docs/environment-setup)) — JDK 17 and
Android Studio for Android, Xcode + CocoaPods for iOS.

```bash
npm install

# android
npm run android

# ios
cd ios && pod install && cd ..
npm run ios
```

If Metro isn't already running, `npm start` in a separate terminal.

No environment variables or API keys needed.

## Features

**Core**

- Product cards with image, title, brand, price, discount and rating
- Pagination, 20 per request, first page fetched on launch
- Infinite scroll that stops cleanly once everything is loaded, and never
  fires a duplicate request while one is in flight
- Pull to refresh
- Distinct states for initial load, loading more, refreshing, error and empty
- Network failures and unexpected payloads handled at the API boundary

**Extras**

- Debounced search (400ms)
- Filter by category
- Sort by price, ascending / descending
- Skeleton loaders while content loads
- Image placeholders with a fallback for thumbnails that fail to load

## Architecture

```
src/
  api/          axios instance + one file per resource (products, categories)
  hooks/        one hook per query, plus a debounce helper
  components/   presentational pieces
  screens/      ProductListScreen — composes the above, owns filter UI state
  types/        API response types
  theme/        colours, spacing, radius
  utils/        price formatting
```

Split by responsibility, with one rule per layer:

- `api/` is the only place that knows URLs and query params
- `hooks/` is the only place that knows caching and pagination
- `components/` and `screens/` only know props and local UI state

Data flows one way. The screen holds what the user picked and passes it down as
a single `filters` object; that object is also the React Query cache key, so
changing search, category or sort produces a new cache entry and refetches on
its own — no manual refetch wiring, and revisiting a previous filter renders
instantly from cache.

Adding another filter is three small edits: a field on `ProductFilters`, its
translation to a query param in `api/products.ts`, and a control in the screen.

A few decisions worth calling out:

- **Pagination is derived, not tracked.** The next `skip` is simply how many
  items are already loaded, and when that reaches `total` there is no next page.
  No page counters to keep in sync.
- **Cards are a fixed height**, which lets `FlatList` use `getItemLayout` and
  skip measuring rows entirely — faster layout and an accurate scrollbar.
- **Rows are memoised with stable callbacks**, so scrolling and paging don't
  re-render the whole list.
- **Skeletons share the card's dimensions**, so real content replaces them with
  no layout shift, and the pulse animation runs on the native driver — it stays
  smooth even while the JS thread is busy parsing the response.

## Dependencies

| Package | Why |
| --- | --- |
| `@tanstack/react-query` | `useInfiniteQuery` handles paging, caching, request dedupe and the loading/error flags. |
| `axios` | Interceptors normalise every failure into one error shape in a single place. |
| `react-native-safe-area-context` | Notch and status bar insets. |

Deliberately kept out:

- **No state management library.** React Query owns the server data; the only
  client state is search text, selected category and sort order — three
  `useState` calls in the screen.
- **No UI kit.** A theme file and `StyleSheet` are less overhead than a
  component library at this size.
- **No image caching library.** `react-native-fast-image` is barely maintained,
  so the built-in `Image` with load and error handling covers it.

## Assumptions and trade-offs

- **Search takes priority over category.** DummyJSON exposes them as separate
  endpoints (`/products/search` and `/products/category/{slug}`), so they can't
  combine in one request. An API that took both as query params would need no
  app-side change beyond passing them through.
- **Sorting is server-side**, so it applies to the whole dataset rather than
  just the loaded pages, and changing it starts again from page 1 — which is
  the correct result for the user.
- **Pull to refresh resets the query rather than refetching it.** React Query's
  `refetch` on an infinite query re-requests every page currently loaded; for a
  list several pages deep that's several requests to show the same items. Reset
  gives the user what they actually want from a pull: a clean first page.
- **A failed page load keeps the list.** Rather than replacing loaded products
  with a full-screen error, the list stays and the error surfaces only when
  there's nothing to show.
- Developed and tested against an Android emulator.

## With more time

- A "couldn't load more, tap to retry" footer state
- Product detail screen — the types already model the full response
- Unit tests for `getNextPageParam`, the debounce hook, and the card's
  loading / loaded / error variants
- Runtime response validation with zod in place of the current shape check
- Persist the React Query cache so the list is available on a cold start offline
- Dark mode — the theme file is already the single source for colours
