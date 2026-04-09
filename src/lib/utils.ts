import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

export function formatPercent(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

const COUNTRY_FLAGS: Record<string, string> = {
    "AFGHANISTAN": "🇦🇫", "ALBANIA": "🇦🇱", "ALGERIA": "🇩🇿", "ANDORRA": "🇦🇩", "ANGOLA": "🇦🇴",
    "ANTIGUA AND BARBUDA": "🇦🇬", "ARGENTINA": "🇦🇷", "ARMENIA": "🇦🇲", "AUSTRALIA": "🇦🇺", "AUSTRIA": "🇦🇹",
    "AZERBAIJAN": "🇦🇿", "BAHAMAS": "🇧🇸", "BAHRAIN": "🇧🇭", "BANGLADESH": "🇧🇩", "BARBADOS": "🇧🇧",
    "BELARUS": "🇧🇾", "BELGIUM": "🇧🇪", "BELIZE": "🇧🇿", "BENIN": "🇧🇯", "BHUTAN": "🇧🇹",
    "BOLIVIA": "🇧🇴", "BOSNIA-HERZEGOVINA": "🇧🇦", "BOSNIA-H": "🇧🇦", "BOTSWANA": "🇧🇼", "BRAZIL": "🇧🇷", "BULGARIA": "🇧🇬",
    "BURKINA FASO": "🇧🇫", "BURUNDI": "🇧🇮", "CAMBODIA": "🇰🇭", "CAMEROON": "🇨🇲", "CANADA": "🇨🇦",
    "CAYMAN ISLANDS": "🇰🇾", "CENTRAL AFRICAN REPUBLIC": "🇨🇫", "CHILE": "🇨🇱", "CHINA": "🇨🇳", "COLOMBIA": "🇨🇴",
    "COSTA RICA": "🇨🇷", "CROATIA": "🇭🇷", "CYPRUS": "🇨🇾", "CZECH REPUBLIC": "🇨🇿", "CÔTE D'IVOIRE": "🇨🇮",
    "DENMARK": "🇩🇰", "DOMINICAN REPUBLIC": "🇩🇴", "ECUADOR": "🇪🇨", "EGYPT": "🇪🇬", "EL SALVADOR": "🇸🇻",
    "ESTONIA": "🇪🇪", "ETHIOPIA": "🇪🇹", "FINLAND": "🇫🇮", "FRANCE": "🇫🇷", "GABON": "🇬🇦",
    "GAMBIA": "🇬🇲", "GEORGIA": "🇬🇪", "GERMANY": "🇩🇪", "GHANA": "🇬🇭", "GIBRALTAR": "🇬🇮",
    "GLOBAL": "🌎", "GREECE": "🇬🇷", "GUATEMALA": "🇬🇹", "HAITI": "🇭🇹", "HONDURAS": "🇭🇳",
    "HONG KONG": "🇭🇰", "HUNGARY": "🇭🇺", "ICELAND": "🇮🇸", "INDIA": "🇮🇳", "INDONESIA": "🇮🇩",
    "IRAN": "🇮🇷", "IRAQ": "🇮🇶", "IRELAND": "🇮🇪", "ISRAEL": "🇮🇱", "ITALY": "🇮🇹",
    "JAMAICA": "🇯🇲", "JAPAN": "🇯🇵", "JORDAN": "🇯🇴", "KAZAKHSTAN": "🇰🇿", "KENYA": "🇰🇪",
    "KUWAIT": "🇰🇼", "LATVIA": "🇱🇻", "LEBANON": "🇱🇧", "LESOTHO": "🇱🇸", "LIECHTENSTEIN": "🇱🇮",
    "LITHUANIA": "🇱🇹", "LONDON": "🇬🇧", "LUXEMBOURG": "🇱🇺", "MALAYSIA": "🇲🇾", "MALI": "🇲🇱",
    "MALTA": "🇲🇹", "MARSHALL ISLANDS": "🇲🇭", "MAURITIUS": "🇲🇺", "MEXICO": "🇲🇽", "MONGOLIA": "🇲🇳",
    "MOROCCO": "🇲🇦", "MYANMAR": "🇲🇲", "NY": "🇺🇸", "NAMIBIA": "🇳🇦", "NEPAL": "🇳🇵",
    "NETHERLANDS": "🇳🇱", "NEW ZEALAND": "🇳🇿", "NICARAGUA": "🇳🇮", "NIGERIA": "🇳🇬", "NORTH MACEDONIA": "🇲🇰",
    "NORWAY": "🇳🇴", "OMAN": "🇴🇲", "PAKISTAN": "🇵🇰", "PANAMA": "🇵🇦", "PARAGUAY": "🇵🇾",
    "PERU": "🇵🇪", "PHILIPPINES": "🇵🇭", "POLAND": "🇵🇱", "PORTUGAL": "🇵🇹", "QATAR": "🇶🇦",
    "ROMANIA": "🇷🇴", "RUSSIA": "🇷🇺", "RWANDA": "🇷🇼", "SAN FRANCISCO": "🇺🇸", "SAUDI ARABIA": "🇸🇦",
    "SENEGAL": "🇸🇳", "SERBIA": "🇷🇸", "SEYCHELLES": "🇸🇨", "SINGAPORE": "🇸🇬", "SLOVAKIA": "🇸🇰",
    "SLOVENIA": "🇸🇮", "SOUTH AFRICA": "🇿🇦", "SOUTH KOREA": "🇰🇷", "SPAIN": "🇪🇸", "SRI LANKA": "🇱🇰",
    "SWEDEN": "🇸🇪", "SWITZERLAND": "🇨🇭", "TAIWAN": "🇹🇼", "TAJIKISTAN": "🇹🇯", "TANZANIA": "🇹🇿",
    "THAILAND": "🇹🇭", "TRINIDAD AND TOBAGO": "🇹🇹", "TUNISIA": "🇹🇳", "TURKEY": "🇹🇷", "UAE": "🇦🇪",
    "UK": "🇬🇧", "USA": "🇺🇸", "UNITED STATES": "🇺🇸", "UNITED KINGDOM": "🇬🇧", "UGANDA": "🇺🇬",
    "UKRAINE": "🇺🇦", "URUGUAY": "🇺🇾", "UZBEKISTAN": "🇺🇿", "VENEZUELA": "🇻🇪", "VIETNAM": "🇻🇳",
    "ZAMBIA": "🇿🇲", "ZIMBABWE": "🇿🇼"
};

export function getCountryFlag(location?: string): string {
    if (!location) return "🌍";
    const normalized = location.trim().toUpperCase();

    // Direct match
    if (COUNTRY_FLAGS[normalized]) return COUNTRY_FLAGS[normalized];

    // Partial match (e.g., "San Francisco" contains "San Francisco")
    for (const [key, flag] of Object.entries(COUNTRY_FLAGS)) {
        if (normalized.includes(key)) return flag;
    }

    return "🌍";
}
