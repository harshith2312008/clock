
import { NextResponse } from 'next/server';
import { addSubscription, PUBLIC_KEY, startPoller } from '@/lib/pushWorker';

// Ensure poller is running when this route is hit (lazy init)
startPoller();

export async function GET() {
    return NextResponse.json({ publicKey: PUBLIC_KEY });
}

export async function POST(request: Request) {
    const sub = await request.json();
    addSubscription(sub);
    return NextResponse.json({ success: true });
}
