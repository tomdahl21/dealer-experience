# Technical Brief: GM Best Deal Guidance Web App

**Project Name:** Best Deal Guidance  
**Version:** 1.0.0 (POC/Demo)  
**Platform:** Web Application (Tablet-Optimized)  
**Date:** February 9, 2026  
**Author:** Tom (Slalom Consulting)  

---

## Executive Summary

A tablet-optimized web application that empowers GM dealership sales staff to scan vehicle VINs and instantly receive intelligent pricing guidance, market insights, and conversation strategies. The app analyzes inventory data, market conditions, and dealer incentives to provide real-time recommendations that help close deals while protecting margins.

**Target Users:**
- Dealership Sales Staff (primary)
- Dealership Sales Managers (oversight/approval)

**Brands Supported:** Chevrolet, GMC, Cadillac, Buick

**Target Device:** iPad (primary), Android tablets, desktop browsers (secondary)

---

## Product Vision

Transform the traditional "salesperson runs to manager's office" negotiation pattern into an instant, data-driven conversation powered by AI and market intelligence. Enable sales staff to confidently discuss pricing with customers while maintaining dealership profitability.

---

## User Personas

### Persona 1: Sarah - Dealership Sales Associate
**Demographics:**
- Age: 28
- Experience: 3 years in auto sales
- Tech comfort: High
- Daily tools: iPad, DMS system, CRM

**Goals:**
- Close more deals faster
- Build trust with customers through transparency
- Avoid multiple trips to manager for approval
- Understand which deals have flexibility

**Pain Points:**
- Doesn't know real-time market positioning
- Unclear on how much she can negotiate
- Wastes time going back-and-forth with manager
- Feels uninformed compared to internet-savvy customers

**Use Case:**
Customer interested in 2023 Tahoe on the lot. Sarah opens app on iPad, scans VIN with camera, sees it's been on lot 67 days with high flexibility score. App suggests opening at $50,995 with room to negotiate to $49,500. She confidently starts conversation knowing her boundaries.

---

### Persona 2: Mike - Sales Manager
**Demographics:**
- Age: 45
- Experience: 20 years in auto industry
- Tech comfort: Medium
- Daily tools: DMS, Excel, desktop computer

**Goals:**
- Maintain healthy profit margins across inventory
- Empower sales team to close without constant oversight
- Move aging inventory strategically
- Track team performance and deal quality

**Pain Points:**
- Constantly interrupted for pricing approvals
- Sales staff over-discount or leave money on table
- Hard to communicate incentive strategies to whole team
- Difficult to track which vehicles need aggressive pricing

**Use Case:**
Reviews dashboard on desktop showing team's deals for the day. Sees Sarah closed Tahoe at $49,650 - within target range. Approves deal with one tap. Notices 3 Silverados hitting 90 days and adjusts flexibility scores to encourage movement.

---

## Technical Architecture

### Technology Stack

**Frontend:**
- **Framework:** React 18+ with Vite
- **UI Library:** Material UI (MUI) v5
- **Routing:** React Router v6
- **State Management:** Zustand (lightweight, simple for demo)
- **Camera/Scanning:** html5-qrcode + tesseract.js (OCR)
- **Charts:** Recharts
- **Styling:** MUI theming + Emotion (CSS-in-JS)
- **Icons:** Material Icons

**Backend (Mocked for Demo):**
- **Mock API:** MSW (Mock Service Worker)
- **Data Storage:** localStorage
- **Authentication:** Mock auth service (hardcoded users)

**Development:**
- **Build Tool:** Vite (fast HMR, optimized builds)
- **Package Manager:** npm
- **Linting:** ESLint + Prettier

**Design System:**
- **Tokens:** MUI theme configuration
- **Typography:** DIN Pro (web font) or system fallback
- **Responsive:** Mobile-first, tablet-optimized (768px-1024px primary)

---

## Responsive Design Strategy

