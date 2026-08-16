/**
 * JSON-safe contract shared by Theme Studio, the published renderer, release
 * persistence, validators, and AI proposal producers.
 *
 * This package deliberately contains no React, Next.js, database, or editor UI
 * imports. Runtime services are injected by the experience plane.
 */

export const THEME_SCHEMA_VERSION = 1 as const;
export const THEME_RUNTIME_VERSION = '0.2.0' as const;
export const THEME_STUDIO_PROTOCOL_VERSION = 1 as const;
export const STOREFRONT_EDITOR_BRIDGE_CHANNEL = 'mollkom-storefront-editor-v1' as const;

export const THEME_PAGE_TYPES = [
  'index',
  'product',
  'collection',
  'cart',
  'page',
] as const;

export type ThemePageType = (typeof THEME_PAGE_TYPES)[number];

export const THEME_COMPONENT_IDS = [
  'MainProduct',
  'MainCollection',
  'MainCart',
  'HeroBanner',
  'AnnouncementBar',
  'FeaturedCategories',
  'ProductGrid',
  'TrustBadges',
  'Newsletter',
  'RichText',
  'ImageWithText',
  'Separator',
  'ProductCarousel',
  'Testimonials',
  'FAQ',
  'CountdownTimer',
  'MultiColumn',
  'VideoEmbed',
  'LogoCloud',
  'BannerStrip',
  'CustomHTML',
  'ProductGallery',
  'ProductBuyBox',
  'ProductDescription',
  'ProductReviews',
  'RelatedProducts',
  'ProductQuestions',
  'CollectionBanner',
  'CollectionGrid',
  'SubcategoryNav',
  'PageContent',
  'StoreHeader',
  'StoreFooter',
  'ProductSpecifications',
  'ShippingReturnsInfo',
  'CartSummary',
  'CartItems',
  'CartUpsells',
  'CouponBox',
  'ShippingEstimate',
  'ContactForm',
  'PolicyContent',
  'RecentlyViewed',
] as const;

export type ThemeComponentId = (typeof THEME_COMPONENT_IDS)[number];

export const THEME_REQUIRED_MAIN_COMPONENT = {
  index: null,
  product: 'MainProduct',
  collection: 'MainCollection',
  cart: 'MainCart',
  page: null,
} as const satisfies Record<ThemePageType, ThemeComponentId | null>;

export const THEME_PAGE_COMPONENTS = {
  index: [
    'HeroBanner', 'AnnouncementBar', 'RichText', 'ImageWithText', 'Separator',
    'ProductGrid', 'FeaturedCategories', 'ProductCarousel', 'TrustBadges',
    'Newsletter', 'Testimonials', 'FAQ', 'CountdownTimer', 'MultiColumn',
    'VideoEmbed', 'LogoCloud', 'BannerStrip', 'CustomHTML', 'RecentlyViewed',
  ],
  product: [
    'MainProduct', 'RelatedProducts', 'RichText', 'ImageWithText', 'Separator',
    'FAQ', 'TrustBadges', 'Newsletter', 'Testimonials', 'VideoEmbed',
    'CustomHTML', 'BannerStrip', 'RecentlyViewed',
  ],
  collection: [
    'MainCollection', 'CollectionBanner', 'SubcategoryNav', 'ProductCarousel',
    'RichText', 'ImageWithText', 'Separator', 'FAQ', 'TrustBadges',
    'Newsletter', 'BannerStrip', 'CustomHTML', 'RecentlyViewed',
  ],
  cart: [
    'MainCart', 'RichText', 'TrustBadges', 'Newsletter', 'FAQ', 'ImageWithText',
    'BannerStrip', 'ProductGrid', 'ProductCarousel', 'Testimonials',
    'CartUpsells', 'CouponBox', 'ShippingEstimate',
  ],
  page: [
    'PageContent', 'RichText', 'ImageWithText', 'Separator', 'FAQ',
    'MultiColumn', 'VideoEmbed', 'BannerStrip', 'CustomHTML', 'TrustBadges',
    'Newsletter', 'Testimonials', 'LogoCloud', 'ContactForm', 'PolicyContent',
  ],
} as const satisfies Record<ThemePageType, readonly ThemeComponentId[]>;

export interface ThemeComponentNode {
  type: ThemeComponentId | string;
  props: Record<string, unknown>;
}

export interface ThemeDocument {
  root: { props?: Record<string, unknown> };
  content: ThemeComponentNode[];
  zones?: Record<string, ThemeComponentNode[]>;
}

export interface ThemeRuntimeIdentity {
  schemaVersion: typeof THEME_SCHEMA_VERSION;
  runtimeVersion: string;
  themePackageVersion?: string;
  themePackageHash?: string;
}

