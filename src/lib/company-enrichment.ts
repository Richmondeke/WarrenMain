/**
 * Company enrichment via RapidAPI.
 * Fetches logo, employee count, founding year, HQ, LinkedIn URL.
 * All results are cached platform-wide in Firestore (30 day TTL).
 */

export interface CompanyEnrichment {
    logo?: string;
    employees?: number;
    founded?: number;
    linkedinUrl?: string;
    headquarters?: string;
    description?: string;
    website?: string;
    industry?: string;
}

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";
const RAPIDAPI_HOST = "companies-databaseapi.p.rapidapi.com";

/**
 * Fetch enrichment data for a company by name/domain.
 * Uses API Ninjas Company API (1,000 free calls/month).
 */
export async function fetchCompanyEnrichment(companyName: string): Promise<CompanyEnrichment | null> {
    if (!RAPIDAPI_KEY) {
        console.warn("[enrichment] No RAPIDAPI_KEY found in environment.");
        return null;
    }

    try {
        const query = encodeURIComponent(companyName);
        const res = await fetch(
            `https://${RAPIDAPI_HOST}/v1/companysearch?name=${query}`,
            {
                headers: {
                    "X-RapidAPI-Key": RAPIDAPI_KEY,
                    "X-RapidAPI-Host": RAPIDAPI_HOST,
                },
                next: { revalidate: 0 }, // We handle caching ourselves via Firestore
            }
        );

        if (!res.ok) {
            console.error(`[enrichment] API error ${res.status} for ${companyName}`);
            return null;
        }

        const data = await res.json();
        const company = Array.isArray(data) ? data[0] : data;

        if (!company) return null;

        return {
            logo: company.logo || company.image || undefined,
            employees: company.employees ? parseInt(company.employees) : undefined,
            founded: company.founded ? parseInt(company.founded) : undefined,
            linkedinUrl: company.linkedin_url || company.linkedin || undefined,
            headquarters: company.city
                ? `${company.city}${company.country ? ", " + company.country : ""}`
                : company.country || undefined,
            description: company.description || undefined,
            website: company.website || undefined,
            industry: company.industry || undefined,
        };
    } catch (err) {
        console.error("[enrichment] fetchCompanyEnrichment error:", err);
        return null;
    }
}
