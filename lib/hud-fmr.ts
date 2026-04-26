/**
 * HUD Fair Market Rents API integration
 *
 * Source: HUD USER FMR API
 * Documentation: https://www.huduser.gov/portal/dataset/fmr-api.html
 * Base URL: https://www.huduser.gov/hudapi/public/fmr
 *
 * Authentication: Bearer token required
 * Sign up at: https://www.huduser.gov/hudapi/public/register/form
 *
 * Data: FY2025 Fair Market Rents (40th percentile rents by county/metro area)
 * Updated annually, published by HUD for Housing Choice Voucher program.
 *
 * lastReviewed: 2026-04-26
 */

const HUD_API_BASE = "https://www.huduser.gov/hudapi/public";

export interface FMRData {
  state: string;
  county: string;
  year: string;
  fmr_0br: number; // studio
  fmr_1br: number;
  fmr_2br: number;
  fmr_3br: number;
  fmr_4br: number;
  sourceUrl: string;
  fetchedAt: string;
}

export interface FMRResult {
  data: FMRData | null;
  error: string | null;
  fallback: boolean;
}

// In-memory cache (server-side, per process)
const fmrCache = new Map<string, { data: FMRData; expiresAt: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetch Fair Market Rents by state FIPS code and county FIPS code
 * Falls back to state-level averages if county-level unavailable
 */
export async function getFMRByCounty(
  stateFips: string,
  countyFips: string,
  year = "2025"
): Promise<FMRResult> {
  const cacheKey = `${stateFips}-${countyFips}-${year}`;
  const cached = fmrCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return { data: cached.data, error: null, fallback: false };
  }

  const token = process.env.HUD_API_TOKEN;
  if (!token) {
    return {
      data: null,
      error: "HUD_API_TOKEN not configured. Set this environment variable to enable rent estimates.",
      fallback: true,
    };
  }

  try {
    const url = `${HUD_API_BASE}/fmr/statedata/${stateFips}?year=${year}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 86400 }, // Next.js cache: 24h
    });

    if (!res.ok) {
      throw new Error(`HUD API responded with ${res.status}`);
    }

    const json = await res.json();

    // HUD API returns data in data.basicdata array
    const counties = json?.data?.basicdata ?? [];
    const county = counties.find(
      (c: { county_code: string }) =>
        c.county_code === countyFips || c.county_code === `${stateFips}${countyFips}`
    );

    if (!county) {
      // Fall back to state summary if county not found
      return getFMRByState(stateFips, year);
    }

    const data: FMRData = {
      state: stateFips,
      county: county.county_name ?? countyFips,
      year,
      fmr_0br: county.Efficiency ?? 0,
      fmr_1br: county.One_Bedroom ?? 0,
      fmr_2br: county.Two_Bedroom ?? 0,
      fmr_3br: county.Three_Bedroom ?? 0,
      fmr_4br: county.Four_Bedroom ?? 0,
      sourceUrl: `https://www.huduser.gov/portal/datasets/fmr/fmrs/FY${year}_code/select_Geography.odn`,
      fetchedAt: new Date().toISOString(),
    };

    fmrCache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
    return { data, error: null, fallback: false };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: `HUD API error: ${msg}`, fallback: true };
  }
}

/**
 * Fetch state-level FMR averages as fallback
 */
async function getFMRByState(stateFips: string, year = "2025"): Promise<FMRResult> {
  const token = process.env.HUD_API_TOKEN;
  if (!token) {
    return { data: null, error: "HUD_API_TOKEN not configured.", fallback: true };
  }

  try {
    const url = `${HUD_API_BASE}/fmr/statedata/${stateFips}?year=${year}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`HUD API ${res.status}`);

    const json = await res.json();
    const rows: Array<{
      Efficiency: number;
      One_Bedroom: number;
      Two_Bedroom: number;
      Three_Bedroom: number;
      Four_Bedroom: number;
      county_name: string;
    }> = json?.data?.basicdata ?? [];
    if (rows.length === 0) throw new Error("No state data returned");

    // Average across all counties in state
    const avg = (field: keyof typeof rows[0]) =>
      rows.reduce((sum, r) => sum + (Number(r[field]) || 0), 0) / rows.length;

    const data: FMRData = {
      state: stateFips,
      county: "State average",
      year,
      fmr_0br: Math.round(avg("Efficiency")),
      fmr_1br: Math.round(avg("One_Bedroom")),
      fmr_2br: Math.round(avg("Two_Bedroom")),
      fmr_3br: Math.round(avg("Three_Bedroom")),
      fmr_4br: Math.round(avg("Four_Bedroom")),
      sourceUrl: `https://www.huduser.gov/portal/datasets/fmr/fmrs/FY${year}_code/select_Geography.odn`,
      fetchedAt: new Date().toISOString(),
    };

    return { data, error: null, fallback: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: `HUD API fallback error: ${msg}`, fallback: true };
  }
}

/**
 * State FIPS codes for the 3 supported launch states
 */
export const STATE_FIPS: Record<string, string> = {
  CA: "06",
  TX: "48",
  NY: "36",
};

/**
 * Get FMR for a supported launch state by ZIP code (approximation — uses county lookup)
 * Note: ZIP→county mapping requires a separate dataset. This is a simplified version
 * that uses state-level data. Full ZIP→county mapping is a future enhancement.
 */
export async function getFMRByState_code(
  stateCode: "CA" | "TX" | "NY",
  year = "2025"
): Promise<FMRResult> {
  const fips = STATE_FIPS[stateCode];
  if (!fips) {
    return { data: null, error: `Unsupported state: ${stateCode}`, fallback: true };
  }
  return getFMRByState(fips, year);
}
