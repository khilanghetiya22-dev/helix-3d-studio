// V5 Pricing Engine — 5-component pricing with print time & shipping zones

/**
 * Technology speed factors (higher = slower print)
 */
export const TECH_SPEED_FACTORS: Record<string, number> = {
  fdm: 1.0,
};

/**
 * Quality divisors (Draft is fastest)
 */
export const QUALITY_DIVISORS: Record<string, number> = {
  draft: 3.0,
  standard: 2.0,
  fine: 1.0,
};

// ─── Print Time ──────────────────────────────────────────────

export interface PrintTimeResult {
  rawHours: number;
  billedHours: number;
  cost: number; // billedHours × ₹5
}

/**
 * Calculate print time and cost.
 * Formula: rawHours = (volume × infillFactor × speedFactor) / qualityDivisor
 * Cost = max(1, ceil(rawHours)) × ₹5
 */
export function calcPrintTimeCost(
  volumeCm3: number,
  infillFactor: number,
  speedFactor: number,
  qualityDivisor: number
): PrintTimeResult {
  const rawHours = (volumeCm3 * infillFactor * speedFactor) / qualityDivisor;
  const billedHours = Math.max(1, Math.ceil(rawHours));
  return { rawHours, billedHours, cost: billedHours * 5 };
}

// ─── Shipping ────────────────────────────────────────────────

export interface ShippingResult {
  fee: number;
  zoneName: string;
}

/**
 * Determine shipping fee from pincode.
 * Uses first 2-3 digits to match zone.
 */
export function getShippingFee(
  pincode: string,
  businessPincodePrefix: string = '380'
): ShippingResult {
  if (!pincode || pincode.length !== 6) {
    return { fee: 100, zoneName: 'Default' };
  }

  const prefix2 = pincode.substring(0, 2);
  const prefix3 = pincode.substring(0, 3);

  // Local — same city as business
  if (prefix3 === businessPincodePrefix) {
    return { fee: 0, zoneName: 'Local' };
  }

  // Zone A — Gujarat
  if (['38', '39'].includes(prefix2)) {
    return { fee: 40, zoneName: 'Zone A' };
  }

  // Zone B — Maharashtra, Goa
  if (['40', '41', '42', '43'].includes(prefix2)) {
    return { fee: 60, zoneName: 'Zone B' };
  }

  // Zone C — Delhi, Haryana, Punjab, UP, Uttarakhand, Rajasthan, MP
  const zoneC = [
    '11', '12', '13', '14',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
    '30', '31', '32', '33', '34', '35', '36', '37',
  ];
  if (zoneC.includes(prefix2)) {
    return { fee: 80, zoneName: 'Zone C' };
  }

  // Zone D — South & East India
  const p = parseInt(prefix2);
  if (p >= 44 && p <= 78) {
    return { fee: 100, zoneName: 'Zone D' };
  }

  // Zone E — North-East, J&K, Ladakh, Islands
  if (p >= 79 && p <= 99) {
    return { fee: 140, zoneName: 'Zone E' };
  }

  return { fee: 100, zoneName: 'Default' };
}

// ─── Full Order Pricing ──────────────────────────────────────

export interface OrderPricingInputs {
  volumeCm3: number | null;
  infillFactor: number;
  materialDensity: number;
  materialPricePerGram: number;
  quantity: number;
  technologySlug: string;
  quality: string; // 'draft' | 'standard' | 'fine'
  pincode: string;
  businessPincodePrefix?: string;
}

export interface OrderPricingResult {
  // Intermediate values
  estimatedWeight: number | null;
  // Print time
  printTime: PrintTimeResult | null;
  // 5 cost components
  materialCost: number | null;
  printTimeCost: number | null;
  handlingFee: number | null;
  shipping: ShippingResult;
  platformFee: number | null;
  // Grand total
  grandTotal: number | null;
}

/**
 * Calculate full 5-component order pricing.
 */
export function calcOrderPricing(inputs: OrderPricingInputs): OrderPricingResult {
  const {
    volumeCm3, infillFactor, materialDensity, materialPricePerGram,
    quantity, technologySlug, quality, pincode, businessPincodePrefix,
  } = inputs;

  const shipping = getShippingFee(pincode, businessPincodePrefix);

  if (volumeCm3 === null || volumeCm3 <= 0 || materialDensity <= 0) {
    return {
      estimatedWeight: null,
      printTime: null,
      materialCost: null,
      printTimeCost: null,
      handlingFee: null,
      shipping,
      platformFee: null,
      grandTotal: null,
    };
  }

  // Step 1 — Material Cost
  const estimatedWeight = volumeCm3 * infillFactor * materialDensity;
  const materialCost = estimatedWeight * materialPricePerGram * quantity;

  // Step 2 — Print Time Cost
  const speedFactor = TECH_SPEED_FACTORS[technologySlug] ?? 1.0;
  const qualityDivisor = QUALITY_DIVISORS[quality] ?? 2.0;
  const printTime = calcPrintTimeCost(volumeCm3, infillFactor, speedFactor, qualityDivisor);
  const printTimeCost = printTime.cost;

  // Step 3 — Handling Fee (5% of material cost)
  const handlingFee = materialCost * 0.05;

  // Step 4 — Shipping (already calculated)

  // Step 5 — Platform Fee (10% of material cost)
  const platformFee = materialCost * 0.10;

  // Grand Total
  const grandTotal = materialCost + printTimeCost + handlingFee + shipping.fee + platformFee;

  return {
    estimatedWeight,
    printTime,
    materialCost,
    printTimeCost,
    handlingFee,
    shipping,
    platformFee,
    grandTotal,
  };
}
