// V7 Shipping Calculator — Amazon/Flipkart-style with 3 tiers, delivery dates, city lookup
// ─────────────────────────────────────────────────────────────────────────────
// TRIAL MODE — mirrors Delhivery pricing, runs with zero credentials.
// To go live: replace zone detection block with Delhivery Rate Fetch API call.
// ─────────────────────────────────────────────────────────────────────────────

export type ShippingTier = 'standard' | 'express';

export interface TierResult {
  tier: ShippingTier;
  label: string;
  price: number;           // final price incl. fuel + GST (₹)
  isFree: boolean;         // true if standard + order ≥ ₹999
  deliveryLabel: string;   // e.g. "Tue, 20 May – Thu, 22 May"
  urgencyNote?: string;    // e.g. "Order by 2 PM for overnight"
}

export interface ShippingResult {
  zone: string;
  billableWeightKg: number;
  cityName: string | null;
  stateName: string | null;
  tiers: TierResult[];
  selectedTier: ShippingTier;
  codFee: number; // Keep for interface compatibility if needed, but hardcode to 0
  note?: string;
  isServiceable: boolean;
}

// ─── Zone Definitions ──────────────────────────────────────────────

interface ZoneDef {
  name: string;
  prefixes?: string[];
  rangeMin?: number;
  rangeMax?: number;
  base: number;
  perSlab: number;
}

const ZONES: ZoneDef[] = [
  { name: 'Zone A', prefixes: ['38', '39'],                                       base: 35, perSlab: 10 },
  { name: 'Zone B', prefixes: ['40', '41', '42', '43'],                           base: 55, perSlab: 15 },
  { name: 'Zone C', prefixes: ['11', '12', '13', '14', '20', '21', '22', '23',
                                '24', '25', '26', '27', '28', '29', '30', '31',
                                '32', '33', '34', '35', '36', '37'],               base: 75, perSlab: 20 },
  { name: 'Zone D', rangeMin: 44, rangeMax: 78,                                   base: 95, perSlab: 25 },
  { name: 'Zone E', rangeMin: 79, rangeMax: 99,                                   base: 130, perSlab: 35 },
];

const TIER_MULTIPLIERS: Record<ShippingTier, number> = {
  standard:  1.0,
  express:   1.9,
};

const FUEL_RATE  = 0.12;
const GST_RATE   = 0.18;
const FREE_THRESHOLD = 999;

// ─── Pincode → City Lookup ─────────────────────────────────────────

const PINCODE_CITY_MAP: Record<string, { city: string; state: string }> = {
  '380': { city: 'Ahmedabad',      state: 'Gujarat' },
  '390': { city: 'Vadodara',       state: 'Gujarat' },
  '395': { city: 'Surat',          state: 'Gujarat' },
  '360': { city: 'Rajkot',         state: 'Gujarat' },
  '370': { city: 'Bhuj',           state: 'Gujarat' },
  '400': { city: 'Mumbai',         state: 'Maharashtra' },
  '411': { city: 'Pune',           state: 'Maharashtra' },
  '440': { city: 'Nagpur',         state: 'Maharashtra' },
  '110': { city: 'New Delhi',      state: 'Delhi' },
  '560': { city: 'Bengaluru',      state: 'Karnataka' },
  '600': { city: 'Chennai',        state: 'Tamil Nadu' },
  '500': { city: 'Hyderabad',      state: 'Telangana' },
  '700': { city: 'Kolkata',        state: 'West Bengal' },
  '302': { city: 'Jaipur',         state: 'Rajasthan' },
  '226': { city: 'Lucknow',        state: 'Uttar Pradesh' },
  '462': { city: 'Bhopal',         state: 'Madhya Pradesh' },
  '530': { city: 'Visakhapatnam',  state: 'Andhra Pradesh' },
  '682': { city: 'Kochi',          state: 'Kerala' },
  '641': { city: 'Coimbatore',     state: 'Tamil Nadu' },
  '160': { city: 'Chandigarh',     state: 'Chandigarh' },
  '248': { city: 'Dehradun',       state: 'Uttarakhand' },
  '781': { city: 'Guwahati',       state: 'Assam' },
  '190': { city: 'Srinagar',       state: 'J & K' },
  '194': { city: 'Leh',            state: 'Ladakh' },
  '800': { city: 'Patna',          state: 'Bihar' },
  '834': { city: 'Ranchi',         state: 'Jharkhand' },
  '751': { city: 'Bhubaneswar',    state: 'Odisha' },
  '141': { city: 'Ludhiana',       state: 'Punjab' },
  '180': { city: 'Jammu',          state: 'J & K' },
  '452': { city: 'Indore',         state: 'Madhya Pradesh' },
};

export function getCityFromPincode(pincode: string): { city: string; state: string } | null {
  if (pincode.length < 3) return null;
  return PINCODE_CITY_MAP[pincode.substring(0, 3)] ?? null;
}

// ─── Serviceability ────────────────────────────────────────────────

const UNSERVICEABLE_PREFIXES = ['744', '682559', '682553'];

export function isPincodeServiceable(pincode: string): boolean {
  if (pincode.length !== 6) return false;
  return !UNSERVICEABLE_PREFIXES.some(p => pincode.startsWith(p));
}

// ─── Delivery Date Estimation ──────────────────────────────────────

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0 && result.getDay() !== 6) added++;
  }
  return result;
}

