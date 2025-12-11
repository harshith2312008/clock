"use client";

import React from 'react';
import { useTime } from '@/hooks/useTime';

export default function DigitalClock() {
    const time = useTime();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{
                fontSize: '6rem',
                fontWeight: 'bold',
                fontFamily: 'var(--font-family-display)',
                color: 'var(--md-sys-color-on-surface)',
                lineHeight: 1
            }}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h1>
            <h2 style={{
                fontSize: '2rem',
                fontWeight: 'normal',
                color: 'var(--md-sys-color-on-surface-variant)',
                marginTop: '16px'
            }}>
                {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
        </div>
    );
}