### Breakpoints
```javascript
const breakpoints = {
  mobile: '320px',    // 320-767px (minimal support)
  tablet: '768px',    // 768-1023px (PRIMARY TARGET)
  desktop: '1024px',  // 1024px+ (secondary support)
};
```

### Target Devices
- **Primary:** iPad (1024x768, 1366x1024), Samsung Galaxy Tab
- **Secondary:** Desktop browsers (Chrome, Safari, Edge)
- **Minimal:** Mobile phones (functional but not optimized)

### Layout Patterns
- **Tablet Portrait (768px):** Single column with collapsible sections
- **Tablet Landscape (1024px):** Two-column layout (detail + sidebar)
- **Desktop (1200px+):** Three-column dashboard layout

---

## Application Structure

```
best-deal-guidance/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── logos/
│       ├── chevrolet.png
│       ├── gmc.png
│       ├── cadillac.png
│       └── buick.png
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── BrandHeader.jsx
│   │   ├── vin/
│   │   │   ├── VINScanner.jsx
│   │   │   ├── VINManualEntry.jsx
│   │   │   └── VINResultCard.jsx
│   │   ├── deal/
│   │   │   ├── DealScoreWidget.jsx
│   │   │   ├── PricingCard.jsx
│   │   │   ├── ConversationPlaybook.jsx
│   │   │   └── DealSweeteners.jsx
│   │   ├── manager/
│   │   │   ├── DealApprovalCard.jsx
│   │   │   ├── TeamActivity.jsx
│   │   │   └── InventoryAging.jsx
│   │   └── layout/
│   │       ├── AppLayout.jsx
│   │       ├── Navigation.jsx
│   │       └── TabletLayout.jsx
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.jsx
│   │   ├── sales/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ScanPage.jsx
│   │   │   ├── VehicleDetailPage.jsx
│   │   │   └── MyDealsPage.jsx
│   │   └── manager/
│   │       ├── DashboardPage.jsx
│   │       ├── ApprovalsPage.jsx
│   │       └── InventoryPage.jsx
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── vinService.js
│   │   ├── pricingService.js
│   │   ├── inventoryService.js
│   │   └── dealService.js
│   │
│   ├── store/
│   │   ├── authStore.js
│   │   ├── vehicleStore.js
│   │   ├── dealStore.js
│   │   └── themeStore.js
│   │
│   ├── theme/
│   │   ├── brandThemes.js
│   │   ├── muiTheme.js
│   │   └── ThemeProvider.jsx
│   │
│   ├── utils/
│   │   ├── vinDecoder.js
│   │   ├── dealCalculator.js
│   │   ├── formatters.js
│   │   └── validators.js
│   │
│   ├── data/
│   │   ├── users.json
│   │   ├── vehicles.json
│   │   ├── incentives.json
│   │   └── deals.json
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
├── eslint.config.js
├── .gitignore
└── README.md
```

---

## Core Features

### Phase 1: MVP (Demo-Ready)

#### 1. Authentication
**Sales Person Login:**
- Email: `sarah@dealership.com`
- Password: `demo123`
- Role: `sales`
- Dealership: `Suburban Chevrolet Chicago`

**Manager Login:**
- Email: `mike@dealership.com`
- Password: `demo123`
- Role: `manager`
- Dealership: `Suburban Chevrolet Chicago`

**Functionality:**
- Simple email/password form
- Role-based routing (sales vs manager views)
- Persist session with localStorage
- Brand selection on login (for theming)

---

#### 2. VIN Scanning (Sales Person)

**Tablet Camera Scanning:**
- Access device camera via browser
- OCR detects VIN from photo using Tesseract.js
- Validate VIN format (17 characters, no I/O/Q)
- Display confirmation before proceeding
- Fallback to manual entry if camera unavailable

**Manual Entry:**
- Text input with real-time validation
- Sample VINs provided in UI
- Auto-format as user types

**QR Code Scanning:**
- Support for VIN barcodes (Code 39, Code 128)
- Using html5-qrcode library

