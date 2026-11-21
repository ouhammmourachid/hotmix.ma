# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Moroccan women shopping for everyday clothing, almost always on a phone. Most arrive from Instagram, Facebook or TikTok ads and browse inside those apps' in-app browsers, often one-handed and in short sessions. Arabic is the first reading language (RTL); French and English are also offered. Most orders are cash on delivery.

## Product Purpose

hotmix.ma is the online store for Hotmix, a women's clothing brand built on elegant, minimalist, comfortable pieces. Success means a visitor who lands from an ad finds a piece she likes, picks a size and color, and places an order with as little friction and doubt as possible.

## Positioning

Affordable, value-led fashion that still looks elegant and minimal. Low prices and promotions (e.g. 20 DH / 50 DH offers) drive sales, so prices and deals must stay easy to spot, but the store should feel considered and trustworthy rather than like a discount bin.

## Operating Context

- Traffic is dominated by Meta in-app browsers on mobile (see PostHog project 681030).
- Checkout supports cash on delivery, plus bank transfer and card components; phone number and city are the key checkout fields.
- WhatsApp is a support channel (`src/config/store-config.ts`).
- Catalog, auth, orders, cart and wishlist are backed by PocketBase.

## Capabilities and Constraints

- Next.js 16 App Router, Tailwind 3, Radix primitives, Framer Motion, Lucide icons.
- Trilingual (ar default + RTL, fr, en) via `src/translations/*.json`; every layout must work in both directions.
- Installable PWA (manifest, service worker, apple-web-app meta).
- Features: collections, product listing with filters and grid toggle, product page with gallery/zoom/lightbox, quick-add, cart modal and page, wishlist, search, account and orders, checkout, informational pages (about, contact, FAQs, shipping, returns, privacy).

## Brand Commitments

- Name: Hotmix. Logo at `brand/hotmix-logo.svg` and `src/components/hotmix-logo.tsx`.
- The existing identity stays: deep teal (`#09282e` primary, `#004750` secondary), lime accent (`#86df0e`), pale mint text (`#d8e8dd`), Outfit typeface. Confirmed by the owner on 2026-11-20 when choosing to apply Apple design principles within the current brand rather than replacing it.
- Promotional flags in `brand/flags/` are real campaign assets.

## Evidence on Hand

- Hero banners in `public/` (16:9 and 9:16 variants).
- Product imagery comes from PocketBase.
- No testimonials, press, or review data exist in the repo; do not fabricate them.

## Product Principles

1. Mobile, one-handed, in-app first: every key action is reachable and legible on a small phone inside a social app's browser.
2. The clothes lead: product photography carries the sale; interface chrome recedes.
3. Price and deals are always clear: value is the reason to buy, so never hide it for the sake of minimalism.
4. Arabic RTL is the default reading direction, not an afterthought.
5. Remove doubt at checkout: fewer fields, clear totals, clear delivery and payment terms.

## Accessibility & Inclusion

Readable contrast on the dark teal ground, tap targets sized for one-handed use, motion that respects `prefers-reduced-motion`, and correct mirroring in RTL.
