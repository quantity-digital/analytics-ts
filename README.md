# @quantity-digital/analytics-ts

A small TypeScript wrapper for sending GA4-style events to the browser's
`window.dataLayer`.

## Installation

```sh
npm install @quantity-digital/analytics-ts
```

## Usage

```ts
import { analytics } from "@quantity-digital/analytics-ts";

analytics.track.addToCart({
  currency: "DKK",
  value: 299,
  items: [
    {
      item_id: "sku-123",
      item_name: "T-Shirt",
      price: 299,
      quantity: 1,
    },
  ],
});
```

The package attaches the analytics API to `window.analytics` when it is imported
in a browser. It initializes `window.dataLayer` when an event is tracked. The
package can be imported during server-side rendering, but tracking methods must
only be called in a browser.

## Releasing

Releases use conventional commits and are published from version tags by
GitHub Actions. See [PUBLISHING.md](PUBLISHING.md) for the one-time npm setup
and release procedure.

## License

MIT