---

#### 3. Deal Score & Guidance

**Scoring Display:**
- Large circular gauge (0-100)
- Color-coded: Red (0-40), Amber (41-70), Green (71-100)
- Breakdown of scoring factors
- Animated transitions

**Key Metrics:**
- Days on lot (with urgency indicator)
- Inventory depth
- Available incentives
- Market positioning

---

#### 4. Responsive Layouts

**Tablet Portrait (768px):**
```
┌─────────────────────────┐
│ [Brand Header]          │
├─────────────────────────┤
│                         │
│ [VIN Scanner Card]      │
│                         │
├─────────────────────────┤
│                         │
│ [Vehicle Info]          │
│                         │
├─────────────────────────┤
│ [Deal Score]            │
│                         │
├─────────────────────────┤
│ [Pricing Card]          │
│                         │
└─────────────────────────┘
```

**Tablet Landscape (1024px):**
```
┌──────────────────────────────────────┐
│ [Brand Header]                       │
├───────────────────┬──────────────────┤
│                   │                  │
│ [VIN Scanner]     │ [Vehicle Info]   │
│                   │                  │
├───────────────────┤                  │
│                   │                  │
│ [Deal Score]      │ [Pricing Card]   │
│                   │                  │
├───────────────────┤                  │
│                   │                  │
│ [Playbook]        │ [Sweeteners]     │
│                   │                  │
└───────────────────┴──────────────────┘
```

---

## MUI Theme Configuration

### Brand Themes
```javascript
// src/theme/brandThemes.js
export const brandThemes = {
  chevrolet: {
    palette: {
      primary: {
        main: '#D1AD57',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#9FA8A7',
      },
    },
    logo: '/logos/chevrolet.png',
    name: 'Chevrolet',
  },
  gmc: {
    palette: {
      primary: {
        main: '#C41230',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#808080',
      },
    },
    logo: '/logos/gmc.png',
    name: 'GMC',
  },
  cadillac: {
    palette: {
      primary: {
        main: '#000000',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#E32934',
      },
    },
    logo: '/logos/cadillac.png',
    name: 'Cadillac',
  },
  buick: {
    palette: {
      primary: {
        main: '#0066CC',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#C0C0C0',
      },
    },
    logo: '/logos/buick.png',
    name: 'Buick',
  },
};
```

### Base Theme
```javascript
// src/theme/muiTheme.js
export const createAppTheme = (brand = 'chevrolet') => {
  const brandConfig = brandThemes[brand];
  
  return createTheme({
    palette: {
      ...brandConfig.palette,
      background: {
        default: '#F5F5F5',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#1A1A1A',
        secondary: '#4A4A4A',
      },
      success: {
        main: '#2E7D32',
      },
      warning: {
        main: '#F57C00',
      },
      error: {
        main: '#C62828',
      },
      info: {
        main: '#1976D2',
      },
    },
    typography: {
      fontFamily: '"DIN Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontSize: '28px',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '22px',
        fontWeight: 700,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '16px',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '14px',
        lineHeight: 1.43,
      },
      caption: {
        fontSize: '12px',
        lineHeight: 1.33,
      },
    },
    spacing: 8, // Base unit: 8px
    shape: {
      borderRadius: 8,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 768,   // Tablet portrait
        lg: 1024,  // Tablet landscape
        xl: 1280,  // Desktop
      },
    },
  });
};
```

---

## Mock Data

### Users
```json
[
  {
    "id": "1",
    "email": "sarah@dealership.com",
    "password": "demo123",
    "name": "Sarah Johnson",
    "role": "sales",
    "dealership": "Suburban Chevrolet Chicago",
    "brand": "chevrolet",
    "photoUrl": "https://i.pravatar.cc/150?img=1"
  },
  {
    "id": "2",
    "email": "mike@dealership.com",
    "password": "demo123",
    "name": "Mike Patterson",
    "role": "manager",
    "dealership": "Suburban Chevrolet Chicago",
    "brand": "chevrolet",
    "photoUrl": "https://i.pravatar.cc/150?img=12"
  }
]
```