export function getDeliveryDateRange(zone: string, tier: ShippingTier): {
  label: string;
  urgencyNote?: string;
} {
  const today = new Date();
  const cutoffHour = 14;
  const pastCutoff = today.getHours() >= cutoffHour;

  const processingDays = tier === 'standard' ? 1 : 0;

  const transitDaysMap: Record<ShippingTier, Record<string, number>> = {
    express:   { Local: 1, 'Zone A': 2, 'Zone B': 2, 'Zone C': 3, 'Zone D': 3, 'Zone E': 4, Default: 3 },
    standard:  { Local: 2, 'Zone A': 4, 'Zone B': 5, 'Zone C': 5, 'Zone D': 6, 'Zone E': 7, Default: 6 },
  };

  const transitDays = transitDaysMap[tier];
  const minDays = processingDays + (transitDays[zone] ?? transitDays.Default);
  const maxDays = minDays + (tier === 'standard' ? 2 : 0);

  const minDate = addBusinessDays(today, minDays + (pastCutoff ? 1 : 0));
  const maxDate = tier === 'standard' ? addBusinessDays(today, maxDays + (pastCutoff ? 1 : 0)) : null;

  const fmt = (d: Date) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  // Check if delivery is tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = minDate.toDateString() === tomorrow.toDateString();

  let label: string;
  if (isTomorrow && !maxDate) {
    label = `Tomorrow, ${fmt(minDate)}`;
  } else if (maxDate) {
    label = `${fmt(minDate)} – ${fmt(maxDate)}`;
  } else {
    label = fmt(minDate);
  }

  return { label, urgencyNote: undefined };
}

// ─── Weight Calculation ────────────────────────────────────────────

function roundToHalfKg(kg: number): number {
  return Math.ceil(kg * 2) / 2;
}

// ─── Tier Price Calculation ────────────────────────────────────────

function calcTierPrice(baseSubtotal: number, tier: ShippingTier): number {
  const multiplied = baseSubtotal * TIER_MULTIPLIERS[tier];
  const fuel = Math.round(multiplied * FUEL_RATE);
  const gst  = Math.round((multiplied + fuel) * GST_RATE);
  return Math.round(multiplied + fuel + gst);
}

// ─── Main Calculator ───────────────────────────────────────────────

export function calcShipping(params: {
  pincode: string;
  actualWeightG: number;
  boundingBoxMm?: { l: number; b: number; h: number } | null;
  businessPincodePrefix?: string;
  orderTotal?: number;
}): ShippingResult {
  const {
    pincode,
    actualWeightG,
    boundingBoxMm = null,
    businessPincodePrefix = '380',
    orderTotal = 0,
  } = params;

  // Serviceability check
  if (!isPincodeServiceable(pincode)) {
    return {
      zone: 'Unserviceable',
      billableWeightKg: 0,
      cityName: null,
      stateName: null,
      tiers: [],
      selectedTier: 'standard',
      codFee: 0,
      isServiceable: false,
    };
  }

  // Billable weight (actual vs volumetric — whichever is higher)
  const actualKg = actualWeightG / 1000;
  let volumetricKg = 0;
  let note: string | undefined;
  if (boundingBoxMm) {
    volumetricKg = (boundingBoxMm.l * boundingBoxMm.b * boundingBoxMm.h) / 5_000_000;
    note = volumetricKg > actualKg
      ? `Volumetric weight (${volumetricKg.toFixed(2)} kg) used`
      : `Actual weight (${actualKg.toFixed(2)} kg) used`;
  } else {
    note = 'Actual weight used (volumetric unavailable)';
  }
  const billableWeightKg = roundToHalfKg(Math.max(actualKg, volumetricKg, 0.1));

  // Zone detection
  let zoneName = 'Default';
  let baseSubtotal = 95 + Math.max(0, (billableWeightKg - 0.5) / 0.5) * 25;

  if (pincode.length === 6) {
    const p2 = pincode.substring(0, 2);
    const p3 = pincode.substring(0, 3);
    const p2n = parseInt(p2);

    if (p3 === businessPincodePrefix) {
      zoneName = 'Local';
      baseSubtotal = 0;
    } else {
      for (const z of ZONES) {
        const matchPrefix = z.prefixes?.includes(p2);
        const matchRange  = z.rangeMin !== undefined && z.rangeMax !== undefined && p2n >= z.rangeMin && p2n <= z.rangeMax;
        if (matchPrefix || matchRange) {
          const slabs = Math.max(0, (billableWeightKg - 0.5) / 0.5);
          baseSubtotal = z.base + slabs * z.perSlab;
          zoneName = z.name;
          break;
        }
      }
    }
  }

  // City lookup
  const cityInfo = getCityFromPincode(pincode);

  // Build 2 tier options (Standard + Express)
  const tiers: TierResult[] = (['standard', 'express'] as ShippingTier[]).map(tier => {
    const price = zoneName === 'Local' ? 0 : calcTierPrice(baseSubtotal, tier);
    const isFree = tier === 'standard' && orderTotal >= FREE_THRESHOLD;
    const delivery = getDeliveryDateRange(zoneName, tier);
    return {
      tier,
      label: {
        standard: 'Standard Delivery',
        express: 'Express Delivery',
      }[tier],
      price: isFree ? 0 : price,
      isFree,
      deliveryLabel: delivery.label,
      urgencyNote: delivery.urgencyNote,
    };
  });

  // COD fee
  const codFee = 0;

  return {
    zone: zoneName,
    billableWeightKg,
    cityName: cityInfo?.city ?? null,
    stateName: cityInfo?.state ?? null,
    tiers,
    selectedTier: 'standard',
    codFee,
    note,
    isServiceable: true,
  };
}
