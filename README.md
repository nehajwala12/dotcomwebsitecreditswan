# CreditSwan — marketing site

Static site. No build step, no dependencies.

```
index.html      the page
styles.css      all styles (responsive, mobile-first breakpoints at 560/840/900px)
fonts/          self-hosted woff2 (Cormorant Garamond, Manrope, IBM Plex Mono)
assets/         case-study images (compressed)
icon.svg        favicon · apple-touch-icon.png · og-creditswan.png
vercel.json     cache headers for fonts/assets
robots.txt · sitemap.xml
```

## Deploy on Vercel

1. Push this folder to a GitHub repo (files at the repo root).
2. In Vercel: **Add New → Project**, import the repo.
3. Framework preset: **Other**. No build command, no output directory. Deploy.

Any change pushed to `main` redeploys automatically.

## Notes

- Contact forms POST to Formspree (`https://formspree.io/f/xvzevprl`) via fetch, with a native-POST fallback if JS is disabled.
- Fonts are self-hosted and preloaded; images are lazy-loaded.
- The domain in the meta tags/canonical is `www.creditswan.ai` — update if deploying elsewhere.
