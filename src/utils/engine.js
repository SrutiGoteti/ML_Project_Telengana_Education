export const calculateSTR = (students, teachers) => {
  if (!teachers || teachers === 0) return "0";
  return (students / teachers).toFixed(1);
};

export const calculateIDS = (facilities) => {
  let score = 0;
  if (!facilities.hasGirlsToilet) score += 40;
  if (!facilities.hasWater) score += 20;
  if (!facilities.hasElectricity) score += 15;
  if (!facilities.hasDigitalClass) score += 10;
  if (!facilities.hasKitchenShed) score += 10;
  if (!facilities.hasCompoundWall) score += 5;
  return score;
};

export const calculateDVI = (attendance, dropout, hasGirlsToilet) => {
  let score = (100 - attendance) * 0.5 + dropout * 0.3;
  if (!hasGirlsToilet) score += 20;
  return Math.round(score);
};

export const calculateCRS = (school) => {
  const str = parseFloat(calculateSTR(school.students, school.teachers));
  const ids = calculateIDS(school.facilities);
  const dvi = calculateDVI(school.attendance, school.dropout, school.facilities.hasGirlsToilet);
  
  // Normalize STR: 60 is considered max (very high risk)
  const normalizedSTR = Math.min((str / 60) * 100, 100);
  
  // Weighted Average
  const totalScore = Math.round(normalizedSTR * 0.2 + ids * 0.4 + dvi * 0.4);
  
  let category = "Low";
  if (totalScore > 65) category = "High";
  else if (totalScore > 35) category = "Moderate";
  
  return {
    score: totalScore,
    category
  };
};
