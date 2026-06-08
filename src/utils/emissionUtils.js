// Scientific carbon emission calculation multipliers (DEFRA/EPA averages)
// All outputs are in metric tons of CO2 per year (t CO2e/yr)

export const EMISSION_FACTORS = {
  // kg CO2 per kWh
  electricity: 0.38,
  gas: 0.18,
  
  // kg CO2 per km
  car: {
    petrol: 0.17,
    diesel: 0.19,
    hybrid: 0.10,
    electric: 0.05,
    none: 0
  },

  // kg CO2 per hour of public transit (assuming average speed of 35 km/h @ 0.04 kg CO2/km)
  publicTransitPerHour: 35 * 0.04, // 1.4 kg CO2/hour

  // kg CO2 per flight hour
  flights: {
    shortHaul: 150, // Short haul is less fuel efficient per km due to takeoff/landing
    longHaul: 110
  },

  // Annual tons of CO2 per diet type
  diet: {
    vegan: 1.5,
    vegetarian: 1.7,
    pescatarian: 1.9,
    averageMeat: 2.5,
    heavyMeat: 3.3
  }
};

export const BENCHMARKS = {
  globalAverage: 4.7,
  target: 2.0,      // IPCC target to limit warming to 1.5°C
  usAverage: 14.5,
  europeAverage: 6.5
};

/**
 * Calculates annual emissions in metric tons of CO2 for each category
 * @param {Object} inputs 
 * @returns {Object} { categories: { energy, transport, flights, diet }, total: number }
 */
export function calculateEmissions(inputs) {
  const {
    electricity = 0, // monthly kWh
    gas = 0,         // monthly kWh
    carDist = 0,     // monthly km
    carType = 'none',// fuel type
    publicTransit = 0, // monthly hours
    flightsShort = 0,// annual hours
    flightsLong = 0, // annual hours
    diet = 'averageMeat'
  } = inputs;

  // 1. Energy (Electricity + Gas)
  // Monthly to annual: * 12. Convert kg to metric tons: / 1000.
  const electricityTons = (electricity * EMISSION_FACTORS.electricity * 12) / 1000;
  const gasTons = (gas * EMISSION_FACTORS.gas * 12) / 1000;
  const energyTotal = electricityTons + gasTons;

  // 2. Transport (Car + Public Transit)
  const carFactor = EMISSION_FACTORS.car[carType] || 0;
  const carTons = (carDist * carFactor * 12) / 1000;
  const transitTons = (publicTransit * EMISSION_FACTORS.publicTransitPerHour * 12) / 1000;
  const transportTotal = carTons + transitTons;

  // 3. Flights (Short + Long)
  // Flight inputs are already annual hours
  const flightsShortTons = (flightsShort * EMISSION_FACTORS.flights.shortHaul) / 1000;
  const flightsLongTons = (flightsLong * EMISSION_FACTORS.flights.longHaul) / 1000;
  const flightsTotal = flightsShortTons + flightsLongTons;

  // 4. Diet
  // Already in annual tons
  const dietTotal = EMISSION_FACTORS.diet[diet] || EMISSION_FACTORS.diet.averageMeat;

  // Totals
  const total = energyTotal + transportTotal + flightsTotal + dietTotal;

  return {
    categories: {
      energy: Number(energyTotal.toFixed(2)),
      transport: Number(transportTotal.toFixed(2)),
      flights: Number(flightsTotal.toFixed(2)),
      diet: Number(dietTotal.toFixed(2))
    },
    breakdown: {
      electricity: Number(electricityTons.toFixed(2)),
      gas: Number(gasTons.toFixed(2)),
      car: Number(carTons.toFixed(2)),
      transit: Number(transitTons.toFixed(2)),
      flightsShort: Number(flightsShortTons.toFixed(2)),
      flightsLong: Number(flightsLongTons.toFixed(2)),
    },
    total: Number(total.toFixed(2))
  };
}

/**
 * Gets feedback and color level based on total emissions
 * @param {number} total Tons CO2/year
 * @returns {Object} { status: 'low' | 'moderate' | 'high', color: string, text: string }
 */
export function getEmissionStatus(total) {
  if (total < BENCHMARKS.target) {
    return {
      status: 'excellent',
      color: 'text-eco-400 bg-eco-500/10 border-eco-500/30',
      strokeColor: '#10b981', // green
      badge: 'Eco Champion',
      description: 'Your footprint matches global climate stability goals. Outstanding job!'
    };
  } else if (total < 4.5) {
    return {
      status: 'good',
      color: 'text-eco-300 bg-eco-600/5 border-eco-500/20',
      strokeColor: '#34d399', // light green
      badge: 'Conscious citizen',
      description: 'You are below the global average. A few more tweaks will put you at the target.'
    };
  } else if (total < 8.5) {
    return {
      status: 'moderate',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      strokeColor: '#f59e0b', // amber
      badge: 'Average Footprint',
      description: 'Your emissions are typical. Check out the AI suggestions to start cutting down.'
    };
  } else {
    return {
      status: 'high',
      color: 'text-red-400 bg-red-500/10 border-red-500/30',
      strokeColor: '#ef4444', // red
      badge: 'High Impact',
      description: 'Your carbon footprint is high. Swapping transport habits or energy sources will make a huge difference.'
    };
  }
}
