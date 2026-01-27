import { SiteData, RegulationResult, GDCRClause } from '@/types';
import gdcrRules from '@/lib/regulations/gdcr-2017.json';

export function calculateRegulations(siteData: SiteData): {
  result: RegulationResult;
  clauses: GDCRClause[];
} {
  const zoneRules = gdcrRules.zones[siteData.zone];
  const clauses: GDCRClause[] = [];

  // 1. Calculate FSI
  const fsi = calculateFSI(siteData, zoneRules);
  clauses.push({
    clauseNumber: gdcrRules.gdcrClauses.fsi,
    description: 'Floor Space Index regulations based on zone and road width',
    category: 'FSI',
  });

  // 2. Calculate Height
  const height = calculateHeight(siteData, zoneRules);
  clauses.push({
    clauseNumber: gdcrRules.gdcrClauses.height,
    description: 'Maximum permissible building height',
    category: 'Height',
  });

  // 3. Calculate Setbacks
  const setbacks = calculateSetbacks(siteData, zoneRules, height.max);
  clauses.push({
    clauseNumber: gdcrRules.gdcrClauses.setbacks,
    description: 'Mandatory setback distances from plot boundaries',
    category: 'Setbacks',
  });

  // 4. Ground Coverage
  const groundCoverage = calculateGroundCoverage(siteData, zoneRules);
  clauses.push({
    clauseNumber: gdcrRules.gdcrClauses.groundCoverage,
    description: 'Maximum ground floor coverage percentage',
    category: 'Ground Coverage',
  });

  // 5. Parking Requirements
  const parking = calculateParking(siteData, fsi.maxBuiltUpArea);
  clauses.push({
    clauseNumber: gdcrRules.gdcrClauses.parking,
    description: 'Parking space requirements in ECS units',
    category: 'Parking',
  });

  // 6. Structural Requirements
  const structural = getStructuralRequirements(siteData);
  clauses.push({
    clauseNumber: gdcrRules.gdcrClauses.structural,
    description: 'Structural specifications for plinth, floor, and parapet',
    category: 'Structural',
  });

  // 7. Fire Safety
  const fireSafety = getFireSafetyRequirements(height.max);
  clauses.push({
    clauseNumber: gdcrRules.gdcrClauses.fireSafety,
    description: 'Fire safety and emergency requirements',
    category: 'Fire Safety',
  });

  // 8. Accessibility
  const accessibility = getAccessibilityRequirements(height.max);
  clauses.push({
    clauseNumber: gdcrRules.gdcrClauses.accessibility,
    description: 'Universal accessibility standards',
    category: 'Accessibility',
  });

  return {
    result: {
      fsi,
      height,
      setbacks,
      groundCoverage,
      parking,
      structural,
      fireSafety,
      accessibility,
    },
    clauses,
  };
}

function calculateFSI(siteData: SiteData, zoneRules: any) {
  let baseFSI = zoneRules.baseFSI;
  let premium = 0;

  // Find premium based on road width
  const roadWidth = siteData.roadWidthPrimary;
  const premiumRule = zoneRules.fsiPremium.find(
    (rule: any) => roadWidth >= rule.roadWidth.min && roadWidth < rule.roadWidth.max
  );

  if (premiumRule) {
    premium = premiumRule.premium;
  }

  // Corner plot bonus
  if (siteData.isCornerPlot) {
    premium += gdcrRules.cornerPlotBonus.fsiBonus;
  }

  // Cap at max FSI
  const totalFSI = Math.min(baseFSI + premium, zoneRules.maxFSI);

  const maxBuiltUpArea = siteData.plotDimensions.area * totalFSI;

  const calculation = `
Base FSI (${siteData.zone}): ${baseFSI}
Road Width Premium (${roadWidth}m): +${premiumRule?.premium || 0}
${siteData.isCornerPlot ? `Corner Plot Bonus: +${gdcrRules.cornerPlotBonus.fsiBonus}` : ''}
Total FSI: ${totalFSI.toFixed(2)} (Max: ${zoneRules.maxFSI})

Maximum Built-up Area = Plot Area × FSI
= ${siteData.plotDimensions.area.toFixed(2)} sq.m × ${totalFSI.toFixed(2)}
= ${maxBuiltUpArea.toFixed(2)} sq.m
  `.trim();

  return {
    base: baseFSI,
    premium,
    total: totalFSI,
    maxBuiltUpArea,
    calculation,
  };
}

