# Setup Guide - Best Deal Guidance Web App

## Quick Start

```bash
# 1. Extract the ZIP file
unzip best-deal-guidance.zip
cd best-deal-guidance

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173
```

## Demo Credentials

**Sales Person (Sarah):**
- Email: sarah@dealership.com
- Password: demo123

**Manager (Mike):**
- Email: mike@dealership.com
- Password: demo123

## Sample VINs

Use these for testing the VIN scanner:

```
1G1YY26E965105305  - 2023 Chevrolet Tahoe (67 days on lot, high flexibility)
3GNAXKEV0PL123456  - 2023 Chevrolet Silverado (23 days on lot, medium flexibility)
```

## Project Status

This is a starter template with:
- ✅ Project structure
- ✅ Dependencies configured
- ✅ Routing setup
- ✅ Authentication flow
- ✅ Theme system (brand switching)
- ✅ Mock data
- ✅ State management (Zustand)

## Next Steps

### 1. Complete Core Services

Create remaining service files in `src/services/`:

**vinService.js** - VIN decoding and vehicle lookup
**pricingService.js** - Deal scoring and pricing calculations
**inventoryService.js** - Inventory management
**dealService.js** - Deal CRUD operations

### 2. Build Page Components

Create page components in `src/pages/`:

**auth/LoginPage.jsx** - Login form (tablet-optimized)
**sales/HomePage.jsx** - Sales dashboard
**sales/ScanPage.jsx** - VIN scanner interface
**sales/VehicleDetailPage.jsx** - Vehicle details with deal guidance
**sales/MyDealsPage.jsx** - Deal history
**manager/DashboardPage.jsx** - Manager overview
**manager/ApprovalsPage.jsx** - Pending deal approvals
**manager/InventoryPage.jsx** - Inventory management

### 3. Build Reusable Components

Create components in `src/components/`:

**Common:**
- Button.jsx
- Card.jsx
- StatusBadge.jsx
- BrandHeader.jsx

**VIN:**
- VINScanner.jsx (camera + manual entry)
- VINManualEntry.jsx
- VINResultCard.jsx

**Deal:**
- DealScoreWidget.jsx (circular gauge, 0-100)
- PricingCard.jsx (MSRP, invoice, target, minimum)
- ConversationPlaybook.jsx (talking points)
- DealSweeteners.jsx (add-ons menu)

**Manager:**
- DealApprovalCard.jsx
- TeamActivity.jsx
- InventoryAging.jsx

**Layout:**
- AppLayout.jsx (main layout wrapper)
- Navigation.jsx (responsive nav)
- TabletLayout.jsx (tablet-specific layouts)

### 4. Implement VIN Scanning

Install camera libraries:
```bash
npm install html5-qrcode tesseract.js
```

Create VINScanner component with:
- Camera access via MediaDevices API
- OCR text recognition for VIN plates
- QR/Barcode scanning for stickers
- Manual entry fallback
- VIN format validation

### 5. Build Deal Scoring Algorithm

In `src/utils/dealCalculator.js`:

```javascript
export const calculateDealScore = (vehicle) => {
  let score = 50;
  
  // Days on lot (0-30 points)
  if (vehicle.daysOnLot > 60) score += 30;
  else if (vehicle.daysOnLot > 30) score += 15;
  
  // Inventory depth (0-20 points)
  if (vehicle.similarInInventory > 5) score += 20;
  else if (vehicle.similarInInventory > 2) score += 10;
  
  // Incentives (0-20 points)
  if (vehicle.incentives > 2000) score += 20;
  else if (vehicle.incentives > 1000) score += 10;
  
  // Market position (0-30 points)
  if (vehicle.marketPosition < -5) score += 30;
  else if (vehicle.marketPosition < 0) score += 15;
  
  return Math.min(score, 100);
};

export const getDealFlexibility = (score) => {
  if (score >= 71) return { level: 'high', color: 'success' };
  if (score >= 41) return { level: 'medium', color: 'warning' };
  return { level: 'low', color: 'error' };
};
```

### 6. Add Responsive Layouts

Use MUI's Grid and Box for layouts:

**Tablet Portrait (768px):**
- Single column
- Stacked cards
- Bottom navigation

**Tablet Landscape (1024px):**
- Two-column layout
- Sidebar + main content
- Persistent navigation

**Desktop (1280px+):**
- Three-column dashboard
- Expanded panels
- Full navigation

### 7. Polish & Animations

Add Material-UI animations:
- Fade transitions between pages
- Slide-in for drawers
- Grow effect for cards
- Loading skeletons

### 8. Testing on Tablet

To test on iPad/Android tablet:

```bash
# Find your local IP
ipconfig getifaddr en0  # macOS
ip addr show           # Linux

# Start server with host flag (already configured)
npm run dev

# Access from tablet
# http://YOUR_IP:5173
```

## File Structure Reference

```
src/
├── components/
│   ├── common/          - Reusable UI elements
│   ├── vin/             - VIN scanning components
│   ├── deal/            - Deal guidance components
│   ├── manager/         - Manager-specific components
│   └── layout/          - Layout wrappers
│
├── pages/
│   ├── auth/            - Login/logout pages
│   ├── sales/           - Sales person pages
│   └── manager/         - Manager pages
│
├── services/            - Mock API services
├── store/               - Zustand state stores
├── theme/               - MUI theming
├── utils/               - Helper functions
└── data/                - Mock JSON data
```

## Key Design Decisions

**Why Vite?**
- Fast HMR (Hot Module Replacement)
- Optimized builds
- Better DX than Create React App

**Why Material-UI?**
- Comprehensive component library
- Excellent theming system
- Great tablet/responsive support
- Accessibility built-in

**Why Zustand?**
- Simpler than Redux
- No boilerplate
- Great TypeScript support
- Perfect for POC/demo

**Why Mock Services?**
- No backend required
- Easy to demo
- LocalStorage persistence
- Can swap for real APIs later

## Deployment

### Option 1: Netlify (Easiest)

```bash
# Build project
npm run build

# Deploy to Netlify
# Drag-and-drop 'dist' folder to netlify.com/drop
```

### Option 2: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 3: GitHub Pages

```bash
# Add to package.json
"homepage": "https://username.github.io/best-deal-guidance"

# Install gh-pages
npm install --save-dev gh-pages

# Add scripts
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill
```

**Module not found:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Camera not working:**
- Requires HTTPS (or localhost)
- Check browser permissions
- iOS: May need Safari (not Chrome)

**Theme not updating:**
- Check localStorage for cached user
- Hard refresh browser (Cmd+Shift+R)

## Resources

- [React Docs](https://react.dev)
- [Material-UI Docs](https://mui.com)
- [Vite Docs](https://vitejs.dev)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Router Docs](https://reactrouter.com)

## Support

Questions? Check:
1. TECHNICAL_BRIEF.md for full specifications
2. README.md for quick reference
3. Component comments for implementation details

---

**Happy Coding!** 🚀