export interface ThemeStudioSessionClaims {
  audience: 'mollkom-theme-studio';
  sessionId: string;
  storeId: string;
  userId: string;
  pageType: ThemePageType;
  pageId?: string;
  locale: string;
  permissions: readonly ('read' | 'save' | 'publish')[];
  nonce: string;
  issuedAt: number;
  expiresAt: number;
}

interface StudioMessageBase {
  protocolVersion: typeof THEME_STUDIO_PROTOCOL_VERSION;
  sessionId: string;
  requestId: string;
}

export type ThemeStudioToHostMessage = StudioMessageBase &
  (
    | { type: 'READY' }
    | { type: 'DIRTY_CHANGED'; dirty: boolean }
    | { type: 'SELECTION_CHANGED'; componentId?: string }
    | { type: 'HISTORY_CHANGED'; canUndo: boolean; canRedo: boolean }
    | { type: 'SAVE_RESULT'; ok: boolean; revision?: number; errorCode?: string }
    | { type: 'PUBLISH_RESULT'; ok: boolean; releaseId?: string; errorCode?: string }
    | { type: 'FATAL_ERROR'; errorCode: string }
  );

export type ThemeHostToStudioMessage = StudioMessageBase &
  (
    | { type: 'SAVE' }
    | { type: 'PUBLISH' }
    | { type: 'UNDO' }
    | { type: 'REDO' }
    | { type: 'SET_PAGE'; pageType: ThemePageType; pageId?: string }
    | { type: 'SET_LOCALE'; locale: string }
    | { type: 'SET_VIEWPORT'; viewport: 'desktop' | 'tablet' | 'mobile' }
    | { type: 'FOCUS_SECTION'; componentId: string }
  );

export type StorefrontEditorHostMessage<TData extends ThemeDocument = ThemeDocument> = {
  channel: typeof STOREFRONT_EDITOR_BRIDGE_CHANNEL;
  sessionId: string;
} & (
  | { type: 'sync'; data: TData; selectedId: string | null }
  | { type: 'focus'; selectedId: string | null }
  | { type: 'media-result'; requestId: string; url: string | null }
  | { type: 'studio-token'; expires: string; signature: string }
);

export type StorefrontEditorStudioMessage<TData extends ThemeDocument = ThemeDocument> = {
  channel: typeof STOREFRONT_EDITOR_BRIDGE_CHANNEL;
  sessionId: string;
} & (
  | { type: 'ready' }
  | { type: 'select'; sectionId: string }
  | { type: 'change'; data: TData }
  | { type: 'media-request'; requestId: string }
);

export function isThemePageType(value: string): value is ThemePageType {
  return (THEME_PAGE_TYPES as readonly string[]).includes(value);
}

export function isThemeComponentId(value: string): value is ThemeComponentId {
  return (THEME_COMPONENT_IDS as readonly string[]).includes(value);
}

export function isThemeDocument(value: unknown): value is ThemeDocument {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<ThemeDocument>;
  return !!data.root
    && typeof data.root === 'object'
    && Array.isArray(data.content)
    && data.content.every((node) => !!node
      && typeof node === 'object'
      && typeof node.type === 'string'
      && !!node.props
      && typeof node.props === 'object');
}

function hasBridgeEnvelope(
  value: unknown,
  sessionId: string,
): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  const message = value as Record<string, unknown>;
  return message.channel === STOREFRONT_EDITOR_BRIDGE_CHANNEL
    && message.sessionId === sessionId;
}

export function isStorefrontEditorHostMessage(
  value: unknown,
  sessionId: string,
): value is StorefrontEditorHostMessage {
  if (!hasBridgeEnvelope(value, sessionId)) return false;
  const type = value.type;
  if (type === 'studio-token') {
    return typeof value.expires === 'string'
      && /^\d{10,16}$/.test(value.expires)
      && typeof value.signature === 'string'
      && /^[a-f0-9]{32}$/i.test(value.signature);
  }
  if (type === 'media-result') {
    return typeof value.requestId === 'string'
      && value.requestId.length >= 16
      && value.requestId.length <= 100
      && (value.url === null || typeof value.url === 'string');
  }
  if (type === 'focus') {
    return value.selectedId === null || typeof value.selectedId === 'string';
  }
  return type === 'sync'
    && isThemeDocument(value.data)
    && (value.selectedId === null || typeof value.selectedId === 'string');
}

export function isStorefrontEditorStudioMessage(
  value: unknown,
  sessionId: string,
): value is StorefrontEditorStudioMessage {
  if (!hasBridgeEnvelope(value, sessionId)) return false;
  if (value.type === 'ready') return true;
  if (value.type === 'select') {
    return typeof value.sectionId === 'string' && value.sectionId.length > 0;
  }
  if (value.type === 'change') return isThemeDocument(value.data);
  return value.type === 'media-request'
    && typeof value.requestId === 'string'
    && value.requestId.length >= 16
    && value.requestId.length <= 100;
}