### Sample Vehicles
```json
[
  {
    "vin": "1G1YY26E965105305",
    "stockNumber": "T23-1042",
    "year": 2023,
    "make": "Chevrolet",
    "model": "Tahoe",
    "trim": "Premier 4WD",
    "color": "Summit White",
    "mileage": 12,
    "msrp": 52495,
    "invoice": 48200,
    "currentPrice": 51200,
    "targetPrice": 49500,
    "minimumPrice": 48800,
    "daysOnLot": 67,
    "incentives": 2200,
    "incentiveDetails": [
      { "name": "Factory-to-Dealer Cash", "amount": 1500 },
      { "name": "Holdback", "amount": 700 }
    ],
    "similarInInventory": 8,
    "marketPosition": -3,
    "safetyFeatures": [
      "Blind Spot Monitoring",
      "Automatic Emergency Braking",
      "Lane Keep Assist",
      "Adaptive Cruise Control"
    ],
    "keyFeatures": [
      "Leather Seats",
      "Panoramic Sunroof",
      "Captain's Chairs",
      "Bose Premium Audio"
    ],
    "images": [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"
    ],
    "competitorInventory": 12
  },
  {
    "vin": "3GNAXKEV0PL123456",
    "stockNumber": "S23-2019",
    "year": 2023,
    "make": "Chevrolet",
    "model": "Silverado 1500",
    "trim": "LTZ Crew Cab 4WD",
    "color": "Black",
    "mileage": 8,
    "msrp": 58995,
    "invoice": 54200,
    "currentPrice": 57500,
    "targetPrice": 55800,
    "minimumPrice": 54900,
    "daysOnLot": 23,
    "incentives": 1500,
    "incentiveDetails": [
      { "name": "Factory-to-Dealer Cash", "amount": 1000 },
      { "name": "Holdback", "amount": 500 }
    ],
    "similarInInventory": 15,
    "marketPosition": 2,
    "safetyFeatures": [
      "Blind Spot Monitoring",
      "Rear Cross Traffic Alert"
    ],
    "keyFeatures": [
      "Heated Seats",
      "Max Trailering Package",
      "Spray-In Bed Liner",
      "20-inch Wheels"
    ],
    "images": [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"
    ],
    "competitorInventory": 8
  }
]
```

---

## Development Phases

### Week 1: Foundation & Setup
- [x] Initialize Vite + React project
- [x] Install MUI and dependencies
- [x] Set up project structure
- [x] Create theme configuration
- [x] Build mock data files
- [x] Set up routing

### Week 2: Authentication & Layout
- [ ] Build login page (tablet-optimized)
- [ ] Implement mock auth service
- [ ] Create AppLayout component
- [ ] Build navigation (drawer + tabs)
- [ ] Implement role-based routing
- [ ] Set up localStorage persistence

### Week 3: Sales Features
- [ ] Build VIN scanner component (camera + manual)
- [ ] Create vehicle detail page
- [ ] Implement DealScoreWidget
- [ ] Build PricingCard
- [ ] Create ConversationPlaybook
- [ ] Build DealSweeteners
- [ ] Implement deal submission

### Week 4: Manager Features
- [ ] Build manager dashboard
- [ ] Create approvals page
- [ ] Build team activity view
- [ ] Create inventory management
- [ ] Implement deal approval flow

### Week 5: Polish & Demo
- [ ] Responsive testing (all breakpoints)
- [ ] Add animations and transitions
- [ ] Implement error handling
- [ ] Create demo walkthrough
- [ ] Performance optimization
- [ ] Build documentation

---

## Camera/Scanning Implementation

### Browser Camera Access
```javascript
// Using MediaDevices API
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' } // Rear camera on tablets
    });
    videoRef.current.srcObject = stream;
  } catch (err) {
    console.error('Camera access denied:', err);
    // Fallback to manual entry
  }
};
```

