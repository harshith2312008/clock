import { NextResponse } from 'next/server';
import { getAlarms, saveAlarms, Alarm } from '@/lib/db';

export async function GET() {
    const alarms = getAlarms();
    return NextResponse.json(alarms);
}

export async function POST(request: Request) {
    const body = await request.json();
    const alarms = getAlarms();

    const newAlarm: Alarm = {
        id: Date.now().toString(),
        time: body.time || "07:00",
        label: body.label || "Alarm",
        days: body.days || [],
        isActive: true
    };

    alarms.push(newAlarm);
    saveAlarms(alarms);

    return NextResponse.json(newAlarm);
}

export async function PUT(request: Request) {
    // Used for toggling or updating
    const body = await request.json();
    let alarms = getAlarms();

    alarms = alarms.map(a => a.id === body.id ? { ...a, ...body } : a);
    saveAlarms(alarms);
    return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    let alarms = getAlarms();
    alarms = alarms.filter(a => a.id !== id);
    saveAlarms(alarms);

    return NextResponse.json({ success: true });
}