function calculateHeight(siteData: SiteData, zoneRules: any) {
  const roadWidth = siteData.roadWidthPrimary;

  // Find front setback for this road width
  const frontSetbackRule = zoneRules.setbacks.front.find(
    (rule: any) => roadWidth >= rule.roadWidth.min && roadWidth < rule.roadWidth.max
  );
  const frontSetback = frontSetbackRule?.setback || 3;

  // Formula: 2 × (Road Width + Front Setback)
  const calculatedHeight = 2 * (roadWidth + frontSetback);
  const maxHeight = Math.min(calculatedHeight, zoneRules.maxHeight);

  const formula = `2 × (Road Width + Front Setback)`;
  const calculation = `
Formula: ${formula}
= 2 × (${roadWidth}m + ${frontSetback}m)
= 2 × ${roadWidth + frontSetback}m
= ${calculatedHeight.toFixed(2)}m

Zone Maximum: ${zoneRules.maxHeight}m
Permissible Height: ${maxHeight.toFixed(2)}m (lower of calculated and zone max)
  `.trim();

  return {
    max: maxHeight,
    formula,
    zoneLimit: zoneRules.maxHeight,
    calculation,
  };
}

function calculateSetbacks(siteData: SiteData, zoneRules: any, buildingHeight: number) {
  const roadWidth = siteData.roadWidthPrimary;

  // Front setback
  const frontRule = zoneRules.setbacks.front.find(
    (rule: any) => roadWidth >= rule.roadWidth.min && roadWidth < rule.roadWidth.max
  );
  const front = frontRule?.setback || 3;

  // Side setback based on building height
  const sideRule = zoneRules.setbacks.side.find(
    (rule: any) => buildingHeight >= rule.height.min && buildingHeight < rule.height.max
  );
  const side = sideRule?.setback || 0;

  // Rear setback
  const rear = zoneRules.setbacks.rear;

  const calculations = `
Front Setback (Road Width ${roadWidth}m): ${front}m
Side Setback (Building Height ${buildingHeight.toFixed(2)}m): ${side}m
Rear Setback: ${rear}m

${siteData.isCornerPlot ? `Corner Plot: Front setback required on both road-facing sides` : ''}
  `.trim();

  return {
    front,
    side,
    rear,
    calculations,
  };
}

function calculateGroundCoverage(siteData: SiteData, zoneRules: any) {
  const maxPercentage = zoneRules.groundCoverage;
  const maxArea = (siteData.plotDimensions.area * maxPercentage) / 100;

  const calculation = `
Maximum Ground Coverage: ${maxPercentage}%
Plot Area: ${siteData.plotDimensions.area.toFixed(2)} sq.m

Maximum Ground Floor Area = Plot Area × Coverage %
= ${siteData.plotDimensions.area.toFixed(2)} sq.m × ${maxPercentage}%
= ${maxArea.toFixed(2)} sq.m
  `.trim();

  return {
    maxPercentage,
    maxArea,
    calculation,
  };
}

function calculateParking(siteData: SiteData, maxBuiltUpArea: number) {
  const parkingRules = gdcrRules.parking[siteData.intendedUse];
  const ecsArea = gdcrRules.parking.ecsArea;

  // Calculate required ECS
  const requiredECS =
    (maxBuiltUpArea / parkingRules.builtupUnit) * parkingRules.ecsPerBuiltup;
  const areaRequired = requiredECS * ecsArea;

  const calculation = `
Use Type: ${siteData.intendedUse}
Parking Norm: ${parkingRules.description}

Required ECS = (Built-up Area / ${parkingRules.builtupUnit}) × ${parkingRules.ecsPerBuiltup}
= (${maxBuiltUpArea.toFixed(2)} sq.m / ${parkingRules.builtupUnit}) × ${parkingRules.ecsPerBuiltup}
= ${requiredECS.toFixed(2)} ECS

Parking Area Required = ECS × ${ecsArea} sq.m
= ${requiredECS.toFixed(2)} × ${ecsArea} sq.m
= ${areaRequired.toFixed(2)} sq.m
  `.trim();

  return {
    required: Math.ceil(requiredECS),
    areaRequired,
    calculation,
  };
}

function getStructuralRequirements(siteData: SiteData) {
  const structural = gdcrRules.structural;
  const isCommercial = siteData.intendedUse.startsWith('Commercial');

  return {
    plinthHeight: structural.plinthHeight.max,
    floorHeight: isCommercial ? structural.floorHeight.commercial : structural.floorHeight.residential,
    parapet: structural.parapet.min,
  };
}

function getFireSafetyRequirements(buildingHeight: number) {
  const required = buildingHeight > gdcrRules.fireSafety.heightThreshold;

  return {
    required,
    requirements: required ? gdcrRules.fireSafety.requirements : ['Fire extinguisher on ground floor (recommended)'],
  };
}

function getAccessibilityRequirements(buildingHeight: number) {
  const liftRequired = buildingHeight > gdcrRules.accessibility.liftThreshold;
  const requirements = [...gdcrRules.accessibility.requirements];

  if (!liftRequired) {
    // Remove lift requirement if building is below threshold
    const liftIndex = requirements.findIndex(req => req.includes('Lift required'));
    if (liftIndex !== -1) {
      requirements[liftIndex] = 'Lift recommended for heights above 15m';
    }
  }

  return {
    rampRequired: gdcrRules.accessibility.rampRequired,
    liftRequired,
    requirements,
  };
}
