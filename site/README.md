# kishandoshi.me

My personal site: a single static page built with React, Vite, Tailwind CSS v4
and Motion. It has no backend, cookies or analytics.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks, then writes static files to dist/
npm run preview   # serves dist/ locally
```

## Where things live

| Path | What |
| --- | --- |
| `src/content.ts` | Every piece of copy on the page. Edit text here. |
| `src/App.tsx` | Page layout and sections |
| `src/components/DotPortrait.tsx` | The dot-matrix portrait (canvas). Hover or tap to swap frames. |
| `src/components/LightsOut.tsx` | The 5x5 lights-out puzzle |
| `src/components/Pizza.tsx` | The pizza you can eat one slice at a time |
| `src/data/portrait.ts` | Generated dot data for the portrait |
| `src/index.css` | Theme tokens: colours, fonts, radius |
| `scripts/portrait-dots.py` | Turns two cut-out photos into `portrait.ts` data |

### Design rules

- Black background, grey tiles and white type, like a phone screen at night.
  The only colour is the red from the kurta in the portrait. It means "live" or "this is me".
- Everything is built from dots: the portrait, the puzzle, the pizza, link underlines and the Doto display face.
- Only one thing moves on its own: the portrait boots up on load. Everything
  else moves because the visitor did something. All motion respects
  `prefers-reduced-motion`.
- Fonts are self-hosted (`@fontsource`), so the page makes no third-party requests.

### Regenerating the portrait

The photos themselves aren't committed. To change the portrait, cut out the
backgrounds first (for example with `pip install rembg`), save them as
`cut1.png` (resting) and `cut2.png` (smiling), then run:

```bash
python3 scripts/portrait-dots.py path/to/folder-with-cutouts
```

This writes `portrait.json` and preview PNGs into that folder. Copy the JSON
into `src/data/portrait.ts`. The crop boxes at the top of the script line up
the two faces.

## Deploy to the droplet

Build locally, then copy `dist/` to the server:

```bash
npm run build
```

```bash
rsync -avz --delete dist/ user@your-droplet:/var/www/kishandoshi.me/
```

nginx server block (TLS from `certbot --nginx -d kishandoshi.me -d www.kishandoshi.me`):

```nginx
server {
    server_name kishandoshi.me www.kishandoshi.me;
    root /var/www/kishandoshi.me;
    index index.html;

    # Hashed build assets never change; cache them for a year.
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    # Always revalidate the page itself so a new deploy shows up immediately.
    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
}
```
