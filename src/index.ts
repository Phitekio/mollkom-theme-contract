/**
 * JSON-safe contract shared by Theme Studio, the published renderer, release
 * persistence, validators, and AI proposal producers.
 *
 * This package deliberately contains no React, Next.js, database, or editor UI
 * imports. Runtime services are injected by the experience plane.
 */

export const THEME_SCHEMA_VERSION = 1 as const;
export const THEME_RUNTIME_VERSION = '0.3.0' as const;
export const THEME_CERTIFICATION_VERSION = '2026-08-16.1' as const;
export const THEME_MAX_COMPONENTS = 100 as const;
export const THEME_MAX_DOCUMENT_BYTES = 524_288 as const;
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

export type ThemeCertificationSeverity = 'blocker' | 'warning';

export interface ThemeCertificationCheck {
  id:
    | 'document-shape'
    | 'component-allowlist'
    | 'semantic-main'
    | 'component-count'
    | 'component-ids'
    | 'document-size'
    | 'html-safety'
    | 'color-contrast';
  passed: boolean;
  severity: ThemeCertificationSeverity;
  message: string;
}

export interface ThemeCertificationReport {
  passed: boolean;
  certificationVersion: typeof THEME_CERTIFICATION_VERSION;
  schemaVersion: typeof THEME_SCHEMA_VERSION;
  pageType: ThemePageType;
  componentCount: number;
  documentBytes: number;
  checks: ThemeCertificationCheck[];
}

export interface ThemeAiProposal {
  summary: string;
  data: ThemeDocument;
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

function flattenThemeNodes(document: ThemeDocument): ThemeComponentNode[] {
  return [
    ...document.content,
    ...Object.values(document.zones ?? {}).flat(),
  ];
}

function countComponent(nodes: readonly ThemeComponentNode[], type: string): number {
  return nodes.reduce((count, node) => count + (node.type === type ? 1 : 0), 0);
}

function hasDangerousHtml(value: unknown): boolean {
  if (typeof value === 'string') {
    return /<\s*script\b|\bon[a-z]+\s*=|javascript\s*:/i.test(value);
  }
  if (Array.isArray(value)) return value.some(hasDangerousHtml);
  if (!value || typeof value !== 'object') return false;
  return Object.values(value as Record<string, unknown>).some(hasDangerousHtml);
}

function parseHexColor(value: unknown): [number, number, number] | null {
  if (typeof value !== 'string' || !/^#[0-9a-f]{6}$/i.test(value)) return null;
  return [
    Number.parseInt(value.slice(1, 3), 16),
    Number.parseInt(value.slice(3, 5), 16),
    Number.parseInt(value.slice(5, 7), 16),
  ];
}

function relativeLuminance(color: [number, number, number]): number {
  const channels = color.map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return (channels[0] ?? 0) * 0.2126
    + (channels[1] ?? 0) * 0.7152
    + (channels[2] ?? 0) * 0.0722;
}

function colorContrast(foreground: unknown, background: unknown): number | null {
  const foregroundRgb = parseHexColor(foreground);
  const backgroundRgb = parseHexColor(background);
  if (!foregroundRgb || !backgroundRgb) return null;
  const lighter = Math.max(relativeLuminance(foregroundRgb), relativeLuminance(backgroundRgb));
  const darker = Math.min(relativeLuminance(foregroundRgb), relativeLuminance(backgroundRgb));
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Deterministic, framework-neutral pre-publish gate. It intentionally checks
 * only properties that can be proven from the JSON document. Visual, browser,
 * and performance certification remain separate release-pipeline gates.
 */
export function certifyThemeDocument(
  pageType: ThemePageType,
  value: unknown,
): ThemeCertificationReport {
  const validDocument = isThemeDocument(value);
  const document = validDocument ? value : { root: {}, content: [], zones: {} };
  const nodes = flattenThemeNodes(document);
  const allowed = new Set<string>(THEME_PAGE_COMPONENTS[pageType]);
  const disallowed = [...new Set(nodes.map((node) => node.type).filter((type) => !allowed.has(type)))];
  const requiredMain = THEME_REQUIRED_MAIN_COMPONENT[pageType];
  const mainCount = requiredMain ? countComponent(nodes, requiredMain) : 0;
  const ids = nodes
    .map((node) => node.props.id)
    .filter((id): id is string => typeof id === 'string' && id.length > 0);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  let documentBytes = THEME_MAX_DOCUMENT_BYTES + 1;
  try {
    documentBytes = new TextEncoder().encode(JSON.stringify(value)).byteLength;
  } catch {
    // Non-JSON-safe documents fail the size/shape checks below.
  }
  const dangerousHtmlNodes = nodes
    .filter((node) => node.type === 'CustomHTML' && hasDangerousHtml(node.props));
  const rootProps = document.root.props ?? {};
  const contrast = colorContrast(rootProps.textColor, rootProps.backgroundColor);

  const checks: ThemeCertificationCheck[] = [
    {
      id: 'document-shape',
      passed: validDocument,
      severity: 'blocker',
      message: validDocument ? 'Theme document shape is valid.' : 'Theme document shape is invalid.',
    },
    {
      id: 'component-allowlist',
      passed: disallowed.length === 0,
      severity: 'blocker',
      message: disallowed.length === 0
        ? 'All components are allowed for this page.'
        : `Disallowed components: ${disallowed.join(', ')}.`,
    },
    {
      id: 'semantic-main',
      passed: requiredMain === null || mainCount === 1,
      severity: 'blocker',
      message: requiredMain === null
        ? 'This page has no required commerce kernel.'
        : `${requiredMain} count is ${mainCount}; exactly one is required.`,
    },
    {
      id: 'component-count',
      passed: nodes.length <= THEME_MAX_COMPONENTS,
      severity: 'blocker',
      message: `${nodes.length}/${THEME_MAX_COMPONENTS} components.`,
    },
    {
      id: 'component-ids',
      passed: ids.length === nodes.length && duplicateIds.length === 0,
      severity: 'blocker',
      message: duplicateIds.length > 0
        ? `Duplicate component ids: ${duplicateIds.join(', ')}.`
        : ids.length === nodes.length
          ? 'Every component has a unique id.'
          : 'Every component must have an id.',
    },
    {
      id: 'document-size',
      passed: documentBytes <= THEME_MAX_DOCUMENT_BYTES,
      severity: 'blocker',
      message: `${documentBytes}/${THEME_MAX_DOCUMENT_BYTES} bytes.`,
    },
    {
      id: 'html-safety',
      passed: dangerousHtmlNodes.length === 0,
      severity: 'blocker',
      message: dangerousHtmlNodes.length === 0
        ? 'Custom HTML contains no executable markup.'
        : 'Custom HTML contains executable or event-handler markup.',
    },
    {
      id: 'color-contrast',
      passed: contrast === null || contrast >= 4.5,
      severity: 'blocker',
      message: contrast === null
        ? 'Root contrast is not applicable.'
        : `Root text contrast is ${contrast.toFixed(2)}:1.`,
    },
  ];

  return {
    passed: checks.every((check) => check.severity !== 'blocker' || check.passed),
    certificationVersion: THEME_CERTIFICATION_VERSION,
    schemaVersion: THEME_SCHEMA_VERSION,
    pageType,
    componentCount: nodes.length,
    documentBytes,
    checks,
  };
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
