/**
 * Land Feasibility Calculation Engine
 * Ported from estivo.io — owner: borismikla-star
 * Supports: block/building (apartment model) + subdivision (parcel model)
 */

const BALANCE_TOLERANCE = 0.01;

function checkLandBalance(land_area, building_footprint, roads_area, paved_area, green_area, validations) {
  if (green_area < 0) {
    const excess_m2 = Math.abs(Math.round(green_area));
    const excess_pct = land_area > 0 ? Math.round((excess_m2 / land_area) * 100) : 0;
    validations.push({ type: 'error', key: 'land_balance_exceeded', excess_m2, excess_pct });
  }
  const land_used = building_footprint + roads_area + paved_area + (green_area < 0 ? 0 : green_area);
  const diff = land_used - land_area;
  const pct = land_area > 0 ? Math.abs(diff) / land_area : 0;
  if (green_area >= 0 && pct > BALANCE_TOLERANCE && diff < 0) {
    validations.push({ type: 'warning', key: 'land_unallocated', diff: Math.round(Math.abs(diff)) });
  }
  return land_used;
}

export function calculateSubdivision(inputs) {
  const {
    land_area = 0,
    public_roads_pct = 0.20,
    green_pct = 0.40,
    paved_pct_house = 0.10,
    min_parcel_size = 600,
    max_plot_coverage = 0.30,
    floors_per_house = 2,
    kpp_house = null,
    typology = 'detached',
    risk_buffer_pct = 0.10,
    parking_per_house = 2,
  } = inputs;

  let effective_min_parcel = min_parcel_size;
  let effective_coverage = max_plot_coverage;
  if (typology === 'semi') {
    effective_min_parcel = min_parcel_size * 0.85;
    effective_coverage = Math.min(0.50, max_plot_coverage * 1.10);
  } else if (typology === 'row') {
    effective_min_parcel = min_parcel_size * 0.70;
    effective_coverage = Math.min(0.50, max_plot_coverage * 1.20);
  }

  const validations = [];
  if (max_plot_coverage > 0.50) validations.push({ type: 'warning', key: 'coverage_too_high' });
  if (min_parcel_size < 250) validations.push({ type: 'warning', key: 'parcel_too_small' });
  if (effective_min_parcel < 250) validations.push({ type: 'warning', key: 'effective_parcel_too_small' });

  const roads_area = land_area * public_roads_pct;
  const required_green_total = land_area * green_pct;
  const parcels_area_raw = land_area - roads_area;
  const number_of_parcels_est = Math.max(0, Math.floor(parcels_area_raw / effective_min_parcel));
  const avg_parcel_size_raw = number_of_parcels_est > 0 ? parcels_area_raw / number_of_parcels_est : 0;
  const footprint_est = avg_parcel_size_raw * effective_coverage;
  const paved_est = avg_parcel_size_raw * paved_pct_house;
  const parcel_green_est = Math.max(0, avg_parcel_size_raw - footprint_est - paved_est);
  const total_parcel_green_est = parcel_green_est * number_of_parcels_est;
  const public_green_area = Math.max(0, required_green_total - total_parcel_green_est);
  const development_area = land_area - roads_area - public_green_area;
  const number_of_parcels = Math.max(0, Math.floor(development_area / effective_min_parcel));

  if (number_of_parcels < 1 && land_area > 0) validations.push({ type: 'warning', key: 'no_parcels' });

  const avg_parcel_size = number_of_parcels > 0 ? development_area / number_of_parcels : 0;
  const footprint_per_house = avg_parcel_size * effective_coverage;
  const total_built_footprint = footprint_per_house * number_of_parcels;
  const parcel_paved = avg_parcel_size * paved_pct_house;
  const total_paved_area = parcel_paved * number_of_parcels;
  const parcel_green_area = Math.max(0, avg_parcel_size - footprint_per_house - parcel_paved);
  const total_parcel_green = parcel_green_area * number_of_parcels;
  const green_area = public_green_area + total_parcel_green;

  const hpp_per_house = (kpp_house !== null && kpp_house > 0)
    ? avg_parcel_size * kpp_house
    : footprint_per_house * floors_per_house;
  const total_hpp = hpp_per_house * number_of_parcels;
  const effective_total_hpp = total_hpp * (1 - risk_buffer_pct);
  const total_parking = number_of_parcels * parking_per_house;

  const actual_green_pct = land_area > 0 ? green_area / land_area : 0;
  if (actual_green_pct < green_pct - 0.001) validations.push({ type: 'warning', key: 'green_below_minimum' });

  const land_used = checkLandBalance(land_area, total_built_footprint, roads_area, total_paved_area, green_area, validations);

  return {
    land_area, typology, development_area, roads_area, public_green_area, green_area,
    number_of_parcels, avg_parcel_size, footprint_per_house, hpp_per_house, total_hpp,
    effective_total_hpp, total_built_footprint, total_parking, total_paved_area,
    risk_buffer_applied: risk_buffer_pct > 0, risk_buffer_pct,
    land_balance: {
      land_area, building_footprint: total_built_footprint, roads_area,
      paved_area: total_paved_area, green_area, total: land_used,
    },
    validations,
    data_confidence: 'concept_subdivision',
    mode: 'subdivision',
  };
}

