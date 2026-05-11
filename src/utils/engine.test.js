import { describe, it, expect } from 'vitest';
import { calculateSTR, calculateIDS, calculateDVI, calculateCRS } from './engine';

describe('School Analytics Engine', () => {
  
  it('calculateSTR: should return correct student-teacher ratio', () => {
    expect(calculateSTR(300, 10)).toBe("30.0");
    expect(calculateSTR(450, 8)).toBe("56.3");
  });

  it('calculateSTR: should handle zero teachers gracefully', () => {
    expect(calculateSTR(100, 0)).toBe("0");
  });

  it('calculateIDS: should calculate correct infrastructure deficit score', () => {
    const facilities = {
      hasWater: 0,
      hasGirlsToilet: 0,
      hasElectricity: 1,
      hasDigitalClass: 1,
      hasKitchenShed: 1,
      hasCompoundWall: 1
    };
    // (1-0)*20 + (1-0)*40 = 60
    expect(calculateIDS(facilities)).toBe(60);
  });

  it('calculateIDS: should return 0 for perfect facilities', () => {
    const perfect = {
      hasWater: 1, hasGirlsToilet: 1, hasElectricity: 1, 
      hasDigitalClass: 1, hasKitchenShed: 1, hasCompoundWall: 1
    };
    expect(calculateIDS(perfect)).toBe(0);
  });

  it('calculateDVI: should calculate dropout vulnerability index', () => {
    // (100 - 80)*0.5 + (10)*0.3 + 0 = 10 + 3 = 13
    expect(calculateDVI(80, 10, true)).toBe(13);
    
    // (100 - 50)*0.5 + (20)*0.3 + 20 = 25 + 6 + 20 = 51
    expect(calculateDVI(50, 20, false)).toBe(51);
  });

  it('calculateCRS: should return the composite risk score and category', () => {
    const school = {
      students: 400,
      teachers: 5,
      attendance: 60,
      dropout: 15,
      facilities: { hasWater: 0, hasGirlsToilet: 0, hasElectricity: 1, hasDigitalClass: 0 }
    };
    const result = calculateCRS(school);
    expect(result.score).toBeGreaterThan(60);
    expect(result.category).toBe('High');
  });

});
