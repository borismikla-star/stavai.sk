/**
 * Developer Calculator — Calculation Engine
 * Ported from estivo.io / borismikla-star
 */

export function calculateIRR(cashFlows, guess = 0.1) {
  const maxIterations = 100;
  const tolerance = 0.00001;
  const epsilon = 1e-10;
  const hasPositive = cashFlows.some(cf => cf > 0);
  const hasNegative = cashFlows.some(cf => cf < 0);
  if (!hasPositive || !hasNegative) return null;
  let rate = guess;
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0, dnpv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      const denom = Math.pow(1 + rate, t);
      npv += cashFlows[t] / denom;
      dnpv -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
    }
    if (Math.abs(dnpv) < epsilon) break;
    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < tolerance) return isFinite(newRate) ? newRate * 100 : null;
    rate = newRate;
  }
  return null;
}

const n = (v) => { const p = Number(v); return isNaN(p) ? 0 : p; };

export function calculateDevelopment(d) {
  // ── AREAS ──
  const gfaAbove = n(d.gfa_above);
  const gfaBelow = n(d.gfa_below);
  const salesAreaApts = n(d.sales_area_apartments);
  const salesAreaNonRes = n(d.sales_area_non_residential);
  const salesAreaBalconies = n(d.sales_area_balconies);
  const salesAreaGardens = n(d.sales_area_gardens);
  const basementArea = n(d.basement_area);
  const pavedAreas = n(d.paved_areas);
  const greenTerrain = n(d.green_areas_terrain);
  const greenStructure = n(d.green_areas_structure);
  const parkingIndoorCount = n(d.parking_indoor_count);
  const parkingOutdoorCount = n(d.parking_outdoor_count);
  const totalSalesArea = salesAreaApts + salesAreaNonRes + salesAreaBalconies + salesAreaGardens + basementArea;

  // ── COSTS ──
  const landAndProject = n(d.land_and_project);

  const costItem = (prefix, area) =>
    d[`${prefix}_manual`] ? n(d[`${prefix}_manual_value`]) : area * n(d[`${prefix}_unit_price`]);

  const aboveGroundCost = costItem('above_ground', gfaAbove);
  const belowGroundCost = costItem('below_ground', gfaBelow);
  const outdoorAreasCost = costItem('outdoor_areas', pavedAreas);
  const greeneryTerrainCost = costItem('greenery_terrain', greenTerrain);
  const greeneryStructureCost = costItem('greenery_structure', greenStructure);
  const implementationSubtotal = aboveGroundCost + belowGroundCost + outdoorAreasCost + greeneryTerrainCost + greeneryStructureCost;

  const engineeringNetworks = d.engineering_networks_manual
    ? n(d.engineering_networks_manual_value)
    : implementationSubtotal * 0.04;
  const totalImplementation = implementationSubtotal + engineeringNetworks;

  // Additional budget (% of implementation)
  const projectManagement = d.project_management_manual ? n(d.project_management_manual_value) : totalImplementation * 0.035;
  const siteEquipment = d.site_equipment_manual ? n(d.site_equipment_manual_value) : totalImplementation * 0.03;
  const projectActivity = d.project_activity_manual ? n(d.project_activity_manual_value) : totalImplementation * 0.035;
  const engineeringActivity = d.engineering_activity_manual ? n(d.engineering_activity_manual_value) : totalImplementation * 0.01;
  const technicalSupervision = d.technical_supervision_manual ? n(d.technical_supervision_manual_value) : totalImplementation * 0.015;
  const totalAdditionalBudget = projectManagement + siteEquipment + projectActivity + engineeringActivity + technicalSupervision;

  // ── REVENUE ──
  const apartmentsRevenue = salesAreaApts * n(d.apartments_unit_price);
  const nonResRevenue = salesAreaNonRes * n(d.non_residential_unit_price);
  const parkingIndoorRevenue = parkingIndoorCount * n(d.parking_indoor_unit_price);
  const parkingOutdoorRevenue = parkingOutdoorCount * n(d.parking_outdoor_unit_price);
  const balconiesRevenue = salesAreaBalconies * n(d.balconies_unit_price);
  const gardensRevenue = salesAreaGardens * n(d.gardens_unit_price);
  const basementsRevenue = basementArea * n(d.basements_unit_price);
  const otherRevenue = n(d.other_revenue);
  const totalGrossRevenue = apartmentsRevenue + nonResRevenue + parkingIndoorRevenue + parkingOutdoorRevenue + balconiesRevenue + gardensRevenue + basementsRevenue + otherRevenue;

  // Sales & marketing as % of revenue
  const salesCosts = d.sales_costs_manual ? n(d.sales_costs_manual_value) : totalGrossRevenue * 0.02;
  const marketingCosts = d.marketing_costs_manual ? n(d.marketing_costs_manual_value) : totalGrossRevenue * 0.008;

  // Other services
  const legalServices = d.legal_services_manual ? n(d.legal_services_manual_value) : totalImplementation * 0.005;
  const developmentFee = d.development_fee_manual ? n(d.development_fee_manual_value) : totalSalesArea * n(d.development_fee_per_m2);
  const otherFees = d.other_fees_manual ? n(d.other_fees_manual_value) : implementationSubtotal * 0.01;
  const totalOtherServices = legalServices + developmentFee + otherFees;

  const reserve = d.reserve_manual ? n(d.reserve_manual_value) : totalImplementation * 0.05;

  const totalCostsNet = landAndProject + totalImplementation + totalAdditionalBudget + salesCosts + marketingCosts + totalOtherServices + reserve;

  // ── FINANCING ──
  const ownResourcesPct = n(d.own_resources_percent) || 30;
  const bankInterestPct = n(d.bank_interest_percent) || 6;
  const projectDurationMonths = n(d.project_duration_months) || 36;
  const projectDurationYears = projectDurationMonths / 12;

  const ownResources = totalCostsNet * (ownResourcesPct / 100);
  const bankResources = totalCostsNet * ((100 - ownResourcesPct) / 100);
  const bankFees = bankResources * 0.002;
  const bankInterest = bankResources * (bankInterestPct / 100) * projectDurationYears;
  const ownResourcesInterestCost = ownResourcesPct < 100 ? ownResources * 0.03 * projectDurationYears : 0;
  const totalFinancingCosts = bankFees + bankInterest + ownResourcesInterestCost;

  const totalProjectCosts = totalCostsNet + totalFinancingCosts;

  // ── KPIs ──
  const grossProfit = totalGrossRevenue - totalProjectCosts;
  const profitMargin = totalGrossRevenue > 0 ? (grossProfit / totalGrossRevenue) * 100 : 0;
  const developerMargin = totalProjectCosts > 0 ? (grossProfit / totalProjectCosts) * 100 : 0;
  const equityMultiple = ownResources > 0 ? (ownResources + grossProfit) / ownResources : 0;
  const annualizedReturn = ownResources > 0 && projectDurationYears > 0
    ? (Math.pow(equityMultiple, 1 / projectDurationYears) - 1) * 100
    : 0;

  // IRR — yearly cashflows simplified
  const yearlyCF = Array.from({ length: Math.ceil(projectDurationYears) + 1 }, (_, y) => {
    if (y === 0) return -ownResources;
    if (y < Math.ceil(projectDurationYears)) return 0;
    return ownResources + grossProfit;
  });
  const irr = calculateIRR(yearlyCF);

  const costPerM2 = totalSalesArea > 0 ? totalProjectCosts / totalSalesArea : 0;
  const revenuePerM2 = totalSalesArea > 0 ? totalGrossRevenue / totalSalesArea : 0;
  const profitPerM2 = totalSalesArea > 0 ? grossProfit / totalSalesArea : 0;
  const breakEvenRevenue = totalProjectCosts;
  const breakEvenPct = totalGrossRevenue > 0 ? (breakEvenRevenue / totalGrossRevenue) * 100 : 0;
  const dscr = bankInterest > 0 ? grossProfit / bankInterest : null;

  // ── CASHFLOW TIMELINE (monthly) ──
  const constPhaseEnd = Math.floor(projectDurationMonths * 0.75);
  const salesStart = n(d.sales_start_month) || Math.floor(projectDurationMonths * 0.25);
  const monthlyData = Array.from({ length: projectDurationMonths }, (_, m) => {
    const month = m + 1;
    const costOut = month <= constPhaseEnd
      ? -(totalCostsNet / constPhaseEnd) - (month === 1 ? totalFinancingCosts : 0)
      : 0;
    const revShare = month >= salesStart
      ? totalGrossRevenue / Math.max(projectDurationMonths - salesStart, 1)
      : 0;
    return { month: `M${month}`, net: costOut + revShare, cumulative: 0 };
  });
  let cum = 0;
  monthlyData.forEach(m => { cum += m.net; m.cumulative = cum; });

  return {
    // Costs breakdown
    landAndProject, aboveGroundCost, belowGroundCost, outdoorAreasCost,
    greeneryTerrainCost, greeneryStructureCost, implementationSubtotal,
    engineeringNetworks, totalImplementation,
    projectManagement, siteEquipment, projectActivity, engineeringActivity,
    technicalSupervision, totalAdditionalBudget,
    salesCosts, marketingCosts, legalServices, developmentFee, otherFees,
    totalOtherServices, reserve, totalCostsNet,
    // Financing
    ownResources, bankResources, bankFees, bankInterest, ownResourcesInterestCost, totalFinancingCosts,
    totalProjectCosts,
    // Revenue
    apartmentsRevenue, nonResRevenue, parkingIndoorRevenue, parkingOutdoorRevenue,
    balconiesRevenue, gardensRevenue, basementsRevenue, otherRevenue, totalGrossRevenue,
    // KPIs
    grossProfit, profitMargin, developerMargin, equityMultiple,
    annualizedReturn, irr, costPerM2, revenuePerM2, profitPerM2,
    breakEvenRevenue, breakEvenPct, dscr,
    // Timeline
    monthlyData,
  };
}