#!/usr/bin/env python3
"""Generate a lean vehicles JSON without touching images.

- Reads `src/data/vehicles_dataset.json`
- Emits `src/data/vehicles_lean.json` with minimal fields
- Emits `src/data/image_map.json` mapping image basenames to VIN arrays

Usage:
  python3 src/data/generate_lean_dataset_simple.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VEH_FILE = ROOT / 'data' / 'vehicles_dataset.json'
OUT_LEAN = ROOT / 'data' / 'vehicles_lean.json'
OUT_MAP = ROOT / 'data' / 'image_map.json'

if not VEH_FILE.exists():
    print('vehicles_dataset.json not found at', VEH_FILE)
    raise SystemExit(1)

with VEH_FILE.open('r', encoding='utf-8') as f:
    vehicles = json.load(f)

lean = []
image_map = {}

for v in vehicles:
    vin = v.get('vin')
    image_url = v.get('imageUrl') or ''
    basename = image_url.split('/')[-1] if image_url else ''

    lean.append({
        'vin': vin,
        'stockNumber': v.get('stockNumber'),
        'brand': v.get('brand'),
        'model': v.get('model'),
        'year': v.get('year'),
        'status': v.get('status'),
        'image': image_url,
    })

    if basename:
        image_map.setdefault(basename, []).append(vin)

OUT_LEAN.parent.mkdir(parents=True, exist_ok=True)
with OUT_LEAN.open('w', encoding='utf-8') as f:
    json.dump(lean, f, indent=2)

with OUT_MAP.open('w', encoding='utf-8') as f:
    json.dump(image_map, f, indent=2)

print(f'Wrote {len(lean)} vehicles to {OUT_LEAN.name}')
print(f'Found {len(image_map)} unique image basenames, wrote {OUT_MAP.name}')
