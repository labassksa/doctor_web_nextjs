# Push Notification Icons

## Required Icons

This directory should contain notification icons for the Labass Doctor Portal PWA.

### Icon Sizes Required

Generate the following icon sizes from the Labass logo:

- `icon-72x72.png` - 72x72 pixels (badge icon)
- `icon-96x96.png` - 96x96 pixels
- `icon-128x128.png` - 128x128 pixels
- `icon-144x144.png` - 144x144 pixels
- `icon-152x152.png` - 152x152 pixels
- `icon-192x192.png` - 192x192 pixels (primary notification icon)
- `icon-384x384.png` - 384x384 pixels
- `icon-512x512.png` - 512x512 pixels (PWA install icon)

### Icon Requirements

**Format:** PNG with transparency
**Purpose:** `maskable any` (works on all platforms)
**Design Guidelines:**
- Use the Labass brand logo
- Include proper padding (safe zone for maskable icons)
- Ensure logo is visible on both light and dark backgrounds
- Consider rounded corners for iOS compatibility

### Generating Icons

You can use online tools to generate all sizes from a single source:

1. **Recommended Tool:** https://realfavicongenerator.net/
   - Upload Labass logo (minimum 512x512)
   - Select "Progressive Web App" preset
   - Download generated icons

2. **Alternative:** Use ImageMagick command line:
   ```bash
   # From source logo (logo.png, minimum 512x512)
   convert logo.png -resize 72x72 icon-72x72.png
   convert logo.png -resize 96x96 icon-96x96.png
   convert logo.png -resize 128x128 icon-128x128.png
   convert logo.png -resize 144x144 icon-144x144.png
   convert logo.png -resize 152x152 icon-152x152.png
   convert logo.png -resize 192x192 icon-192x192.png
   convert logo.png -resize 384x384 icon-384x384.png
   convert logo.png -resize 512x512 icon-512x512.png
   ```

### Current Status

⚠️ **Icons not yet generated** - Add icon files before production deployment.