### OCR with Tesseract.js
```javascript
import Tesseract from 'tesseract.js';

const recognizeVIN = async (imageData) => {
  const { data: { text } } = await Tesseract.recognize(
    imageData,
    'eng',
    {
      logger: m => console.log(m) // Progress updates
    }
  );
  
  // Extract VIN pattern (17 alphanumeric, no I/O/Q)
  const vinPattern = /[A-HJ-NPR-Z0-9]{17}/g;
  const matches = text.match(vinPattern);
  
  return matches ? matches[0] : null;
};
```

---

## Demo Script

### Setup
- Load app in Chrome/Safari on iPad
- Login credentials ready
- Sample VINs ready for manual entry
- Multiple browser tabs for dual-persona demo

### Demo Flow 1: Sales Person (Sarah)
1. **Login** - Show tablet-optimized login screen
2. **Home** - "Customer interested in a Tahoe on the lot"
3. **Scan VIN** - Either camera or manual entry: `1G1YY26E965105305`
4. **Vehicle Detail** - Shows 2023 Tahoe Premier
5. **Deal Score** - "85/100 - High flexibility, been here 67 days"
6. **Pricing Guide** - "Target $49,500, can go to $48,800 minimum"
7. **Playbook** - "Lead with safety features, watch competitor inventory"
8. **Submit Deal** - Customer offered $49,650, add warranty
9. **Confirmation** - Deal sent to Mike for approval

### Demo Flow 2: Manager (Mike)
1. **Login** - Switch to manager view
2. **Dashboard** - See pending approval from Sarah
3. **Review Deal** - Tahoe at $49,650, margin $1,450 ✅
4. **Approve** - One-tap approval
5. **Inventory** - View aging vehicles, adjust flexibility scores
6. **Team Activity** - See Sarah's closed deals and performance

---

## Getting Started

### Prerequisites
```bash
Node.js 18+
npm or yarn
Modern browser (Chrome, Safari, Edge)
```

### Installation
```bash
# Navigate to project directory
cd best-deal-guidance

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development
- Dev server runs on `http://localhost:5173`
- Hot module replacement enabled
- Access on tablet via local network IP

---

## Deployment Options

### Option 1: Static Hosting (Recommended for Demo)
- Netlify / Vercel (easiest)
- AWS S3 + CloudFront
- GitHub Pages

### Option 2: Internal GM Network
- Upload to dealer portal server
- Restrict access via VPN
- Integrate with existing auth

---

## Browser Compatibility

**Tested/Supported:**
- ✅ Chrome 90+ (recommended)
- ✅ Safari 14+ (iOS/iPadOS)
- ✅ Edge 90+
- ⚠️ Firefox 88+ (camera support varies)

**Required Browser Features:**
- MediaDevices API (camera access)
- LocalStorage
- ES6+ JavaScript
- CSS Grid & Flexbox

---

## Success Metrics

**Technical:**
- Page load time < 2 seconds
- Camera initialization < 1 second
- VIN recognition accuracy > 90%
- Responsive at 768px, 1024px, 1280px

**User Experience:**
- Deal guidance visible in 3 taps
- Manager approval in 2 taps
- Zero app installation required
- Works offline (with cached data)

---

## Next Steps After Demo

1. **User Testing** - Sales staff feedback sessions
2. **Real API Integration** - Connect to actual DMS/inventory systems
3. **Advanced Features** - ML-based pricing, customer sentiment
4. **Multi-Dealership** - Scale to multiple locations
5. **Mobile App** - If web version proves successful

---

## Questions for Kickoff

1. **Hosting:** Internal network or public demo URL?
2. **Camera:** Required or can we demo with manual entry?
3. **Data Volume:** 10 vehicles sufficient or need more?
4. **Presentation:** Screen share or pass tablet around?
5. **Timeline:** Demo presentation date?

---

**Ready to build!** All dependencies and structure included in the ZIP package.
