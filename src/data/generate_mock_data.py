#!/usr/bin/env python3
"""
Generate Mock Vehicle Dataset for Best Deal Guidance App
Includes realistic vehicle data for Chevrolet, GMC, Cadillac, and Buick
with white background studio images
"""

import json
import random
from datetime import datetime, timedelta

def generate_vin(brand_code, model_code, year="2024"):
    """Generate realistic-looking VIN following GM standards"""
    brand_codes = {
        "chevrolet": "1G1",
        "gmc": "1GT",
        "cadillac": "1GY",
        "buick": "5GA"
    }
    
    year_codes = {"2023": "P", "2024": "R", "2025": "S"}
    chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789"
    
    prefix = brand_codes.get(brand_code, "1G1")
    year_code = year_codes.get(str(year), "R")
    suffix = ''.join(random.choice(chars) for _ in range(11))
    
    return f"{prefix}{model_code}{year_code}{suffix}"

def calculate_days_on_lot():
    """Generate realistic days on lot"""
    options = [
        (range(5, 15), 10),
        (range(15, 30), 25),
        (range(30, 60), 35),
        (range(60, 90), 20),
        (range(90, 180), 10),
    ]
    
    selected_range = random.choices(
        [r for r, _ in options],
        weights=[w for _, w in options]
    )[0]
    
    return random.choice(list(selected_range))

def calculate_deal_score(days_on_lot, inventory_depth, incentives, market_position):
    """Calculate deal flexibility score (0-100)"""
    score = 50
    
    if days_on_lot >= 90:
        score += 30
    elif days_on_lot >= 60:
        score += 25
    elif days_on_lot >= 45:
        score += 15
    elif days_on_lot >= 30:
        score += 10
    
    if inventory_depth >= 8:
        score += 20
    elif inventory_depth >= 5:
        score += 15
    elif inventory_depth >= 3:
        score += 10
    
    if incentives >= 3000:
        score += 20
    elif incentives >= 2000:
        score += 15
    elif incentives >= 1000:
        score += 10
    
    if market_position <= -5:
        score += 30
    elif market_position <= -3:
        score += 20
    elif market_position <= -1:
        score += 10
    elif market_position <= 1:
        score += 5
    
    return min(100, score)

# Simplified vehicle catalog
VEHICLES = [
    # Chevrolet
    {"brand": "chevrolet", "model": "Tahoe", "trim": "Premier", "msrp": 63995, "invoice": 59200, "type": "Full-Size SUV", "engine": "5.3L V8", "hp": 355, "mpg": "15/20", "seats": 8, "drive": "4WD", "code": "YY"},
    {"brand": "chevrolet", "model": "Silverado 1500", "trim": "LTZ", "msrp": 58995, "invoice": 54500, "type": "Full-Size Pickup", "engine": "5.3L V8", "hp": 355, "mpg": "17/23", "seats": 6, "drive": "4WD", "code": "AK"},
    {"brand": "chevrolet", "model": "Traverse", "trim": "Premier", "msrp": 48500, "invoice": 44800, "type": "Midsize SUV", "engine": "2.5L Turbo I4", "hp": 328, "mpg": "20/26", "seats": 8, "drive": "AWD", "code": "EV"},
    {"brand": "chevrolet", "model": "Equinox", "trim": "Premier", "msrp": 37200, "invoice": 34300, "type": "Compact SUV", "engine": "1.5L Turbo I4", "hp": 175, "mpg": "26/31", "seats": 5, "drive": "AWD", "code": "XL"},
    {"brand": "chevrolet", "model": "Blazer", "trim": "RS", "msrp": 44500, "invoice": 41100, "type": "Midsize SUV", "engine": "2.0L Turbo I4", "hp": 228, "mpg": "22/29", "seats": 5, "drive": "AWD", "code": "BL"},
    
    # GMC
    {"brand": "gmc", "model": "Yukon", "trim": "Denali", "msrp": 79500, "invoice": 73500, "type": "Full-Size SUV", "engine": "5.3L V8", "hp": 355, "mpg": "15/20", "seats": 8, "drive": "4WD", "code": "YK"},
    {"brand": "gmc", "model": "Sierra 1500", "trim": "Denali", "msrp": 68900, "invoice": 63700, "type": "Full-Size Pickup", "engine": "5.3L V8", "hp": 355, "mpg": "17/23", "seats": 6, "drive": "4WD", "code": "SR"},
    {"brand": "gmc", "model": "Acadia", "trim": "Denali", "msrp": 53800, "invoice": 49700, "type": "Midsize SUV", "engine": "2.5L Turbo I4", "hp": 328, "mpg": "21/27", "seats": 7, "drive": "AWD", "code": "AC"},
    {"brand": "gmc", "model": "Terrain", "trim": "Denali", "msrp": 42100, "invoice": 38900, "type": "Compact SUV", "engine": "1.5L Turbo I4", "hp": 175, "mpg": "26/30", "seats": 5, "drive": "AWD", "code": "TR"},
    
    # Cadillac
    {"brand": "cadillac", "model": "Escalade", "trim": "Premium Luxury", "msrp": 91190, "invoice": 84300, "type": "Full-Size Luxury SUV", "engine": "6.2L V8", "hp": 420, "mpg": "14/19", "seats": 8, "drive": "4WD", "code": "ES"},
    {"brand": "cadillac", "model": "XT5", "trim": "Premium Luxury", "msrp": 53690, "invoice": 49600, "type": "Midsize Luxury SUV", "engine": "2.0L Turbo I4", "hp": 237, "mpg": "21/28", "seats": 5, "drive": "AWD", "code": "XT"},
    {"brand": "cadillac", "model": "XT6", "trim": "Sport", "msrp": 61890, "invoice": 57200, "type": "Midsize Luxury SUV", "engine": "3.6L V6", "hp": 310, "mpg": "18/25", "seats": 7, "drive": "AWD", "code": "X6"},
    
    # Buick
    {"brand": "buick", "model": "Enclave", "trim": "Avenir", "msrp": 57200, "invoice": 52900, "type": "Midsize SUV", "engine": "3.6L V6", "hp": 310, "mpg": "18/25", "seats": 7, "drive": "AWD", "code": "EN"},
    {"brand": "buick", "model": "Encore GX", "trim": "Avenir", "msrp": 34900, "invoice": 32200, "type": "Compact SUV", "engine": "1.3L Turbo I3", "hp": 155, "mpg": "29/32", "seats": 5, "drive": "AWD", "code": "EG"},
    {"brand": "buick", "model": "Envision", "trim": "Avenir", "msrp": 46300, "invoice": 42800, "type": "Compact SUV", "engine": "2.0L Turbo I4", "hp": 228, "mpg": "22/29", "seats": 5, "drive": "AWD", "code": "EV"},
]

