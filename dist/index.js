/**
 * JSON-safe contract shared by Theme Studio, the published renderer, release
 * persistence, validators, and AI proposal producers.
 *
 * This package deliberately contains no React, Next.js, database, or editor UI
 * imports. Runtime services are injected by the experience plane.
 */
export const THEME_SCHEMA_VERSION = 1;
export const THEME_RUNTIME_VERSION = '0.2.0';
export const THEME_STUDIO_PROTOCOL_VERSION = 1;
export const STOREFRONT_EDITOR_BRIDGE_CHANNEL = 'mollkom-storefront-editor-v1';
export const THEME_PAGE_TYPES = [
    'index',
    'product',
    'collection',
    'cart',
    'page',
];
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
];
export const THEME_REQUIRED_MAIN_COMPONENT = {
    index: null,
    product: 'MainProduct',
    collection: 'MainCollection',
    cart: 'MainCart',
    page: null,
};
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
};
export function isThemePageType(value) {
    return THEME_PAGE_TYPES.includes(value);
}
export function isThemeComponentId(value) {
    return THEME_COMPONENT_IDS.includes(value);
}
export function isThemeDocument(value) {
    if (!value || typeof value !== 'object')
        return false;
    const data = value;
    return !!data.root
        && typeof data.root === 'object'
        && Array.isArray(data.content)
        && data.content.every((node) => !!node
            && typeof node === 'object'
            && typeof node.type === 'string'
            && !!node.props
            && typeof node.props === 'object');
}
function hasBridgeEnvelope(value, sessionId) {
    if (!value || typeof value !== 'object')
        return false;
    const message = value;
    return message.channel === STOREFRONT_EDITOR_BRIDGE_CHANNEL
        && message.sessionId === sessionId;
}
export function isStorefrontEditorHostMessage(value, sessionId) {
    if (!hasBridgeEnvelope(value, sessionId))
        return false;
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
export function isStorefrontEditorStudioMessage(value, sessionId) {
    if (!hasBridgeEnvelope(value, sessionId))
        return false;
    if (value.type === 'ready')
        return true;
    if (value.type === 'select') {
        return typeof value.sectionId === 'string' && value.sectionId.length > 0;
    }
    if (value.type === 'change')
        return isThemeDocument(value.data);
    return value.type === 'media-request'
        && typeof value.requestId === 'string'
        && value.requestId.length >= 16
        && value.requestId.length <= 100;
}
//# sourceMappingURL=index.js.map