const EFFICIENCY = { conservative: 0.72, realistic: 0.75, efficient: 0.80 };
const PARKING_SPACE_AREA = 25;

export function calculateFeasibility(inputs) {
  if (inputs.project_type === 'subdivision') {
    return calculateSubdivision(inputs);
  }

  const {
    land_area = 0,
    iz = 0,
    kpp = null,
    floors = null,
    project_type = 'building',
    non_residential_pct = 0,
    min_green_pct = 0.20,
    avg_apartment_size = 60,
    mode = 'realistic',
    green_on_structure = false,
    parking_ratio = 1.2,
    outdoor_ratio = 0.1,
    paved_pct = 0.15,
    urban_risk_buffer = 0.10,
  } = inputs;

  const validations = [];

  // Built area (footprint)
  let built_area;
  if (iz > 0) {
    built_area = land_area * iz;
  } else {
    const paved_fallback = land_area * paved_pct;
    built_area = Math.max(0, land_area * (1 - min_green_pct) - paved_fallback);
  }

  // HPP above (gross floor area above ground)
  let hpp_above_raw;
  if (kpp !== null && kpp > 0) {
    hpp_above_raw = land_area * kpp;
  } else if (floors !== null && floors > 0) {
    hpp_above_raw = built_area * floors;
  } else {
    hpp_above_raw = 0;
  }

  // KPP vs floors mismatch check
  if (kpp !== null && kpp > 0 && floors !== null && floors > 0 && built_area > 0) {
    const kpp_implied = hpp_above_raw / land_area;
    const floors_implied = built_area * floors / land_area;
    const mismatch = Math.abs(kpp_implied - floors_implied) / Math.max(kpp_implied, 0.01);
    if (mismatch > 0.25) validations.push({ type: 'warning', key: 'kpp_floors_mismatch' });
  }

  // Effective HPP above (after urban risk buffer)
  const effective_hpp_above = hpp_above_raw * (1 - urban_risk_buffer);

  // NPP above/below (net floor area)
  const efficiency = EFFICIENCY[mode] || 0.75;
  const npp_above = effective_hpp_above * efficiency;

  // Apartments and non-residential
  const non_res_pct_decimal = non_residential_pct / 100;
  const common_areas_pct = 0.10;
  let apartments_area = npp_above * (1 - non_res_pct_decimal - common_areas_pct);
  if (apartments_area < 0) {
    apartments_area = 0;
    validations.push({ type: 'warning', key: 'apartments_area_clamped' });
  }
  const non_residential_area = npp_above * non_res_pct_decimal;

  // Apartment count
  const apartment_count = avg_apartment_size > 0 ? Math.round(apartments_area / avg_apartment_size) : 0;

  // Balconies and gardens
  const balconies_area = apartments_area * 0.10;
  const front_gardens_area = apartments_area * 0.05;

  // Cellars
  const cellars_area = apartment_count * 3;

  // Parking
  const parking_covered = Math.round(apartment_count * parking_ratio);
  const parking_outdoor = Math.round(apartment_count * outdoor_ratio);

  // HPP below (underground)
  const parking_area = parking_covered * PARKING_SPACE_AREA;
  const technical_rooms = parking_area * 0.05;
  const service_circulation = parking_area * 0.20;
  const hpp_below = parking_area + cellars_area + technical_rooms + service_circulation;
  const npp_below = hpp_below * 0.85;

  // Paved area (includes outdoor parking)
  const base_paved = land_area * paved_pct;
  const outdoor_parking_area = parking_outdoor * PARKING_SPACE_AREA;
  const paved_area = base_paved + outdoor_parking_area;

  // Green terrain (residual)
  let green_terrain = land_area - built_area - paved_area;
  if (green_terrain < 0) {
    validations.push({ type: 'warning', key: 'green_negative_clamped' });
    green_terrain = 0;
  }

  // Green % check
  if (land_area > 0 && green_terrain / land_area < min_green_pct - 0.001) {
    validations.push({ type: 'warning', key: 'green_below_minimum' });
  }

  // NFA vs GFA check
  if (npp_above > effective_hpp_above + 1) {
    validations.push({ type: 'warning', key: 'cpp_exceeds_hpp' });
  }

  // Green on structure (informative)
  const green_on_structure_area = green_on_structure ? built_area * 0.30 : 0;

  // Land balance
  const land_used = checkLandBalance(land_area, built_area, 0, paved_area, green_terrain, validations);

  return {
    land_area, built_area, hpp_above: hpp_above_raw, effective_hpp_above,
    hpp_below, npp_above, npp_below,
    apartments_area, non_residential_area, balconies_area, front_gardens_area,
    apartment_count, parking_covered, parking_outdoor,
    paved_area, green_terrain, green_on_structure_area,
    cellars_area,
    land_balance: {
      land_area, building_footprint: built_area, roads_area: 0,
      paved_area, green_area: green_terrain, total: land_used,
    },
    validations,
    data_confidence: 'concept',
    mode: 'building',
  };
}