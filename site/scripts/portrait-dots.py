"""Turn a cut-out selfie into the dot data in src/data/portrait.ts.

Usage: python3 scripts/portrait-dots.py <folder>
<folder> must hold cut.png, a photo with its background removed (e.g. with rembg).
Writes portrait.json (copy it into src/data/portrait.ts) and preview PNGs there.
"""
import sys, json
from PIL import Image, ImageDraw, ImageOps, ImageFilter

base = sys.argv[1]
COLS, ROWS = 48, 60
CROP = (75, 90, 555, 690)  # head and shoulders, same aspect as COLS:ROWS

# The wink: dot edits over the lit eye (viewer's left), as (x, y, level).
# The eye's dark band becomes skin, with a thin closed lid drawn across it.
WINK = [(x, y, 5) for y in range(24, 28) for x in range(12, 21)] + [
    (12, 25, 1), (13, 26, 0), (14, 26, 0), (15, 26, 0), (16, 26, 0), (17, 26, 0), (18, 26, 0), (19, 26, 0), (20, 25, 1),
]

im = Image.open(f'{base}/cut.png').convert('RGBA').crop(CROP)
alpha = im.split()[3]
g = ImageOps.grayscale(im.convert('RGB'))
m = alpha.point(lambda a: 255 if a > 128 else 0)
hist = sorted(px for px, mm in zip(g.getdata(), m.getdata()) if mm)
lo, hi = hist[len(hist) // 20], hist[len(hist) * 19 // 20]
g = g.point(lambda px: max(0, min(255, (px - lo) * 255 // max(1, hi - lo))))
g = g.filter(ImageFilter.UnsharpMask(30, 50, 0)).filter(ImageFilter.UnsharpMask(4, 120))
gs = g.resize((COLS, ROWS), Image.LANCZOS)
a = alpha.resize((COLS, ROWS), Image.LANCZOS)
hsv = im.convert('RGB').convert('HSV').resize((COLS, ROWS), Image.LANCZOS)

vals = []
for y in range(ROWS):
    for x in range(COLS):
        am = a.getpixel((x, y)) / 255
        v = (0.10 + 0.90 * (gs.getpixel((x, y)) / 255) ** 1.8) * am
        q = 0 if am < 0.35 else max(1, round(v * 5))  # 0..5 levels, like an LED panel
        h, sat, val = hsv.getpixel((x, y))
        red = y >= 46 and am >= 0.35 and sat > 150 and h > 215  # the pink kurta
        vals.append(max(q, 3) + 10 if red else q)

wink = vals[:]
for x, y, v in WINK:
    wink[y * COLS + x] = v


def encode(vs):
    return ''.join(str(v) if v < 10 else 'abcdef'[v - 10] for v in vs)


def preview(vs, name):
    S = 12
    img = Image.new('RGB', (COLS * S, ROWS * S), 'black')
    d = ImageDraw.Draw(img)
    for i, q in enumerate(vs):
        x, y = i % COLS, i // COLS
        red = q >= 10
        q = q % 10
        r = [0.9, 1.5, 2.2, 3.0, 3.9, 4.8][q]
        c = [40, 90, 140, 190, 230, 255][q]
        d.ellipse((x * S + 6 - r, y * S + 6 - r, x * S + 6 + r, y * S + 6 + r), fill=(c, 30, 40) if red else (c, c, c))
    img.save(f'{base}/{name}.png')


preview(vals, 'preview')
preview(wink, 'preview-wink')
json.dump({'cols': COLS, 'rows': ROWS, 'face': encode(vals), 'wink': encode(wink)}, open(f'{base}/portrait.json', 'w'))
