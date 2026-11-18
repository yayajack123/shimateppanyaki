#!/usr/bin/env python3
"""Generate responsive WebP photos, then atomically update the page references."""
import hashlib
import json
import re
import shutil
import struct
import subprocess
import tempfile
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / 'teppanyaki.html'
REPORT = ROOT / 'scripts/photo-report.json'
OUT = ROOT / 'assets/optimized'
SIZES = '(max-width: 600px) calc(100vw - 30px), (max-width: 767px) calc((100vw - 58px) / 2), (max-width: 991px) 284px, (max-width: 1199px) 241px, 297px'


class Images(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.images = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        if tag == 'img':
            self.images.append(dict(attrs))


def dimensions(path):
    data = path.read_bytes()
    if data.startswith(b'\x89PNG\r\n\x1a\n'):
        return struct.unpack('>II', data[16:24])
    if data.startswith(b'\xff\xd8'):
        pos = 2
        while pos < len(data):
            if data[pos] != 255:
                pos += 1
                continue
            while data[pos] == 255:
                pos += 1
            marker = data[pos]
            pos += 1
            if marker in (0xD8, 0xD9) or 0xD0 <= marker <= 0xD7:
                continue
            length = int.from_bytes(data[pos:pos + 2], 'big')
            if marker in (0xC0, 0xC1, 0xC2):
                height, width = struct.unpack('>HH', data[pos + 3:pos + 7])
                return width, height
            pos += length
    raise ValueError('Unsupported source image: ' + str(path))


def make_photo(source, widths, stage, hero=False):
    path = ROOT / source
    width, height = dimensions(path)
    variants = []
    for target in sorted({min(w, width) for w in widths}):
        limit = 180_000 if target <= 800 else 250_000
        for quality in (80, 76, 72):
            temporary = stage / 'encoding.webp'
            subprocess.run(['cwebp', '-quiet', '-q', str(quality), '-m', '6',
                            '-metadata', 'none', '-resize', str(target), '0',
                            str(path), '-o', str(temporary)], check=True)
            size = temporary.stat().st_size
            if size <= limit:
                break
        if size > limit:
            raise ValueError(f'{source} at {target}px exceeds {limit} bytes at quality 72')
        digest = hashlib.sha256(temporary.read_bytes()).hexdigest()[:16]
        filename = f'{path.stem}-{digest}-{target}.webp'
        temporary.rename(stage / filename)
        variants.append({'src': 'assets/optimized/' + filename, 'width': target,
                         'height': max(1, round(height * target / width)),
                         'bytes': size, 'quality': quality})
    default = min(variants, key=lambda v: abs(v['width'] - (1920 if hero else 800)))
    return {'source': source, 'width': width, 'height': height,
            'original_bytes': path.stat().st_size, 'variants': variants,
            'default': default['src'],
            'saving_percent_default': round(100 * (1 - default['bytes'] / path.stat().st_size), 2)}


def attribute(tag, name, value):
    pattern = r'\s+' + re.escape(name) + r'\s*=\s*([\x22\x27]).*?\1'
    tag = re.sub(pattern, '', tag, flags=re.S)
    return re.sub(r'\s*/?>$', lambda m: f' {name}="{value}">', tag)


def ignored_sources(sources, html):
    # Only executable web sources count; the report intentionally keeps masters.
    documents = [(PAGE, html)]
    for path in ROOT.rglob('*'):
        if any(part.startswith('.') for part in path.relative_to(ROOT).parts):
            continue
        if path != PAGE and path.suffix.lower() in ('.html', '.css', '.js'):
            documents.append((path, path.read_text(errors='replace')))
    unused = []
    for source in sources:
        basename = Path(source).name
        if not any(basename in text for _, text in documents):
            unused.append('/' + source)
    return sorted(unused)


def main():
    if not shutil.which('cwebp'):
        raise SystemExit('cwebp is required. Install libwebp before running this script.')
    text = PAGE.read_text()
    previous = json.loads(REPORT.read_text()) if REPORT.exists() else {'photos': []}
    reverse = {v['src']: p['source'] for p in previous['photos'] for v in p['variants']}
    sources = []
    for image in Images(text).images:
        src = image.get('src', '')
        source = reverse.get(src, src)
        if source.startswith('assets/generated-') or source == 'assets/menu-steak.jpg':
            sources.append(source)
    if not sources:
        raise SystemExit('No menu photo sources found; page was not modified.')
    hero_match = re.search(r"background:url\(['\x22]?(assets/[^'\x22)]+)", text)
    hero_source = previous.get('hero', {}).get('source') or (hero_match.group(1) if hero_match else None)
    if not hero_source:
        raise SystemExit('Hero source not found.')
    # All encodes must succeed before any page reference is changed.
    with tempfile.TemporaryDirectory(prefix='teppanyaki-webp-') as folder:
        stage = Path(folder)
        photos = [make_photo(source, (400, 800, 1200), stage) for source in sorted(set(sources))]
        hero = make_photo(hero_source, (960, 1920), stage, hero=True)
        if sum(p['variants'][-1]['bytes'] for p in photos) >= 7_000_000:
            raise ValueError('Largest menu variants exceed the 7 MB budget; page was not modified.')
        by_source = {p['source']: p for p in photos}

        def replace_image(match):
            tag = match.group()
            image = Images(tag).images[0]
            source = reverse.get(image.get('src'), image.get('src'))
            if source not in by_source:
                return tag
            photo = by_source[source]
            sizes = '(max-width: 390px) calc(100vw - 30px), 360px' if 'max-width: 360px' in image.get('style', '') else SIZES
            attrs = {'src': photo['default'],
                     'srcset': ', '.join(f"{v['src']} {v['width']}w" for v in photo['variants']),
                     'sizes': sizes, 'loading': 'lazy', 'decoding': 'async',
                     'width': str(photo['width']), 'height': str(photo['height'])}
            for name, value in attrs.items():
                tag = attribute(tag, name, value)
            return tag

        updated = re.sub(r'<img\b[^>]*>', replace_image, text, flags=re.I)
        updated = re.sub(r'\n?<!-- optimized-hero:start -->.*?<!-- optimized-hero:end -->\n?', '\n', updated, flags=re.S)
        mobile, desktop = hero['variants'][0], hero['variants'][-1]
        css = f'''<!-- optimized-hero:start -->
<style>
.teppanyaki-hero {{ background-image: url('{desktop['src']}'); }}
@media (max-width: 960px) {{ .teppanyaki-hero {{ background-image: url('{mobile['src']}'); }} }}
</style>
<!-- optimized-hero:end -->
'''
        updated = updated.replace('</head>', css + '</head>')
        if hero_match:
            updated = updated.replace('class="parallax"', 'class="parallax teppanyaki-hero"', 1)
            updated = re.sub(r"background:url\(['\x22]?" + re.escape(hero_source) + r"['\x22]?\) 50% 0 no-repeat fixed;", 'background-position:50% 0; background-repeat:no-repeat; background-attachment:fixed;', updated, count=1)
        historical_sources = [p['source'] for p in previous['photos']]
        excluded = ignored_sources(sorted(set(list(by_source) + historical_sources + [hero_source])), updated)
        backup = ROOT / '.optimization-backup'
        backup.mkdir(exist_ok=True)
        for path in (PAGE, ROOT / '.vercelignore'):
            if path.exists() and not (backup / path.name).exists():
                shutil.copy2(path, backup / path.name)
        OUT.mkdir(parents=True, exist_ok=True)
        for file in stage.iterdir():
            shutil.copy2(file, OUT / file.name)
        PAGE.with_suffix('.html.tmp').write_text(updated)
        PAGE.with_suffix('.html.tmp').replace(PAGE)
        report = {'photos': photos, 'hero': hero, 'excluded_masters': excluded,
                  'menu_elements': len(sources), 'menu_original_bytes': sum(p['original_bytes'] for p in photos),
                  'menu_largest_variant_bytes': sum(p['variants'][-1]['bytes'] for p in photos),
                  'menu_default_bytes': sum(next(v['bytes'] for v in p['variants'] if v['src'] == p['default']) for p in photos)}
        REPORT.write_text(json.dumps(report, indent=2) + '\n')
        # Preserve any deployment exclusions maintained outside this block.
        ignore = ROOT / '.vercelignore'
        content = ignore.read_text() if ignore.exists() else ''
        content = re.sub(r'\n?# optimized-photos:start.*?# optimized-photos:end\n?', '\n', content, flags=re.S)
        block = ['# optimized-photos:start', '/.optimization-backup/', '/scripts/', '/OPTIMASI-FOTO.md'] + excluded + ['# optimized-photos:end']
        ignore.write_text(content.rstrip() + '\n' + '\n'.join(block) + '\n')
        print(json.dumps({k: v for k, v in report.items() if k not in ('photos', 'hero', 'excluded_masters')}, indent=2))


if __name__ == '__main__':
    main()
