
# simgr - Simple Image Resizer

Simgr creates different variants of your images, meaning different formats and sizes.
However, instead of the usual batch resizing,
Simgr creates each variant on demand.
Empirically, this works better on low memory platforms.

## Features, Support, and Limitations

- Validation for HTTP streams
- Orientation correction
- Uses [sharp](https://github.com/lovell/sharp) for fast resizing
- Converts GIFs to HTML5 videos using ffmpeg
- `sha256`s to keep track of your files and avoid duplicates
- Original images and variants are stored in separate buckets for better storage control
- Concurrency handling so you don't drain your memory and CPU

## Requirements

- UNIX
- Node 0.11+
- `VIPS`
- `ImageMagick`
- `ffmpeg`

## Notes

- `.save()` does not assert `content-length` or body length.
- `.identify()` uses ImageMagick to check whether a file is an image,
  which in reality means "a supported type of image".
- `.identify()`'s signature calculation takes a lot of time, at least with large images.
- Need to support color correction again
- We should minimize transcoding as much as possible when dealing with original images
- Animated WebP
- APNG
