Local image source for the vehicles dataset

Place your raw (original) images here before running the processor script.

Structure:

src/data/image_sources/raw/{brand}/{image-filename.jpg}

Example:
  src/data/image_sources/raw/chevrolet/tahoe-white.jpg

Filename matching:
- The script expects the basename used in `imageUrl` from `vehicles_dataset.json`.
- Alternatively place images directly inside `src/data/image_sources/raw/` and the script will attempt to find them.

Run the processor:

```bash
python3 src/data/process_images.py --source src/data/image_sources/raw --vehicles src/data/vehicles_dataset.json --out-json src/data/vehicles_lean.json
```

This will create optimized WebP detail and thumbnail images under `public/images/{brand}/` and produce `src/data/vehicles_lean.json`.
