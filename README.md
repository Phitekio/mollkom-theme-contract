# Mollkom Theme Contract

The framework-neutral source of truth shared by Mollkom Theme Studio, the
published storefront renderer, release persistence, validators, and AI theme
producers.

It contains no React, Next.js, database, or editor UI dependency. Theme data is
JSON-safe and commerce kernels (`MainProduct`, `MainCollection`, `MainCart`)
remain owned by the storefront runtime.

## Compatibility

- Schema: `1`
- Runtime: `0.2.0`
- Studio protocol: `1`

Consumers must pin an immutable release tag. A contract version is promoted
only after both the merchant editor and storefront certification suites pass.
