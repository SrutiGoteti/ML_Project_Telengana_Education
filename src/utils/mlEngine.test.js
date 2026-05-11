import { describe, it, expect } from 'vitest';
import { predictRisk } from './mlEngine';
import { schoolsData } from '../data/schoolsData';

describe('mlEngine', () => {
  it('should accurately calculate STR from students/teachers when str field is absent', () => {
    const school = {
      id: "TS-HYD-1001",
      name: "Govt High School Hyderabad A1",
      district: "Hyderabad",
      students: 300,
      teachers: 10,
      attendance: 90,
      dropout: 2,
      facilities: {
        hasWater: true,
        hasGirlsToilet: true,
        hasElectricity: true,
        hasDigitalClass: true,
        hasKitchenShed: true,
        hasCompoundWall: true,
      }
    };

    // STR = 300/10 = 30 → "Optimal"
    const result = predictRisk(school);
    expect(result.featureImportance.pupilTeacherRatio).toBe("Optimal");
    expect(result.score).toBeLessThan(70);
  });

  it('should not penalize facilities that are undefined (only penalize explicit false)', () => {
    const school = {
      id: "TS-HYD-1002",
      name: "Govt High School Hyderabad A2",
      district: "Hyderabad",
      students: 300,
      teachers: 10,
      attendance: 90,
      dropout: 2,
      facilities: {
        hasWater: true,
        hasGirlsToilet: true,
        hasElectricity: true,
        hasDigitalClass: true,
        // hasKitchenShed and hasCompoundWall are NOT in data — should NOT count as false
      }
    };

    const result = predictRisk(school);
    // Infra score should be 0 — all known facilities are true, undefined ones are not penalized
    expect(result.infrastructureDeficit).toBe(0);
  });

  it('should penalize a school with all facilities explicitly false', () => {
    const school = {
      id: "TS-MUL-1003",
      name: "ZPHS Mulugu B3",
      district: "Mulugu",
      students: 200,
      teachers: 4,
      attendance: 60,
      dropout: 20,
      facilities: {
        hasWater: false,
        hasGirlsToilet: false,
        hasElectricity: false,
        hasDigitalClass: false,
        hasKitchenShed: false,
        hasCompoundWall: false,
      }
    };

    const result = predictRisk(school);
    // All infra missing = 40+20+15+10+10+5 = 100 points
    expect(result.infrastructureDeficit).toBe(100);
    expect(result.score).toBeGreaterThan(60);
    expect(result.category).toBe("High");
  });

  it('schoolsData should include hasKitchenShed and hasCompoundWall as explicit booleans', () => {
    const allHaveKitchenShed = schoolsData.every(s => typeof s.facilities.hasKitchenShed === 'boolean');
    const allHaveCompoundWall = schoolsData.every(s => typeof s.facilities.hasCompoundWall === 'boolean');
    expect(allHaveKitchenShed).toBe(true);
    expect(allHaveCompoundWall).toBe(true);
  });

  it('Critical Priority (score > 65) should be a realistic minority of schools (< 30%)', () => {
    const criticalCount = schoolsData.filter(s => predictRisk(s).score > 65).length;
    const criticalPct = criticalCount / schoolsData.length;
    expect(criticalPct).toBeLessThan(0.30);
  });
});
