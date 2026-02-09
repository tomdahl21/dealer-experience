# GM Best Deal Guidance - Web App

A tablet-optimized web application for GM dealership sales staff and managers.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## Demo Credentials

**Sales Person:**
- Email: `sarah@dealership.com`
- Password: `demo123`

**Manager:**
- Email: `mike@dealership.com`  
- Password: `demo123`

## Sample VINs for Testing

```
Chevrolet Tahoe:     1G1YY26E965105305
Chevrolet Silverado: 3GNAXKEV0PL123456
```

## Target Devices

- **Primary:** iPad (1024x768, 1366x1024)
- **Secondary:** Desktop browsers
- **Minimal:** Mobile phones

## Tech Stack

- React 18
- Material UI (MUI) v5
- React Router v6
- Zustand (state management)
- Vite (build tool)
- Recharts (data visualization)

## Features

### Sales Person View
- VIN scanning (camera + manual entry)
- Deal score calculation
- Pricing intelligence
- Conversation playbook
- Deal sweeteners menu
- Deal submission workflow

### Manager View
- Deal approval dashboard
- Team activity tracking
- Inventory management
- Flexibility score adjustment

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route pages
├── services/       # Mock services
├── store/          # Zustand stores
├── theme/          # MUI theming
├── utils/          # Utilities
└── data/           # Mock data
```

## Development

```bash
# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

Built files go to `dist/` directory. Deploy to:
- Netlify
- Vercel  
- AWS S3
- Any static hosting

## Browser Support

- ✅ Chrome 90+
- ✅ Safari 14+ (iOS/iPadOS)
- ✅ Edge 90+
- ⚠️ Firefox 88+

## Camera Access

Requires HTTPS in production for camera access. Development server works on localhost.

## Questions?

See TECHNICAL_BRIEF.md for complete documentation.

---

**Built by:** Slalom Consulting  
**Version:** 1.0.0 (POC/Demo)  
**Date:** February 2026
