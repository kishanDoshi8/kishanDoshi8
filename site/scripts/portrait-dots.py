import sys, json
from PIL import Image, ImageDraw, ImageOps, ImageFilter
base = sys.argv[1]
COLS, ROWS = 48, 60
CROPS = {'1': (75, 90, 555, 690), '2': (29, 40, 735, 922)}
out = {}
for n in ['1', '2']:
    im = Image.open(f'{base}/cut{n}.png').convert('RGBA').crop(CROPS[n])
    alpha = im.split()[3]
    g = ImageOps.grayscale(im.convert('RGB'))
    m = alpha.point(lambda a: 255 if a > 128 else 0)
    hist = sorted(px for px, mm in zip(g.getdata(), m.getdata()) if mm)
    lo, hi = hist[len(hist) // 20], hist[len(hist) * 19 // 20]
    g = g.point(lambda px: max(0, min(255, (px - lo) * 255 // max(1, hi - lo))))
    g = g.filter(ImageFilter.UnsharpMask(30, 50 if n == '1' else 20, 0)).filter(ImageFilter.UnsharpMask(4, 120))
    gs = g.resize((COLS, ROWS), Image.LANCZOS)
    a = alpha.resize((COLS, ROWS), Image.LANCZOS)
    hsv = im.convert('RGB').convert('HSV').resize((COLS, ROWS), Image.LANCZOS)
    vals = []
    for y in range(ROWS):
        for x in range(COLS):
            am = a.getpixel((x, y)) / 255
            floor, gamma = {'1': (0.10, 1.8), '2': (0.22, 1.2)}[n]
            v = (floor + (1 - floor) * (gs.getpixel((x, y)) / 255) ** gamma) * am
            q = 0 if am < 0.35 else max(1, round(v * 5))  # 0..5 levels, like an LED panel
            h, sat, val = hsv.getpixel((x, y))
            red = n == '1' and y >= 46 and am >= 0.35 and sat > 150 and h > 215  # the pink kurta
            vals.append(max(q, 3) + 10 if red else q)
    out[n] = ''.join(str(v) if v < 10 else 'abcdef'[v - 10] for v in vals)
    S = 12
    prev = Image.new('RGB', (COLS * S, ROWS * S), 'black')
    d = ImageDraw.Draw(prev)
    for i, q in enumerate(vals):
        x, y = i % COLS, i // COLS
        red = q >= 10; q = q % 10
        r = [0.9, 1.5, 2.2, 3.0, 3.9, 4.8][q]
        c = [40, 90, 140, 190, 230, 255][q]
        d.ellipse((x * S + 6 - r, y * S + 6 - r, x * S + 6 + r, y * S + 6 + r), fill=(c, 30, 40) if red else (c, c, c))
    prev.save(f'{base}/prev{n}.png')
json.dump({'cols': COLS, 'rows': ROWS, 'a': out['1'], 'b': out['2']}, open(f'{base}/portrait.json', 'w'))
