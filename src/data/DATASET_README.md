# GM Vehicle Mock Dataset
## Best Deal Guidance Application

This package contains a comprehensive mock vehicle dataset with 40 realistic GM vehicles across all four brands: **Chevrolet**, **GMC**, **Cadillac**, and **Buick**.

---

## 📦 Package Contents

### 1. `vehicles_dataset.json`
Complete vehicle inventory with 40 vehicles including:
- **13 Chevrolet** vehicles (Tahoe, Silverado, Traverse, Equinox, Blazer)
- **12 GMC** vehicles (Yukon, Sierra, Acadia, Terrain)
- **8 Cadillac** vehicles (Escalade, XT5, XT6)
- **7 Buick** vehicles (Enclave, Encore GX, Envision)

### 2. `image_searches.json`
Curated list of search queries to find white-background studio images for each vehicle.

### 3. `generate_mock_data.py`
Python script to regenerate or customize the dataset.

---

## 🎨 Vehicle Images - White Background Only

### Image Requirements
All vehicle images should be:
- ✅ **White or transparent background** (no scenery, showrooms, or locations)
- ✅ **Studio-quality** product shots
- ✅ **3/4 front angle** preferred
- ✅ **Consistent lighting**
- ✅ **High resolution** (minimum 1200px width)

### Recommended Image Sources

#### Option 1: Official GM Media Sites
- **GM Media**: https://media.gm.com/
- **Chevrolet Media**: https://media.chevrolet.com/
- **GMC Media**: https://media.gmc.com/
- **Cadillac Media**: https://media.cadillac.com/
- **Buick Media**: https://media.buick.com/

These official sites often have press-quality images with white backgrounds.

#### Option 2: Manufacturer Configurators
Navigate to brand websites and use the vehicle configurator. Screenshot or download the configurator images which are typically on white backgrounds:
- https://www.chevrolet.com/
- https://www.gmc.com/
- https://www.cadillac.com/
- https://www.buick.com/

#### Option 3: Dealership Inventory Sites
Some dealership sites provide cutout images on white backgrounds:
- Cars.com (use "View all photos" → look for studio shots)
- Autotrader (filter by "Studio Photos")
- Individual dealership websites

#### Option 4: Stock Photo Services
Commercial stock photo sites with automotive sections:
- Shutterstock (search: "2024 [brand] [model] white background")
- Adobe Stock
- Getty Images

