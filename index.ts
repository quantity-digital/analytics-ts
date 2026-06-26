// Extend the Window interface to include the dataLayer property
declare global {
  interface Window {
    dataLayer?: Record<string, any>[];
    analytics?: any;
  }
}

type BaseEcommerceEvent = {
  /** Example: USD, DKK */
  currency: string;
  /** Example: 100.00 */
  value: number;
  /**
   * The items for the event
   */
  items: Item[];
};

type Item = {
  /** Example: '123' */
  item_id: string;
  /** Example: 'T-Shirt' */
  item_name: string;
  /** Example: 'Google Store' */
  affiliation?: string;
  /** Example: 'SUMMER_FUN' */
  coupon?: string;
  /** Example: 100.00 */
  discount?: number;
  /** Example: 'Google' */
  item_brand?: string;
  /** Example: 'Apparel' */
  item_category?: string;
  /** Example: 'Adult' */
  item_category2?: string;
  /** Example: 'Shirts' */
  item_category3?: string;
  /** Example: 'Crew' */
  item_category4?: string;
  /** Example: 'Short sleeve' */
  item_category5?: string;
  /** The ID of the list in which the item was presented to the user
   * Example: 'related_products'
   */
  item_list_id?: string;
  /** The name of the list in which the item was presented to the user
   * Example: 'related_products'
   */
  item_list_name?: string;
  /**
   * The item variant or unique code or description for additional item details/options.
   * Example: 'green'
   */
  item_variant?: string;

  /**
   * The physical location associated with the item (e.g. the physical store location). It's recommended to use the Google Place ID that corresponds to the associated item. A custom location ID can also be used.
   * Note: `location id` is only available at the item-scope.
   * Example: 'ChIJIQBpAG2ahYAR_6128GcTUEo (the Google Place ID for San Francisco)'
   */
  location_id?: string;
  /**
   * The monetary price of the item, in units of the specified currency parameter.
   * Example: 100.00
   */
  price: number;
  /**
   * Item quantity.
   * Example: 2
   */
  quantity: number;
};

const getDataLayer = (debug = false): { push: (x: any) => void } => {
  // Debug mode
  if (debug) {
    return {
      push: (x: any) => console.log(JSON.stringify(x, null, 4)),
    };
  }

  window.dataLayer = window.dataLayer || [];

  return window.dataLayer;
};

const clearEcommerceData = () => {
  getDataLayer().push({ ecommerce: null });
};

type Purchase = BaseEcommerceEvent & {
  /**
   * The unique identifier of a transaction.
   *
   * The transaction_id parameter helps you avoid getting duplicate events for a purchase.
   * Example: 'T_12345'
   */
  transaction_id: string;
  /** Example: 100.00 */
  shipping?: number;
  /** Example: 100.00 */
  tax?: number;
  /**
   * The coupon name/code associated with the event.
   *
   * Event-level and item-level coupon parameters are independent.
   *
   * Example: SUMMER_FUN
   */
  coupon?: string;
};

type AddToCart = BaseEcommerceEvent & {};
type RemoveFromCart = BaseEcommerceEvent & {};
type ViewCart = BaseEcommerceEvent & {};
type ViewItem = BaseEcommerceEvent & {};
type AddToWishlist = BaseEcommerceEvent & {};

type BeginCheckout = BaseEcommerceEvent & {
  /** Example: 'SUMMER_FUN' */
  coupon?: string;
};

type AddPaymentInfo = BaseEcommerceEvent & {
  /** Example: 'SUMMER_FUN' */
  coupon?: string;
  /**
   * The chosen method of payment
   * Example: 'Visa'
   */
  payment_type?: string;
};

type AddShippingInfo = BaseEcommerceEvent & {
  /** Example: 'SUMMER_FUN' */
  coupon?: string;
  /**
   * The shipping tier (e.g. Ground, Air, Next-day) selected for delivery of the purchased item.
   * Example: 'Ground'
   */
  shipping_tier?: string;
};

type ViewItemList = BaseEcommerceEvent & {
  /**
   * The ID of the list in which the item was presented to the user.
   *
   * Ignored if set at the item-level.
   *
   * Example: 'related_products'
   */
  item_list_id?: string;
  /**
   * The name of the list in which the item was presented to the user.
   *
   * Ignored if set at the item-level.
   *
   * Example: 'Related products'
   */
  item_list_name?: string;
};

const trackEcomEvent = <T extends BaseEcommerceEvent>(
  event: string,
  ecommerce: T,
) => {
  clearEcommerceData();
  getDataLayer().push({
    event,
    ecommerce,
  });
};

type Search = {
  /**
   * The term that was searched for
   * Example: 't-shirts'
   */
  search_term: string;
};

const trackSearch = (data: Search) => {
  getDataLayer().push({
    event: "search",
    ...data,
  });
};

type Share = {
  /**
   * The method in which the content is shared
   * Example: Twitter
   */
  method?: string;
  /**
   * The type of shared content
   * Example: image
   */
  content_type?: string;
  /**
   * The ID of the shared content.
   * Example: C_12345
   */
  content_id?: string;
};

const trackShare = (data: Share) => {
  getDataLayer().push({
    event: "share",
    ...data,
  });
};

type SignUp = {
  /**
   * The method used for sign up.
   * Example: Google
   */
  method?: string;
};

const trackSignup = (data: SignUp) => {
  getDataLayer().push({
    event: "sign_up",
    ...data,
  });
};

/**
 * Initialize the analytics object
 * Should be run once at each page load
 */
const init = () => {
  // Attach the analytics object to the window
  if (typeof window !== "undefined") {
    window.analytics = analytics;
  }
};

export const analytics = {
  init,
  track: {
    purchase: (data: Purchase) => trackEcomEvent("purchase", data),
    addToCart: (data: AddToCart) => trackEcomEvent("add_to_cart", data),
    addPaymentInfo: (data: AddPaymentInfo) =>
      trackEcomEvent("add_payment_info", data),
    viewCart: (data: ViewCart) => trackEcomEvent("view_cart", data),
    viewItem: (data: ViewItem) => trackEcomEvent("view_item", data),
    viewItemList: (data: ViewItemList) =>
      trackEcomEvent("view_item_list", data),
    addShippingInfo: (data: AddShippingInfo) =>
      trackEcomEvent("add_shipping_info", data),
    removeFromCart: (data: RemoveFromCart) =>
      trackEcomEvent("remove_from_cart", data),
    addToWishlist: (data: AddToWishlist) =>
      trackEcomEvent("add_to_wishlist", data),
    beginCheckout: (data: BeginCheckout) =>
      trackEcomEvent("begin_checkout", data),
    search: trackSearch,
    share: trackShare,
    signUp: trackSignup,
  },
};

analytics.init();
