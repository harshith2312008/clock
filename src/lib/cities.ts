export interface City {
    name: string;
    country: string;
    timezone: string;
}

export const cities: City[] = [
    // Africa
    { name: "Cairo", country: "Egypt", timezone: "Africa/Cairo" },
    { name: "Johannesburg", country: "South Africa", timezone: "Africa/Johannesburg" },
    { name: "Lagos", country: "Nigeria", timezone: "Africa/Lagos" },
    { name: "Nairobi", country: "Kenya", timezone: "Africa/Nairobi" },
    { name: "Accra", country: "Ghana", timezone: "Africa/Accra" },
    { name: "Casablanca", country: "Morocco", timezone: "Africa/Casablanca" },

    // Asia
    { name: "Tokyo", country: "Japan", timezone: "Asia/Tokyo" },
    { name: "Delhi", country: "India", timezone: "Asia/Kolkata" },
    { name: "Mumbai", country: "India", timezone: "Asia/Kolkata" },
    { name: "Kolkata", country: "India", timezone: "Asia/Kolkata" },
    { name: "Bangalore", country: "India", timezone: "Asia/Kolkata" },
    { name: "Chennai", country: "India", timezone: "Asia/Kolkata" },
    { name: "Shanghai", country: "China", timezone: "Asia/Shanghai" },
    { name: "Beijing", country: "China", timezone: "Asia/Shanghai" },
    { name: "Hong Kong", country: "China", timezone: "Asia/Hong_Kong" },
    { name: "Singapore", country: "Singapore", timezone: "Asia/Singapore" },
    { name: "Dubai", country: "United Arab Emirates", timezone: "Asia/Dubai" },
    { name: "Seoul", country: "South Korea", timezone: "Asia/Seoul" },
    { name: "Bangkok", country: "Thailand", timezone: "Asia/Bangkok" },
    { name: "Jakarta", country: "Indonesia", timezone: "Asia/Jakarta" },
    { name: "Manila", country: "Philippines", timezone: "Asia/Manila" },
    { name: "Karachi", country: "Pakistan", timezone: "Asia/Karachi" },
    { name: "Dhaka", country: "Bangladesh", timezone: "Asia/Dhaka" },
    { name: "Riyadh", country: "Saudi Arabia", timezone: "Asia/Riyadh" },
    { name: "Jerusalem", country: "Israel", timezone: "Asia/Jerusalem" },
    { name: "Tehran", country: "Iran", timezone: "Asia/Tehran" },
    { name: "Istanbul", country: "Turkey", timezone: "Europe/Istanbul" },

    // Europe
    { name: "London", country: "United Kingdom", timezone: "Europe/London" },
    { name: "Paris", country: "France", timezone: "Europe/Paris" },
    { name: "Berlin", country: "Germany", timezone: "Europe/Berlin" },
    { name: "Rome", country: "Italy", timezone: "Europe/Rome" },
    { name: "Madrid", country: "Spain", timezone: "Europe/Madrid" },
    { name: "Moscow", country: "Russia", timezone: "Europe/Moscow" },
    { name: "Zurich", country: "Switzerland", timezone: "Europe/Zurich" },
    { name: "Amsterdam", country: "Netherlands", timezone: "Europe/Amsterdam" },
    { name: "Brussels", country: "Belgium", timezone: "Europe/Brussels" },
    { name: "Vienna", country: "Austria", timezone: "Europe/Vienna" },
    { name: "Stockholm", country: "Sweden", timezone: "Europe/Stockholm" },
    { name: "Oslo", country: "Norway", timezone: "Europe/Oslo" },
    { name: "Copenhagen", country: "Denmark", timezone: "Europe/Copenhagen" },
    { name: "Helsinki", country: "Finland", timezone: "Europe/Helsinki" },
    { name: "Dublin", country: "Ireland", timezone: "Europe/Dublin" },
    { name: "Lisbon", country: "Portugal", timezone: "Europe/Lisbon" },
    { name: "Athens", country: "Greece", timezone: "Europe/Athens" },

    // North America
    { name: "New York", country: "United States", timezone: "America/New_York" },
    { name: "Los Angeles", country: "United States", timezone: "America/Los_Angeles" },
    { name: "Chicago", country: "United States", timezone: "America/Chicago" },
    { name: "Houston", country: "United States", timezone: "America/Chicago" },
    { name: "Phoenix", country: "United States", timezone: "America/Phoenix" },
    { name: "Philadelphia", country: "United States", timezone: "America/New_York" },
    { name: "San Antonio", country: "United States", timezone: "America/Chicago" },
    { name: "San Diego", country: "United States", timezone: "America/Los_Angeles" },
    { name: "Dallas", country: "United States", timezone: "America/Chicago" },
    { name: "San Jose", country: "United States", timezone: "America/Los_Angeles" },
    { name: "Toronto", country: "Canada", timezone: "America/Toronto" },
    { name: "Vancouver", country: "Canada", timezone: "America/Vancouver" },
    { name: "Mexico City", country: "Mexico", timezone: "America/Mexico_City" },
    { name: "Montreal", country: "Canada", timezone: "America/Montreal" },
    { name: "Denver", country: "United States", timezone: "America/Denver" },
    { name: "Boston", country: "United States", timezone: "America/New_York" },
    { name: "Seattle", country: "United States", timezone: "America/Los_Angeles" },
    { name: "Miami", country: "United States", timezone: "America/New_York" },
    { name: "San Francisco", country: "United States", timezone: "America/Los_Angeles" },
    { name: "Las Vegas", country: "United States", timezone: "America/Los_Angeles" },

    // South America
    { name: "São Paulo", country: "Brazil", timezone: "America/Sao_Paulo" },
    { name: "Buenos Aires", country: "Argentina", timezone: "America/Argentina/Buenos_Aires" },
    { name: "Rio de Janeiro", country: "Brazil", timezone: "America/Sao_Paulo" },
    { name: "Santiago", country: "Chile", timezone: "America/Santiago" },
    { name: "Bogotá", country: "Colombia", timezone: "America/Bogota" },
    { name: "Lima", country: "Peru", timezone: "America/Lima" },

    // Oceania
    { name: "Sydney", country: "Australia", timezone: "Australia/Sydney" },
    { name: "Melbourne", country: "Australia", timezone: "Australia/Melbourne" },
    { name: "Brisbane", country: "Australia", timezone: "Australia/Brisbane" },
    { name: "Perth", country: "Australia", timezone: "Australia/Perth" },
    { name: "Auckland", country: "New Zealand", timezone: "Pacific/Auckland" },
    { name: "Wellington", country: "New Zealand", timezone: "Pacific/Auckland" }
];
