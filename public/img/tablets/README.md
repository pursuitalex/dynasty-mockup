# Tablet carousel images (Section 4)

This folder is the asset slot for the rotated tablet carousel.

## How the component picks files

The component (`components/sections/TabletsCarousel.tsx`) declares a pool of
**8 unique tablet slots**, looking for these filenames:

```
1.png   2.png   3.png   4.png
5.png   6.png   7.png   8.png
```

Files `9.png`, `10.png`, etc. are ignored — only the first 8 are pulled in.

If a numbered file is missing (or hasn't been added yet), the component shows
a solid-colour placeholder of the same size in its slot.

## How to swap in real screenshots

1. Drop your real images into this folder, named exactly `1.png` … `8.png`
   (PNG/JPG/WebP — change extension in the component if needed).
2. Recommended size: **640×400** (matches the Figma frame so cropping is
   minimal). Larger is fine — they'll be `object-cover`-clipped.
3. Save → the dev server hot-reloads.

## Adding more than 8 unique tablets

Bump `TABLET_POOL_SIZE` inside `components/sections/TabletsCarousel.tsx` and
add corresponding `9.png`, `10.png`, etc.
