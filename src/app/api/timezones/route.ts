import { NextResponse } from 'next/server';
import { cities } from '@/lib/cities';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ timezones: [] });
    }

    const lowerQuery = query.toLowerCase();

    // 1. Search in our curated Cities list (Name or Country)
    const cityMatches = cities.filter(c =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.country.toLowerCase().includes(lowerQuery)
    ).map(c => c.timezone);

    // 2. Search in standard IANA timezones
    let allTimezones: string[] = [];
    try {
        // @ts-ignore
        allTimezones = Intl.supportedValuesOf('timeZone');
    } catch (_) {
        allTimezones = ['UTC', 'Europe/London', 'America/New_York', 'Asia/Tokyo', 'Australia/Sydney'];
    }

    const ianaMatches = allTimezones.filter(tz =>
        tz.toLowerCase().includes(lowerQuery)
    );

    // 3. Combine and Deduplicate
    const combined = Array.from(new Set([...cityMatches, ...ianaMatches]));

    return NextResponse.json({ timezones: combined.slice(0, 20) }); // Limit to 20 results
}
