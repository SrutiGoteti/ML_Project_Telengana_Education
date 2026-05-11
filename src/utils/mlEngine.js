import { RandomForestClassifier } from 'ml-random-forest';

const generateTrainingData = () => {
  const trainingSet = [];
  const predictions = [];

  for (let i = 0; i < 200; i++) {
    const attendance = 50 + Math.random() * 50;
    const dropout = Math.random() * 25;
    const str = 10 + Math.random() * 60;
    const infra = Math.random() * 100;
    trainingSet.push([attendance, dropout, str, infra]);

    if (attendance < 65 || dropout > 18 || str > 50 || infra > 70) {
      predictions.push(2);
    } else if (attendance < 80 || dropout > 10 || str > 35 || infra > 40) {
      predictions.push(1);
    } else {
      predictions.push(0);
    }
  }
  return { trainingSet, predictions };
};

const rf = new RandomForestClassifier({ seed: 42, nEstimators: 50 });
const { trainingSet, predictions } = generateTrainingData();
rf.train(trainingSet, predictions);

export const predictRisk = (school) => {
  const infraScore = calculateInfraScore(school.facilities);

  // FIX: Calculate STR from students/teachers if a pre-computed `str` field is absent.
  // Previously Number(school.str) || 0 would silently produce 0 for all schools
  // in the dataset (which store students/teachers, not a pre-computed STR).
  const calculatedStr =
    school.str !== undefined
      ? Number(school.str)
      : school.students && school.teachers
      ? school.students / school.teachers
      : 0;

  const input = [
    Number(school.attendance) || 0,
    Number(school.dropout) || 0,
    calculatedStr,
    Number(infraScore) || 0,
  ];

  const prediction = rf.predict([input])[0];
  const probs = rf.predictProbability([input])[0];

  // Handle various probability formats (Array vs Object)
  let confidence = 0;
  if (Array.isArray(probs)) {
    confidence = Math.max(...probs);
  } else if (probs && typeof probs === 'object') {
    confidence = Math.max(...Object.values(probs));
  }

  // Final safety check to prevent Infinity/NaN
  if (!isFinite(confidence)) confidence = 0.5;

  // Continuous Scoring Logic: Uses a weighted combination of prediction confidence and raw features
  // to ensure a smooth distribution (0-100) instead of hard-clustered bands.
  const rawFeatureWeight =
    input[3] * 0.4 + input[1] * 3 + (input[2] > 40 ? 20 : 0);
  let finalScore =
    prediction * 33 + confidence * 20 + rawFeatureWeight * 0.2;

  // Ensure score stays within 5-98 range for a professional look
  finalScore = Math.max(5, Math.min(98, finalScore));

  const categories = ['Low', 'Moderate', 'High'];
  return {
    score: Math.round(finalScore),
    category: categories[prediction] || 'Low',
    confidence: ((confidence || 0) * 100).toFixed(1),
    infrastructureDeficit: infraScore,
    studentDropoutRisk: calculateDVI(
      school.attendance,
      school.dropout,
      school.facilities?.hasGirlsToilet
    ),
    featureImportance: {
      attendanceStatus: school.attendance < 75 ? 'Low Attendance' : 'Stable',
      // FIX: Use the actual calculated STR, not school.str (which is undefined)
      pupilTeacherRatio: calculatedStr > 40 ? 'Overloaded' : 'Optimal',
      infrastructureStatus: infraScore > 50 ? 'Deficient' : 'Good',
    },
  };
};

const calculateDVI = (attendance, dropout, hasGirlsToilet) => {
  let score =
    (100 - (Number(attendance) || 0)) * 0.5 + (Number(dropout) || 0) * 0.3;
  // FIX: Only penalize when explicitly false, not when the field is undefined/missing
  if (hasGirlsToilet === false) score += 20;
  return Math.round(score);
};

const calculateInfraScore = (f) => {
  let score = 0;
  if (!f) return 50;
  // FIX: Use strict === false checks. Previously `!f.hasKitchenShed` would evaluate
  // `undefined` as truthy for the penalty — incorrectly adding 10-15 points to every
  // school that doesn't have those fields in the dataset. This was the root cause of
  // 600+ schools landing in "Critical Priority" with a floor score of ~70.
  if (f.hasGirlsToilet === false) score += 40;
  if (f.hasWater === false) score += 20;
  if (f.hasElectricity === false) score += 15;
  if (f.hasDigitalClass === false) score += 10;
  if (f.hasKitchenShed === false) score += 10;
  if (f.hasCompoundWall === false) score += 5;
  return score;
};
