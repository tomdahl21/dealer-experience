#!/usr/bin/env python3
"""
Process vehicle images for the app (Pillow + requests).

- Reads `vehicles_dataset.json` and looks for source images in a local source folder.
- Produces optimized detail and thumbnail WebP images under `public/images/{brand}/`.
- Emits a lean JSON `vehicles_lean.json` with minimal fields and final image paths.

Usage:
  python3 src/data/process_images.py \
      --source src/data/image_sources/raw \
      --vehicles src/data/vehicles_dataset.json \
      --out-json src/data/vehicles_lean.json

Place source images under `src/data/image_sources/raw/{brand}/` with names matching the basenames used in `imageUrl` (e.g. tahoe-white.jpg).

If an image is missing the script will report which VINs are missing images.
"""

import argparse
import json
import os
from pathlib import Path
from PIL import Image


def ensure_dir(p: Path):
    p.mkdir(parents=True, exist_ok=True)


def resize_preserve(im, target_width):
    w, h = im.size
    if w <= target_width:
        return im.copy()
    new_h = int(target_width * h / w)
    return im.resize((target_width, new_h), Image.LANCZOS)


def process_vehicle_image(src_path: Path, out_dir: Path, vin: str, detail_w=1200, thumb_w=320):
    im = Image.open(src_path).convert('RGB')
    detail = resize_preserve(im, detail_w)
    thumb = resize_preserve(im, thumb_w)

    detail_name = f"{vin}-detail.webp"
    thumb_name = f"{vin}-thumb.webp"

    detail_path = out_dir / detail_name
    thumb_path = out_dir / thumb_name

    detail.save(detail_path, 'WEBP', quality=85, method=6)
    thumb.save(thumb_path, 'WEBP', quality=80, method=6)

    return f"/images/{out_dir.name}/{detail_name}", f"/images/{out_dir.name}/{thumb_name}"


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--source', default='src/data/image_sources/raw')
    p.add_argument('--vehicles', default='src/data/vehicles_dataset.json')
    p.add_argument('--out-json', default='src/data/vehicles_lean.json')
    p.add_argument('--public', default='public/images')
    p.add_argument('--detail-width', type=int, default=1200)
    p.add_argument('--thumb-width', type=int, default=320)
    args = p.parse_args()

    src_root = Path(args.source)
    vehicles_file = Path(args.vehicles)
    out_json = Path(args.out_json)
    public_root = Path(args.public)

    if not vehicles_file.exists():
        print(f"ERROR: vehicles file not found: {vehicles_file}")
        return

    ensure_dir(public_root)

    with vehicles_file.open('r', encoding='utf-8') as f:
        vehicles = json.load(f)

    lean = []
    missing = []
    processed_count = 0

    for v in vehicles:
        vin = v.get('vin')
        brand_raw = v.get('brand', 'unknown')
        brand = str(brand_raw).lower().replace(' ', '')
        image_url = v.get('imageUrl', '')
        # image_url like "/images/chevrolet/tahoe-white.jpg"
        basename = Path(image_url).name

        # possible source locations
        candidates = [
            src_root / brand / basename,
            src_root / basename,
        ]

        found = None
        for c in candidates:
            if c.exists():
                found = c
                break

        out_brand_dir = public_root / brand
        ensure_dir(out_brand_dir)

        if found:
            try:
                image_path, thumb_path = process_vehicle_image(found, out_brand_dir, vin, args.detail_width, args.thumb_width)
                processed_count += 1
            except Exception as e:
                print(f"Failed to process {found}: {e}")
                missing.append(vin)
                image_path, thumb_path = None, None
        else:
            missing.append(vin)
            image_path, thumb_path = None, None

        lean.append({
            'vin': vin,
            'stockNumber': v.get('stockNumber'),
            'brand': v.get('brand'),
            'model': v.get('model'),
            'year': v.get('year'),
            'color': v.get('color'),
            'status': v.get('status'),
            'image': image_path,
            'thumbnail': thumb_path,
        })

    with out_json.open('w', encoding='utf-8') as f:
        json.dump(lean, f, indent=2)

    print(f"Processed {processed_count} images. {len(missing)} vehicles missing images.")
    if missing:
        print("Missing VINs (place matching source images under src/data/image_sources/raw/{brand}/basename):")
        for mv in missing:
            print(" -", mv)


if __name__ == '__main__':
    main()
