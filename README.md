# Kez Media
Developed by KEZ DEV Productions

A personal social media web app, connected to Firebase (Auth, Firestore, Storage).

## Project structure

```
kezz-media-main/
├── assets/
│   ├── logo/
│   │   └── kez-dev-logo.png     # KEZ DEV Productions intro logo
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── css/
│   ├── main.css                 # main stylesheet (was styles.css)
│   └── patches.css              # feature patches (was features_patch.css)
├── js/
│   ├── app.js                   # main app logic
│   └── patches.js               # feature patches (was features_patch.js)
├── config/
│   └── firebase.js              # Firebase project config (apiKey, projectId, etc.)
├── manifest.json                # PWA manifest
├── sw.js                        # service worker (offline caching)
├── index.html                   # entry point
└── README.md
```

## Load order (index.html)

1. Firebase SDK scripts (from gstatic CDN)
2. `css/main.css`, `css/patches.css`
3. `config/firebase.js` — must load **before** `js/app.js`
4. `js/app.js`
5. `js/patches.js`

## Mixed media posts (photo + video, any order)

The **Photo/Video** composer tab now accepts *any mix* of images and videos in a
single post — e.g. photo, video, photo, photo — in whatever order they're added.

- Storage: still Cloudinary (images → `image/upload`, videos → `video/upload`),
  same `kez-media/posts/{uid}/...` folder convention as before.
- Data shape: each post gets a `media: [{type:'image'|'video', url}]` array that
  preserves upload order. `images` (image URLs only) and `image` (first image)
  are still populated for backward compatibility with older code paths
  (search results, DM previews, notifications, etc. that only ever expected photos).
- Feed, profile grid, and the full lightbox all render `media` directly: photo
  slides are tappable images, video slides are native `<video controls>`.
- Old posts (pre-dating this feature) are untouched and keep rendering exactly
  as before — this is additive, not a data migration.
- Known limitation: the **Edit Post** modal can currently reorder/remove
  *images* in a mixed post, but not videos — removing/reordering video items
  isn't wired up yet.

## Admin dashboard

The admin dashboard (separate repo) is media-aware: it shows a "🧩 Mixed"
badge with photo/video counts, has a dedicated 🎬 Videos filter, and its
Storage Browser indexes and lets you preview every photo *and* video across
all posts (previously videos weren't indexed there at all).

## Intro animation

On load, a black `KEZ DEV Productions` intro plays for ~2.3s (logo fade-in → glow →
zoom → tagline → fade out), then reveals the existing pink Kez Media splash screen,
which continues on its own independent timer. The intro is purely visual and does
not block or delay Firebase/auth logic.

## Deployment

Deployed via **Cloudflare Pages**, connected to this GitHub repo.
- Framework preset: None
- Build command: (empty)
- Output directory: `/` (root)

Remember: after deploying, add your Cloudflare Pages domain (e.g. `kezmedia.pages.dev`)
to **Firebase Console → Authentication → Settings → Authorized domains**, or
Google Sign-In will fail on the live site.
