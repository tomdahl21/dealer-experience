import vehiclesRaw from '../data/vehicles_lean.json';

const HIDDEN_BRANDS = ['Cadillac', 'Buick'];

const msrpRanges = {
	Tahoe: [52000, 72000],
	Suburban: [57000, 80000],
	'Silverado 1500': [36000, 66000],
	Equinox: [30000, 46000],
	Traverse: [36000, 55000],
	Colorado: [28000, 44000],
	Blazer: [34000, 52000],
	Trax: [22000, 32000],
	'Sierra 1500': [38000, 70000],
	Yukon: [56000, 82000],
	Canyon: [30000, 48000],
	Terrain: [32000, 50000],
	Acadia: [36000, 58000],
};

const colors = [
	'Summit White',
	'Black',
	'Sterling Gray',
	'Red Hot',
	'Deep Ocean Blue',
	'Iridescent Pearl',
	'Silver Ice',
];

const trimByModel = {
	Tahoe: 'Premier 4WD',
	Suburban: 'LT 4WD',
	'Silverado 1500': 'LTZ Crew Cab 4WD',
	Equinox: 'RS AWD',
	Traverse: 'High Country AWD',
	Colorado: 'Z71 Crew Cab',
	Blazer: 'RS AWD',
	Trax: '2RS FWD',
	'Sierra 1500': 'SLT Crew Cab 4WD',
	Yukon: 'Denali 4WD',
	Canyon: 'AT4 Crew Cab',
	Terrain: 'Denali AWD',
	Acadia: 'AT4 AWD',
};

const safetyFeatures = [
	'Automatic Emergency Braking',
	'Lane Keep Assist',
	'Forward Collision Alert',
	'Rear Cross Traffic Alert',
	'Blind Spot Monitoring',
	'Adaptive Cruise Control',
];

const keyFeatures = [
	'Heated Front Seats',
	'Wireless Apple CarPlay',
	'Remote Start',
	'Premium Audio',
	'Panoramic Sunroof',
	'360 Camera',
];

const hashVin = (vin) => {
	let hash = 0;
	for (let index = 0; index < vin.length; index += 1) {
		hash = (hash * 31 + vin.charCodeAt(index)) >>> 0;
	}
	return hash;
};

const getStudioImageUrl = (vehicle) => {
	const query = encodeURIComponent(
		`${vehicle.year} ${vehicle.brand} ${vehicle.model} studio white background car`
	);
	const signature = hashVin(vehicle.vin) % 1000;
	return `https://source.unsplash.com/1600x900/?${query}&sig=${signature}`;
};

const getFeatureSlice = (pool, vinHash, min, max) => {
	const count = min + (vinHash % (max - min + 1));
	const start = vinHash % pool.length;
	const selected = [];

	for (let index = 0; index < count; index += 1) {
		selected.push(pool[(start + index) % pool.length]);
	}

	return selected;
};

const enrichVehicle = (vehicle) => {
	const vinHash = hashVin(vehicle.vin);
	const studioImageUrl = getStudioImageUrl(vehicle);
	const [low, high] = msrpRanges[vehicle.model] || [30000, 55000];
	const msrp = low + Math.round(((vinHash % 1000) / 1000) * (high - low));
	const invoice = Math.round(msrp * 0.92);
	const incentives = 500 + (vinHash % 2500);
	const targetPrice = msrp - Math.round(incentives * 0.6);
	const minimumPrice = invoice + Math.round((targetPrice - invoice) * 0.4);
	const daysOnLot = 1 + (vinHash % 120);
	const mileage = 5 + (vinHash % 60);
	const color = colors[vinHash % colors.length];

	return {
		...vehicle,
		make: vehicle.brand,
		trim: trimByModel[vehicle.model] || 'Preferred',
		color,
		mileage,
		msrp,
		invoice,
		currentPrice: targetPrice + Math.round((msrp - targetPrice) * 0.35),
		targetPrice,
		minimumPrice,
		incentives,
		incentiveDetails: [
			{
				name: 'Factory-to-Dealer Cash',
				amount: Math.round(incentives * 0.7),
			},
			{
				name: 'Holdback',
				amount: Math.round(incentives * 0.3),
			},
		],
		similarInInventory: 3 + (vinHash % 14),
		marketPosition: -5 + (vinHash % 11),
		safetyFeatures: getFeatureSlice(safetyFeatures, vinHash, 3, 5),
		keyFeatures: getFeatureSlice(keyFeatures, vinHash + 3, 3, 5),
		image: studioImageUrl,
		images: [studioImageUrl],
		competitorInventory: 2 + (vinHash % 18),
		daysOnLot,
	};
};

const inventoryVehicles = vehiclesRaw
	.filter((vehicle) => !HIDDEN_BRANDS.includes(vehicle.brand))
	.map(enrichVehicle);

export const inventoryService = {
	getAllVehicles: () => inventoryVehicles,

	getVehicleByVIN: (vin) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				const vehicle = inventoryVehicles.find((entry) => entry.vin === vin);
				if (vehicle) {
					resolve(vehicle);
					return;
				}
				reject(new Error('Vehicle not found'));
			}, 250);
		});
	},
};