#### Option 5: Remove Background Tools
If you have good quality images with backgrounds, use AI tools to remove backgrounds:
- **Remove.bg** (https://remove.bg/) - Free for low-res
- **Adobe Photoshop** - Select Subject + Remove Background
- **Canva** - Background Remover (Pro feature)
- **Photopea** (free Photoshop alternative)

---

## 📁 Image Directory Structure

```
/images/
  /chevrolet/
    tahoe-white.jpg
    silverado-1500-white.jpg
    traverse-white.jpg
    equinox-white.jpg
    blazer-white.jpg
  /gmc/
    yukon-white.jpg
    sierra-1500-white.jpg
    acadia-white.jpg
    terrain-white.jpg
  /cadillac/
    escalade-white.jpg
    xt5-white.jpg
    xt6-white.jpg
  /buick/
    enclave-white.jpg
    encore-gx-white.jpg
    envision-white.jpg
```

### Image Search Queries (from `image_searches.json`)

Use these exact search queries to find appropriate white-background images:

**Chevrolet:**
- `2024 Chevrolet Tahoe white background studio`
- `2024 Chevrolet Silverado 1500 white background studio`
- `2024 Chevrolet Traverse white background studio`
- `2024 Chevrolet Equinox white background studio`
- `2024 Chevrolet Blazer white background studio`

**GMC:**
- `2024 GMC Yukon white background studio`
- `2024 GMC Sierra 1500 white background studio`
- `2024 GMC Acadia white background studio`
- `2024 GMC Terrain white background studio`

**Cadillac:**
- `2024 Cadillac Escalade white background studio`
- `2024 Cadillac XT5 white background studio`
- `2024 Cadillac XT6 white background studio`

**Buick:**
- `2024 Buick Enclave white background studio`
- `2024 Buick Encore GX white background studio`
- `2024 Buick Envision white background studio`

---

## 📊 Dataset Schema

Each vehicle object contains:

```json
{
  "vin": "1G1YYRS7P66EGSDXY",           // Valid-format VIN
  "stockNumber": "CH1000",               // Dealership stock number
  "brand": "Chevrolet",                  // Brand name
  "model": "Tahoe",                      // Model name
  "year": 2024,                          // Model year
  "trim": "Premier",                     // Trim level
  "type": "Full-Size SUV",               // Vehicle category
  "color": "Summit White",               // Exterior color
  "engine": "5.3L V8",                   // Engine specification
  "horsepower": 355,                     // Horsepower rating
  "mpg": "15/20",                        // City/Highway MPG
  "seating": 8,                          // Passenger capacity
  "drivetrain": "4WD",                   // Drive system
  "msrp": 63995,                         // Manufacturer's suggested price
  "invoice": 59200,                      // Dealer invoice price
  "targetPrice": 60638,                  // Recommended opening price
  "minimumPrice": 59700,                 // Floor price (invoice + $500)
  "incentives": 2372,                    // Available incentives ($)
  "daysOnLot": 23,                       // Days in inventory
  "inventoryDepth": 7,                   // Similar vehicles in stock
  "marketPosition": 4.7,                 // % vs competitors (+/-)
  "dealScore": 80,                       // Flexibility score (0-100)
  "flexibility": "high",                 // high | medium | low
  "imageUrl": "/images/chevrolet/tahoe-white.jpg",
  "status": "available"                  // Vehicle status
}
```

---

## 🎯 Deal Scoring Algorithm

The **dealScore** (0-100) is calculated based on:

### Factors:
1. **Days on Lot** (max +30 points)
   - 90+ days: +30
   - 60-89 days: +25
   - 45-59 days: +15
   - 30-44 days: +10

2. **Inventory Depth** (max +20 points)
   - 8+ similar vehicles: +20
   - 5-7 similar vehicles: +15
   - 3-4 similar vehicles: +10

3. **Incentives** (max +20 points)
   - $3000+: +20
   - $2000-2999: +15
   - $1000-1999: +10

4. **Market Position** (max +30 points)
   - -5% or better vs competitors: +30
   - -3% to -4.9%: +20
   - -1% to -2.9%: +10
   - 0% to 1%: +5

### Flexibility Levels:
- **High** (71-100): Maximum negotiation room
- **Medium** (41-70): Moderate flexibility
- **Low** (0-40): Limited room to negotiate

---

## 🔧 Customizing the Dataset

### Regenerate with Different Parameters

Edit `generate_mock_data.py` to customize:

```python
# Change number of vehicles per model
vehicles = generate_dataset()  # Currently 2-3 per model

# Adjust deal scoring factors
def calculate_deal_score(days, inventory, incentives, market):
    # Modify scoring logic here
    pass

# Add more vehicle models
VEHICLES = [
    # Add new vehicles here
    {"brand": "chevrolet", "model": "Colorado", ...}
]
```

Run the generator:
```bash
python3 generate_mock_data.py
```

---

## 💾 Integration with React App

### Loading the Dataset

**In your React app:**

```javascript
// src/data/mockVehicles.js
import vehiclesData from './vehicles_dataset.json';

export const vehicles = vehiclesData;

// Get vehicle by VIN
export const getVehicleByVIN = (vin) => {
  return vehicles.find(v => v.vin === vin);
};

// Get vehicles by brand
export const getVehiclesByBrand = (brand) => {
  return vehicles.filter(v => 
    v.brand.toLowerCase() === brand.toLowerCase()
  );
};

// Get high flexibility vehicles
export const getHighFlexibilityVehicles = () => {
  return vehicles.filter(v => v.flexibility === 'high');
};
```

### Using with Existing Services

Update your mock services:

```javascript
// src/services/vinService.js
import { getVehicleByVIN } from '../data/mockVehicles';

export const decodeVIN = async (vin) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const vehicle = getVehicleByVIN(vin);
      if (vehicle) {
        resolve(vehicle);
      } else {
        reject(new Error('VIN not found'));
      }
    }, 500);
  });
};
```

---

## 📸 Image Optimization Tips

### Recommended Image Specifications:
- **Format**: JPG for photos
- **Dimensions**: 1200x800px (3:2 aspect ratio)
- **File size**: < 200KB per image
- **Quality**: 80-85% JPEG quality
- **Naming**: lowercase, hyphenated (e.g., `tahoe-premier-white.jpg`)

### Batch Optimization:
Use tools like:
- **ImageMagick**: Command-line batch processing
- **TinyPNG/TinyJPG**: Online compression
- **Squoosh**: Web-based image optimization

```bash
# Example: ImageMagick batch resize
mogrify -resize 1200x800 -quality 85 *.jpg
```

---

## 📈 Dataset Statistics

### Current Dataset:
- **Total Vehicles**: 40
- **Brands**: 4 (Chevrolet, GMC, Cadillac, Buick)
- **Price Range**: $28,600 - $91,190 MSRP
- **Average Days on Lot**: ~45 days
- **Flexibility Distribution**:
  - High: ~40% (deals with strong negotiation potential)
  - Medium: ~45% (moderate flexibility)
  - Low: ~15% (limited negotiation room)

---

## 🚀 Quick Start

1. **Copy Dataset to Your App**:
   ```bash
   cp vehicles_dataset.json /path/to/your/app/src/data/
   ```

2. **Create Image Directory**:
   ```bash
   mkdir -p /path/to/your/app/public/images/{chevrolet,gmc,cadillac,buick}
   ```

3. **Download Images**:
   - Use search queries from `image_searches.json`
   - Download white-background images
   - Rename and place in appropriate folders

4. **Import in Your App**:
   ```javascript
   import vehicles from './data/vehicles_dataset.json';
   ```

5. **Start Building**! 🎉

---

## 🔍 VIN Format Reference

All VINs follow GM standards:

**Format**: `[WMI][VDS][Check][Year][Plant][Sequential]`

**Example**: `1G1YYRS7P66EGSDXY`
- `1G1` = Chevrolet USA
- `1GT` = GMC Truck
- `1GY` = Cadillac USA
- `5GA` = Buick USA
- `R` = 2024 model year

---

## 📞 Support

For questions about the dataset structure or integration:
- Review the style guide: `style-guide.html`
- Check the technical brief: `TECHNICAL_BRIEF.md`
- Refer to setup guide: `SETUP_GUIDE.md`

---

## ✨ Tips for Best Results

1. **Consistency**: Use the same photographer/studio angle for all images
2. **Lighting**: Match brightness levels across all vehicle images
3. **Scale**: Keep vehicles roughly the same size in frame
4. **Quality**: Don't mix high-res with low-res images
5. **Updates**: Replace placeholder images as you find better sources

---

**Last Updated**: February 2026  
**Dataset Version**: 1.0  
**Compatible With**: Best Deal Guidance React App v1.0
