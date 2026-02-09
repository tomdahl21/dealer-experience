import vehicles from '../data/vehicles.json';

export const vinService = {
  decodeVIN: (vin) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const vehicle = vehicles.find(v => v.vin === vin);
        if (vehicle) {
          resolve(vehicle);
        } else {
          reject(new Error('Vehicle not found'));
        }
      }, 800);
    });
  },
};
