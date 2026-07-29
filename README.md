# E-commerce Product Listing

A React Native app that lists products from the
[DummyJSON API](https://dummyjson.com/docs/products) with infinite scroll,
search, category filter and price sort, and opens each one on its own detail
screen.

React Native CLI (0.86) + TypeScript.

## Setup

Requires Node 22.11+ (see `engines` in `package.json`) and a working React
Native environment ([setup guide](https://reactnative.dev/docs/environment-setup))
— JDK 17 and Android Studio for Android, Xcode + CocoaPods for iOS.

```bash
npm install
npm run android
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

- Product detail screen — image gallery, full specification, reviews
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
  navigation/   the stack's param list
  screens/      ProductListScreen and ProductDetailScreen
  types/        API response types
  theme/        colours, spacing, radius
  utils/        price formatting
```

Split by responsibility, with one rule per layer:

- `api/` is the only place that knows URLs and query params
- `hooks/` is the only place that knows caching and pagination
- `components/` and `screens/` only know props and local UI state

This is the right shape for one feature. On a production app I'd go
feature-first instead — a `features/products/` folder owning its api, hooks,
components and screens together, so everything that changes when products
change sits in one place and a feature can be added or removed without touching
the rest of the tree. Genuinely shared pieces — the back button, the skeleton
primitive, the theme, the axios instance — would live in a `common/` or
`shared/` folder outside any feature. Splitting by layer the way this project
does starts to hurt once there are five features, because a single change then
touches five folders that each contain four features' worth of unrelated code.

Data flows one way. The screen holds what the user picked and passes it down as
a single `filters` object; that object is also the React Query cache key, so
changing search, category or sort produces a new cache entry and refetches on
its own — no manual refetch wiring, and revisiting a previous filter renders
instantly from cache.

Adding another filter is three small edits: a field on `ProductFilters`, its
translation to a query param in `api/products.ts`, and a control in the screen.

Navigation is a typed native stack. `RootStackParamList` declares what each
screen takes, so a mistyped screen name or a missing param fails to compile
rather than at the moment a user taps a card. Screens take ids rather than
objects, which keeps params serialisable and leaves each screen responsible for
its own data.

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
| `@react-navigation/native` | Navigation container and the hooks screens use to move between each other. |
| `@react-navigation/native-stack` | Push/pop stack that delegates to the platform's own navigation controllers, so transitions and the iOS back gesture are native rather than animated in JS. |
| `react-native-screens` | Hard peer dependency of native-stack — it is what exposes those native containers, and it detaches off-screen screens from the view hierarchy. |
| `react-native-safe-area-context` | Notch and status bar insets. |

Deliberately kept out:

- **No state management library.** React Query owns the server data; the only
  client state is search text, selected category and sort order — three
  `useState` calls in the screen.
- **No UI kit.** A theme file and `StyleSheet` are less overhead than a
  component library at this size.
- **No image caching library.** `react-native-fast-image` is barely maintained,
  so the built-in `Image` with load and error handling covers it.
- **Native stack over the JS one.** `@react-navigation/stack` would have pulled
  in gesture-handler and reanimated as well — two native dependencies instead of
  one, for animations driven from JS rather than by the platform.

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
- **The detail screen takes an id, not a product.** It fetches its own data, so
  it works the same however it is reached and always shows current stock rather
  than the list's snapshot. To keep the common path instant, tapping a card
  writes the product it already has into the query cache before navigating — the
  screen renders from cache immediately and revalidates in the background, and
  the loading state only appears when there is nothing cached. Passing an id
  also means the screen would be reachable from a deep link or a restored
  navigation state without change; wiring that up was out of scope.
- **Add to cart is presentational.** There is no cart in the assignment's scope,
  so the button reflects stock state — disabled and relabelled when a product is
  out of stock — but doesn't dispatch anything.
- **Emoji stand in for icons.** Adding an icon library for four glyphs wasn't
  worth the dependency; `react-native-svg` with a proper set is what I'd use in
  a real app, since emoji render differently across Android versions.

## With more time

**How you get to the detail screen**

The detail screen is built — gallery, specification, reviews — but reaching it
is a plain push. I'd make the transition part of the product.

Tapping a card would open a bottom sheet with the essentials first — image,
price, stock, a short description — so browsing stays uninterrupted and you can
flick it away and keep scrolling. Dragging past a threshold, or tapping through,
would grow the sheet into the full screen continuously: the image scaling up
into the header, the corner radius flattening out, the rest fading in. One
gesture, no jump cut.

That's Reanimated and Gesture Handler work — the sheet's position driven by a
shared value so the drag stays on the UI thread, a shared element transition for
the image between card and header, and the detail view's scroll position
interpolating the header as you read.

**A card worth looking at**

The grid works, but the card itself could do more selling. Bigger, better-framed
imagery, clearer price hierarchy, stock and delivery cues, tags like "bestseller"
where the data supports it — the kind of card that makes you want to tap it
rather than just read it.

**Responsive across devices**

Card width is already derived from the screen rather than hardcoded, so the grid
adapts from small phones to large ones. I'd take that further: column count
driven by available width instead of a fixed two, `useWindowDimensions` so the
layout responds to rotation and split-screen, and typography that scales with the
card rather than staying fixed — so a 5" phone and a tablet both get a grid that
looks designed for them.

**More motion**

Cards easing in as they enter the viewport, the price counting up when a sort
changes the order, chips animating their selection rather than snapping, press
feedback on cards. All Reanimated, all on the UI thread so none of it competes
with fetching and rendering.

**Rest**

- A "couldn't load more, tap to retry" footer state
- Unit tests for `getNextPageParam`, the debounce hook, and the card's
  loading / loaded / error variants
- Runtime response validation with zod in place of the current shape check
- Persist the React Query cache so the list is available on a cold start offline
- Dark mode — the theme file is already the single source for colours
