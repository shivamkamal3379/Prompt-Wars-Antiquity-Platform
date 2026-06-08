import { describe, it, expect } from 'vitest';
import { calculateEmissions, getEmissionStatus } from '../emissionUtils';

describe('Carbon Emission Utility Calculations', () => {
  it('should calculate baseline emissions correctly with default zero inputs', () => {
    const zeroInputs = {
      electricity: 0,
      gas: 0,
      carDist: 0,
      carType: 'none',
      publicTransit: 0,
      flightsShort: 0,
      flightsLong: 0,
      diet: 'vegan'
    };

    const result = calculateEmissions(zeroInputs);
    
    expect(result.categories.energy).toBe(0);
    expect(result.categories.transport).toBe(0);
    expect(result.categories.flights).toBe(0);
    expect(result.categories.diet).toBe(1.5); // vegan baseline is 1.5 tons
    expect(result.total).toBe(1.5);
  });

  it('should calculate energy emissions correctly', () => {
    const inputs = {
      electricity: 500, // 500 kWh * 0.38 kg * 12 / 1000 = 2.28 tons
      gas: 300,        // 300 kWh * 0.18 kg * 12 / 1000 = 0.648 -> 0.65 tons
      carDist: 0,
      carType: 'none',
      publicTransit: 0,
      flightsShort: 0,
      flightsLong: 0,
      diet: 'vegan'
    };

    const result = calculateEmissions(inputs);
    expect(result.categories.energy).toBe(2.93); // 2.28 + 0.65
  });

  it('should calculate transport emissions accurately by fuel type', () => {
    const baseInputs = {
      electricity: 0,
      gas: 0,
      carDist: 1000, // 1000 km/month * 12 months = 12000 km/year
      publicTransit: 0,
      flightsShort: 0,
      flightsLong: 0,
      diet: 'vegan'
    };

    // Petrol: 12000 km * 0.17 kg / 1000 = 2.04 tons
    const petrolResult = calculateEmissions({ ...baseInputs, carType: 'petrol' });
    expect(petrolResult.categories.transport).toBe(2.04);

    // Hybrid: 12000 km * 0.10 kg / 1000 = 1.20 tons
    const hybridResult = calculateEmissions({ ...baseInputs, carType: 'hybrid' });
    expect(hybridResult.categories.transport).toBe(1.20);

    // Electric: 12000 km * 0.05 kg / 1000 = 0.60 tons
    const electricResult = calculateEmissions({ ...baseInputs, carType: 'electric' });
    expect(electricResult.categories.transport).toBe(0.60);
  });

  it('should calculate public transit emissions correctly', () => {
    const inputs = {
      electricity: 0,
      gas: 0,
      carDist: 0,
      carType: 'none',
      publicTransit: 50, // 50 hours * 1.4 kg * 12 / 1000 = 0.84 tons
      flightsShort: 0,
      flightsLong: 0,
      diet: 'vegan'
    };

    const result = calculateEmissions(inputs);
    expect(result.categories.transport).toBe(0.84);
  });

  it('should calculate aviation emissions for short and long haul flights', () => {
    const inputs = {
      electricity: 0,
      gas: 0,
      carDist: 0,
      carType: 'none',
      publicTransit: 0,
      flightsShort: 10, // 10 hours * 150 kg / 1000 = 1.5 tons
      flightsLong: 20,  // 20 hours * 110 kg / 1000 = 2.2 tons
      diet: 'vegan'
    };

    const result = calculateEmissions(inputs);
    expect(result.categories.flights).toBe(3.70); // 1.5 + 2.2
  });

  it('should return correct emission status categorizations', () => {
    // Excellent status (< 2.0 tons)
    const excellent = getEmissionStatus(1.8);
    expect(excellent.status).toBe('excellent');
    expect(excellent.strokeColor).toBe('#10b981');

    // Good status (< 4.5 tons)
    const good = getEmissionStatus(3.5);
    expect(good.status).toBe('good');
    expect(good.strokeColor).toBe('#34d399');

    // Moderate status (< 8.5 tons)
    const moderate = getEmissionStatus(6.0);
    expect(moderate.status).toBe('moderate');
    expect(moderate.strokeColor).toBe('#f59e0b');

    // High status (>= 8.5 tons)
    const high = getEmissionStatus(11.5);
    expect(high.status).toBe('high');
    expect(high.strokeColor).toBe('#ef4444');
  });
});
