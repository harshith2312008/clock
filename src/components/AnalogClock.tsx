"use client";

import React from 'react';
import { useTime } from '@/hooks/useTime';

export default function AnalogClock() {
    const time = useTime();

    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
    const hourDegrees = ((hours % 12 + minutes / 60) / 12) * 360;

    return (
        <div style={{ position: 'relative', width: '320px', height: '320px' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                {/* Clock Face Background */}
                <circle cx="50" cy="50" r="48" fill="var(--md-sys-color-surface-variant)" />

                {/* Minute Ticks (Subtle) */}
                {[...Array(60)].map((_, i) => i % 5 !== 0 && (
                    <line
                        key={`min-${i}`}
                        x1="50" y1="6" x2="50" y2="7"
                        stroke="var(--md-sys-color-outline-variant)"
                        strokeWidth="0.5"
                        transform={`rotate(${i * 6} 50 50)`}
                    />
                ))}

                {/* Hour Ticks (Prominent) */}
                {[...Array(12)].map((_, i) => (
                    <line
                        key={`hour-${i}`}
                        x1="50" y1="6" x2="50" y2="10"
                        stroke="var(--md-sys-color-primary)" // Changed to primary mostly for ticks? No actually, ticks should stay subtle or maybe variant. Let's keep them on-surface-variant or primary. Let's try Primary for fun as user asked for color.
                        strokeWidth="2"
                        strokeLinecap="round"
                        transform={`rotate(${i * 30} 50 50)`}
                    />
                ))}

                {/* Hour Hand */}
                <line
                    x1="50" y1="50" x2="75" y2="50"
                    stroke="var(--md-sys-color-on-surface)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    transform={`rotate(${hourDegrees} 50 50)`}
                />

                {/* Minute Hand */}
                <line
                    x1="50" y1="50" x2="90" y2="50"
                    stroke="var(--md-sys-color-primary)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    transform={`rotate(${minuteDegrees} 50 50)`}
                />

                {/* Second Hand */}
                <g transform={`rotate(${secondDegrees} 50 50)`}>
                    <line
                        x1="40" y1="50" x2="92" y2="50"
                        stroke="var(--md-sys-color-error)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    {/* Pivot Dot for Second Hand */}
                    <circle cx="50" cy="50" r="3" fill="var(--md-sys-color-error)" />
                </g>

                {/* Center Pivot (Top) */}
                <circle cx="50" cy="50" r="1.5" fill="var(--md-sys-color-surface)" />
            </svg>
        </div>
    );
}
