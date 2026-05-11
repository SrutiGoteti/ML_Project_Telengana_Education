// Diagnostic test to analyze score distribution
import { describe, it } from 'vitest';
import { predictRisk } from './mlEngine.js';
import { schoolsData } from '../data/schoolsData.js';

describe('Score distribution diagnostic', () => {
  it('prints distribution', () => {
    const results = schoolsData.map(s => predictRisk(s));
    const categories = { Low: 0, Moderate: 0, High: 0 };
    results.forEach(r => categories[r.category]++);
    console.log('Category distribution:', categories);

    const buckets = {};
    results.forEach(r => {
      const bucket = Math.floor(r.score / 10) * 10;
      buckets[bucket] = (buckets[bucket] || 0) + 1;
    });
    console.log('Score buckets:', Object.entries(buckets).sort((a,b) => a[0]-b[0]).map(([k,v]) => `${k}-${+k+9}: ${v}`).join(', '));

    const highScoreGoodSchools = schoolsData.filter(s => {
      const r = predictRisk(s);
      return r.score > 65 && s.attendance > 85 && s.dropout < 5;
    }).slice(0, 5);
    
    console.log('\nSample HIGH-score, GOOD-metric schools:');
    highScoreGoodSchools.forEach(s => {
      const r = predictRisk(s);
      console.log(`  att=${s.attendance.toFixed(1)} drop=${s.dropout.toFixed(1)} STR=${(s.students/s.teachers).toFixed(1)} infra=${r.infrastructureDeficit} => score=${r.score} cat=${r.category} conf=${r.confidence}`);
    });
  });
});