COLORS = {
    "chevrolet": ["Summit White", "Black", "Silver Ice Metallic", "Cherry Red Tintcoat"],
    "gmc": ["Summit White", "Onyx Black", "Satin Steel Metallic", "Cayenne Red Tintcoat"],
    "cadillac": ["Crystal White Tricoat", "Black Raven", "Argent Silver Metallic"],
    "buick": ["White Frost Tricoat", "Ebony Twilight Metallic", "Quicksilver Metallic"]
}

def generate_dataset():
    """Generate complete dataset"""
    vehicles = []
    stock = 1000
    
    # Generate 2-3 instances of each vehicle
    for base_vehicle in VEHICLES:
        for i in range(random.randint(2, 3)):
            days = calculate_days_on_lot()
            inventory = random.randint(2, 10)
            incentives = random.randint(1500, 4000)
            market = round(random.uniform(-8, 5), 1)
            
            score = calculate_deal_score(days, inventory, incentives, market)
            flex = "high" if score >= 71 else ("medium" if score >= 41 else "low")
            
            target = base_vehicle["invoice"] + (base_vehicle["msrp"] - base_vehicle["invoice"]) * 0.3
            min_price = base_vehicle["invoice"] + 500
            
            vehicle = {
                "vin": generate_vin(base_vehicle["brand"], base_vehicle["code"]),
                "stockNumber": f"{base_vehicle['brand'][:2].upper()}{stock}",
                "brand": base_vehicle["brand"].title(),
                "model": base_vehicle["model"],
                "year": 2024,
                "trim": base_vehicle["trim"],
                "type": base_vehicle["type"],
                "color": random.choice(COLORS[base_vehicle["brand"]]),
                "engine": base_vehicle["engine"],
                "horsepower": base_vehicle["hp"],
                "mpg": base_vehicle["mpg"],
                "seating": base_vehicle["seats"],
                "drivetrain": base_vehicle["drive"],
                "msrp": base_vehicle["msrp"],
                "invoice": base_vehicle["invoice"],
                "targetPrice": int(target),
                "minimumPrice": int(min_price),
                "incentives": incentives,
                "daysOnLot": days,
                "inventoryDepth": inventory,
                "marketPosition": market,
                "dealScore": score,
                "flexibility": flex,
                "imageUrl": f"/images/{base_vehicle['brand']}/{base_vehicle['model'].replace(' ', '-').lower()}-white.jpg",
                "status": "available"
            }
            
            vehicles.append(vehicle)
            stock += 1
    
    return vehicles

# Run
vehicles = generate_dataset()

# Save
with open('vehicles_dataset.json', 'w') as f:
    json.dump(vehicles, f, indent=2)

# Create image search list
image_searches = []
for v in vehicles:
    query = f"2024 {v['brand']} {v['model']} white background studio"
    image_searches.append({
        "query": query,
        "vehicle": f"{v['year']} {v['brand']} {v['model']} {v['trim']}",
        "save_as": v["imageUrl"]
    })

with open('image_searches.json', 'w') as f:
    json.dump(image_searches, f, indent=2)

print(f"✓ Generated {len(vehicles)} vehicles")
print(f"✓ Brands: Chevrolet={sum(1 for v in vehicles if v['brand']=='Chevrolet')}, GMC={sum(1 for v in vehicles if v['brand']=='Gmc')}, Cadillac={sum(1 for v in vehicles if v['brand']=='Cadillac')}, Buick={sum(1 for v in vehicles if v['brand']=='Buick')}")
print(f"✓ Flexibility: High={sum(1 for v in vehicles if v['flexibility']=='high')}, Medium={sum(1 for v in vehicles if v['flexibility']=='medium')}, Low={sum(1 for v in vehicles if v['flexibility']=='low')}")
print(f"✓ Saved vehicles_dataset.json and image_searches.json")
