/**
 * JSON-safe contract shared by Theme Studio, the published renderer, release
 * persistence, validators, and AI proposal producers.
 *
 * This package deliberately contains no React, Next.js, database, or editor UI
 * imports. Runtime services are injected by the experience plane.
 */
export declare const THEME_SCHEMA_VERSION: 1;
export declare const THEME_RUNTIME_VERSION: "0.2.0";
export declare const THEME_STUDIO_PROTOCOL_VERSION: 1;
export declare const STOREFRONT_EDITOR_BRIDGE_CHANNEL: "mollkom-storefront-editor-v1";
export declare const THEME_PAGE_TYPES: readonly ["index", "product", "collection", "cart", "page"];
export type ThemePageType = (typeof THEME_PAGE_TYPES)[number];
export declare const THEME_COMPONENT_IDS: readonly ["MainProduct", "MainCollection", "MainCart", "HeroBanner", "AnnouncementBar", "FeaturedCategories", "ProductGrid", "TrustBadges", "Newsletter", "RichText", "ImageWithText", "Separator", "ProductCarousel", "Testimonials", "FAQ", "CountdownTimer", "MultiColumn", "VideoEmbed", "LogoCloud", "BannerStrip", "CustomHTML", "ProductGallery", "ProductBuyBox", "ProductDescription", "ProductReviews", "RelatedProducts", "ProductQuestions", "CollectionBanner", "CollectionGrid", "SubcategoryNav", "PageContent", "StoreHeader", "StoreFooter", "ProductSpecifications", "ShippingReturnsInfo", "CartSummary", "CartItems", "CartUpsells", "CouponBox", "ShippingEstimate", "ContactForm", "PolicyContent", "RecentlyViewed"];
export type ThemeComponentId = (typeof THEME_COMPONENT_IDS)[number];
export declare const THEME_REQUIRED_MAIN_COMPONENT: {
    readonly index: null;
    readonly product: "MainProduct";
    readonly collection: "MainCollection";
    readonly cart: "MainCart";
    readonly page: null;
};
export declare const THEME_PAGE_COMPONENTS: {
    readonly index: readonly ["HeroBanner", "AnnouncementBar", "RichText", "ImageWithText", "Separator", "ProductGrid", "FeaturedCategories", "ProductCarousel", "TrustBadges", "Newsletter", "Testimonials", "FAQ", "CountdownTimer", "MultiColumn", "VideoEmbed", "LogoCloud", "BannerStrip", "CustomHTML", "RecentlyViewed"];
    readonly product: readonly ["MainProduct", "RelatedProducts", "RichText", "ImageWithText", "Separator", "FAQ", "TrustBadges", "Newsletter", "Testimonials", "VideoEmbed", "CustomHTML", "BannerStrip", "RecentlyViewed"];
    readonly collection: readonly ["MainCollection", "CollectionBanner", "SubcategoryNav", "ProductCarousel", "RichText", "ImageWithText", "Separator", "FAQ", "TrustBadges", "Newsletter", "BannerStrip", "CustomHTML", "RecentlyViewed"];
    readonly cart: readonly ["MainCart", "RichText", "TrustBadges", "Newsletter", "FAQ", "ImageWithText", "BannerStrip", "ProductGrid", "ProductCarousel", "Testimonials", "CartUpsells", "CouponBox", "ShippingEstimate"];
    readonly page: readonly ["PageContent", "RichText", "ImageWithText", "Separator", "FAQ", "MultiColumn", "VideoEmbed", "BannerStrip", "CustomHTML", "TrustBadges", "Newsletter", "Testimonials", "LogoCloud", "ContactForm", "PolicyContent"];
};
export interface ThemeComponentNode {
    type: ThemeComponentId | string;
    props: Record<string, unknown>;
}
export interface ThemeDocument {
    root: {
        props?: Record<string, unknown>;
    };
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
export type ThemeStudioToHostMessage = StudioMessageBase & ({
    type: 'READY';
} | {
    type: 'DIRTY_CHANGED';
    dirty: boolean;
} | {
    type: 'SELECTION_CHANGED';
    componentId?: string;
} | {
    type: 'HISTORY_CHANGED';
    canUndo: boolean;
    canRedo: boolean;
} | {
    type: 'SAVE_RESULT';
    ok: boolean;
    revision?: number;
    errorCode?: string;
} | {
    type: 'PUBLISH_RESULT';
    ok: boolean;
    releaseId?: string;
    errorCode?: string;
} | {
    type: 'FATAL_ERROR';
    errorCode: string;
});
export type ThemeHostToStudioMessage = StudioMessageBase & ({
    type: 'SAVE';
} | {
    type: 'PUBLISH';
} | {
    type: 'UNDO';
} | {
    type: 'REDO';
} | {
    type: 'SET_PAGE';
    pageType: ThemePageType;
    pageId?: string;
} | {
    type: 'SET_LOCALE';
    locale: string;
} | {
    type: 'SET_VIEWPORT';
    viewport: 'desktop' | 'tablet' | 'mobile';
} | {
    type: 'FOCUS_SECTION';
    componentId: string;
});
export type StorefrontEditorHostMessage<TData extends ThemeDocument = ThemeDocument> = {
    channel: typeof STOREFRONT_EDITOR_BRIDGE_CHANNEL;
    sessionId: string;
} & ({
    type: 'sync';
    data: TData;
    selectedId: string | null;
} | {
    type: 'focus';
    selectedId: string | null;
} | {
    type: 'media-result';
    requestId: string;
    url: string | null;
} | {
    type: 'studio-token';
    expires: string;
    signature: string;
});
export type StorefrontEditorStudioMessage<TData extends ThemeDocument = ThemeDocument> = {
    channel: typeof STOREFRONT_EDITOR_BRIDGE_CHANNEL;
    sessionId: string;
} & ({
    type: 'ready';
} | {
    type: 'select';
    sectionId: string;
} | {
    type: 'change';
    data: TData;
} | {
    type: 'media-request';
    requestId: string;
});
export declare function isThemePageType(value: string): value is ThemePageType;
export declare function isThemeComponentId(value: string): value is ThemeComponentId;
export declare function isThemeDocument(value: unknown): value is ThemeDocument;
export declare function isStorefrontEditorHostMessage(value: unknown, sessionId: string): value is StorefrontEditorHostMessage;
export declare function isStorefrontEditorStudioMessage(value: unknown, sessionId: string): value is StorefrontEditorStudioMessage;
export {};
//# sourceMappingURL=index.d.ts.map