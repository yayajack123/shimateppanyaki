#!/usr/bin/env python3
"""Check generated photos, references, deployment exclusions and transfer budget."""
import hashlib
import json
import re
from pathlib import Path
from optimize_photos import Images, ROOT, PAGE, REPORT, SIZES


def main():
    report = json.loads(REPORT.read_text())
    text = PAGE.read_text()
    by_output = {v['src']: (p, v) for p in report['photos'] for v in p['variants']}
    images = [img for img in Images(text).images if img.get('src') in by_output]
    assert len(images) == report['menu_elements'], 'Photo element count changed'
    assert not any(img.get('src', '').startswith('assets/generated-') or img.get('src') == 'assets/menu-steak.jpg' for img in Images(text).images), 'Unoptimized menu photo'
    for img in images:
        photo, _ = by_output[img['src']]
        assert img['src'] == photo['default']
        assert img['srcset'] == ', '.join(f"{v['src']} {v['width']}w" for v in photo['variants'])
        assert img['sizes'] == ('(max-width: 390px) calc(100vw - 30px), 360px' if 'max-width: 360px' in img.get('style', '') else SIZES)
        assert (int(img['width']), int(img['height'])) == (photo['width'], photo['height'])
        assert img['loading'] == 'lazy' and img['decoding'] == 'async'
    for photo in report['photos'] + [report['hero']]:
        assert (ROOT / photo['source']).is_file(), 'Master missing'
        for variant in photo['variants']:
            path = ROOT / variant['src']
            data = path.read_bytes()
            assert data[:4] == b'RIFF' and data[8:12] == b'WEBP'
            assert path.stat().st_size == variant['bytes']
            assert hashlib.sha256(data).hexdigest()[:16] in path.name
            assert variant['width'] <= photo['width'], 'Upscaled variant'
            assert variant['bytes'] <= (180_000 if variant['width'] <= 800 else 250_000)
    assert sum(p['variants'][-1]['bytes'] for p in report['photos']) < 7_000_000
    excluded = set(report['excluded_masters'])
    ignore = (ROOT / '.vercelignore').read_text().splitlines()
    assert excluded.issubset(ignore)
    assert not any('/' + variant['src'] in excluded for p in report['photos'] + [report['hero']] for variant in p['variants'])
    for path in ROOT.rglob('*'):
        if any(part.startswith('.') for part in path.relative_to(ROOT).parts):
            continue
        if path.suffix.lower() not in ('.html', '.css', '.js'):
            continue
        source = path.read_text(errors='replace')
        assert not any(Path(master).name in source for master in excluded), f'Excluded master referenced by {path}'
    # Check paths actually requested by the three pages, including CSS dependencies.
    missing = []
    for path in [ROOT / name for name in ('index.html', 'restaurant.html', 'teppanyaki.html')] + list((ROOT / 'assets').glob('*.css')) + [ROOT / 'typography.css', ROOT / 'local-fixes.css']:
        for ref in re.findall(r'''(?:src|href)=["'](assets/[^"'?#]+)|url\(["']?([^\s)"'?#]+)''', path.read_text(errors='replace')):
            value = next((part for part in ref if part), '')
            if not value or value.startswith(('http:', 'https:', '//', 'data:', '#')):
                continue
            target = (path.parent / value).resolve()
            if not target.is_file() or '/' + str(target.relative_to(ROOT)) in excluded:
                missing.append(f'{path.name}: {value}')
    assert not missing, 'Missing/deployment-excluded references: ' + ', '.join(missing)
    config = json.loads((ROOT / 'vercel.json').read_text())
    assert config['headers'][0]['headers'][0]['value'] == 'public, max-age=31536000, immutable'
    print(f"PASS: {len(images)} menu elements, {len(report['photos'])} unique photos; all variants, hashes, references and exclusions valid.")
    print(f"PASS: largest menu variants total {report['menu_largest_variant_bytes']:,} bytes (budget 7,000,000).")


if __name__ == '__main__':
    main()
