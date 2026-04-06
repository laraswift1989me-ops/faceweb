# Logo Assets — Replace With Your Brand

All logos are SVG with transparent backgrounds. Replace these files with your own brand assets (keep the same filenames).

## App Logo (SE)
| File | Usage | Background |
|------|-------|------------|
| `app-icon-dark.svg` | Square icon on dark backgrounds | Cyan→Blue gradient, dark "SE" text |
| `app-icon-light.svg` | Square icon on light backgrounds | Teal→Blue gradient, white "SE" text |
| `app-wordmark-dark.svg` | Full logo (icon + name) on dark bg | White text |
| `app-wordmark-light.svg` | Full logo (icon + name) on light bg | Dark text |
| `favicon.svg` | Browser tab icon | Small square icon |

## Token Logo (SC)
| File | Usage | Background |
|------|-------|------------|
| `token-icon-dark.svg` | Token icon on dark backgrounds | Amber→Red gradient, dark "SC" text |
| `token-icon-light.svg` | Token icon on light backgrounds | Amber→Red gradient, white "SC" text |
| `token-wordmark-dark.svg` | Full token logo on dark bg | White text |
| `token-wordmark-light.svg` | Full token logo on light bg | Dark text |

## Where They Are Used

### Frontend (faceweb)
- `index.html` → favicon.svg (browser tab)
- `src/app/components/Logo.tsx` → app-icon-dark.svg (sidebar, header, landing)
- `src/app/components/DesktopSidebar.tsx` → Logo component
- `src/app/components/Header.tsx` → Logo component
- `src/app/components/LandingNavbar.tsx` → Logo component
- `src/app/pages/SwiftCash.tsx` → token-icon-dark.svg (token page)

### Backend Admin (faceapi)
- `resources/views/admin/layout.blade.php` → app-icon-dark.svg (sidebar)
- `resources/views/admin/login.blade.php` → app-icon-dark.svg (login page)
- `resources/views/emails/layout.blade.php` → app-icon-light.svg (email header)

## How to Replace
1. Design your logos as SVG or PNG (recommended: 120x120px for icons, 320x80px for wordmarks)
2. Keep transparent backgrounds
3. Save with the exact same filenames
4. Copy to both `/faceweb/public/logos/` and `/faceapi/public/logos/`
5. Rebuild frontend: `npm run build`

## Converting SVG to PNG (if needed)
```bash
# Using Inkscape (install: apt install inkscape)
inkscape -w 512 -h 512 app-icon-dark.svg -o app-icon-dark.png
inkscape -w 192 -h 192 favicon.svg -o icon-192.png
inkscape -w 512 -h 512 favicon.svg -o icon-512.png
```
