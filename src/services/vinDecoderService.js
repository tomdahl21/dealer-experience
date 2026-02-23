/**
 * VIN Decoder Service
 * Decodes VINs using the NHTSA vPIC API (https://vpic.nhtsa.dot.gov/api/)
 */

const NHTSA_API_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles';

class VinDecoderService {
  /**
   * Decode a VIN and return detailed vehicle information
   * @param {string} vin - The VIN to decode
   * @returns {Promise<Object>} Vehicle information from NHTSA API
   */
  async decodeVin(vin) {
    if (!vin || vin.length !== 17) {
      throw new Error('Invalid VIN: Must be 17 characters');
    }

    try {
      // Use DecodeVinExtended endpoint for comprehensive vehicle data
      const url = `${NHTSA_API_BASE}/DecodeVinExtended/${vin}?format=json`;
      
      console.log('Fetching VIN data from NHTSA API:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Check if API returned results
      if (!data.Results || data.Results.length === 0) {
        throw new Error('Unable to decode VIN. Please verify the VIN is correct.');
      }

      // Extract and format the vehicle information
      const vehicleInfo = this.formatVehicleData(data.Results);
      
      // Check if decoding was successful
      if (!vehicleInfo.year || !vehicleInfo.make || !vehicleInfo.model) {
        throw new Error('Unable to decode VIN. Please verify the VIN is correct.');
      }

      return vehicleInfo;
    } catch (err) {
      console.error('Error decoding VIN:', err);
      throw err;
    }
  }

  /**
   * Format raw API response into a structured vehicle object
   * @param {Array} results - Array of results from NHTSA API
   * @returns {Object} Formatted vehicle information
   */
  formatVehicleData(results) {
    // Convert array of {Variable, Value} objects to a key-value map
    const data = {};
    if (Array.isArray(results)) {
      results.forEach(item => {
        if (item.Variable && item.Value) {
          data[item.Variable] = item.Value;
        }
      });
    }

    // Extract key information from decoded VIN
    return {
      year: data['Model Year'] || data['Year'],
      make: data['Make'] || 'Unknown',
      model: data['Model'] || 'Unknown',
      bodyClass: data['Body Class'] || '',
      bodyStyle: data['Body Style'] || '',
      engineType: data['Engine Type'] || '',
      engineDisplacement: data['Displacement (CC)'] || '',
      transmission: data['Transmission Type'] || '',
      driveType: data['Drive Type'] || '',
      fuelType: data['Fuel Type - Primary'] || '',
      seatingCapacity: data['Seating Capacity'] || '',
      doors: data['Doors'] || '',
      vin: data['VIN'] || '',
      plantCountry: data['Plant Country'] || '',
      // Store all data for reference
      allData: data,
    };
  }

  /**
   * Format vehicle info into a display-friendly string
   * @param {Object} vehicleInfo - Vehicle information object
   * @returns {string} Formatted vehicle description
   */
  formatVehicleDescription(vehicleInfo) {
    const parts = [
      vehicleInfo.year,
      vehicleInfo.make,
      vehicleInfo.model,
      vehicleInfo.bodyClass,
    ].filter(Boolean);
    
    return parts.join(' ');
  }
}

// Export singleton instance
export const vinDecoderService = new VinDecoderService();
