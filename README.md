# Mollkom Theme Contract

The framework-neutral source of truth shared by Mollkom Theme Studio, the
published storefront renderer, release persistence, validators, and AI theme
producers.

It contains no React, Next.js, database, or editor UI dependency. Theme data is
JSON-safe and commerce kernels (`MainProduct`, `MainCollection`, `MainCart`)
remain owned by the storefront runtime.

## Compatibility

- Schema: `1`
- Runtime: `0.3.0`
- Studio protocol: `1`

## Certification

`certifyThemeDocument(pageType, document)` is the deterministic pre-publish
gate used by the Mollkom merchant editor, server-side release RPC, and AI
proposal flow. It validates page/component compatibility, commerce kernels,
stable component IDs, payload limits, executable custom HTML, and root WCAG
contrast. Browser screenshots, accessibility scans, and performance budgets
remain release-pipeline gates because they require the real Storefront runtime.

Consumers must pin an immutable release tag. A contract version is promoted
only after both the merchant editor and storefront certification suites pass.
