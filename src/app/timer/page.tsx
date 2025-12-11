"use client";

import React, { useState, useEffect, useRef } from 'react';
import PageTransition from '@/components/PageTransition';

type TimerData = {
    id: string;
    total: number; // milliseconds
    remaining: number;
    isRunning: boolean;
};

export default function TimerPage() {
    const [timers, setTimers] = useState<TimerData[]>([]);
    const [inputMinutes, setInputMinutes] = useState(1);

    // Global ticker for updating all running timers
    useEffect(() => {
        const interval = setInterval(() => {
            setTimers(prev => prev.map(t => {
                if (!t.isRunning) return t;
                const nextRemaining = t.remaining - 100; // 100ms tick
                if (nextRemaining <= 0) {
                    return { ...t, remaining: 0, isRunning: false }; // Timer Done
                }
                return { ...t, remaining: nextRemaining };
            }));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const addTimer = () => {
        const total = inputMinutes * 60 * 1000;
        setTimers([...timers, { id: Date.now().toString(), total, remaining: total, isRunning: true }]);
    };

    const deleteTimer = (id: string) => {
        setTimers(timers.filter(t => t.id !== id));
    };

    const toggleTimer = (id: string) => {
        setTimers(timers.map(t => t.id === id ? { ...t, isRunning: !t.isRunning } : t));
    };

    const resetTimer = (id: string) => {
        setTimers(timers.map(t => t.id === id ? { ...t, remaining: t.total, isRunning: false } : t));
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', width: '100%' }}>
            <PageTransition>
                <div style={{ marginBottom: '32px' }}>
                    <input
                        type="number"
                        min="1"
                        value={inputMinutes}
                        onChange={(e) => setInputMinutes(Number(e.target.value))}
                        style={{
                            fontSize: '48px',
                            width: '100px',
                            textAlign: 'center',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '2px solid var(--md-sys-color-primary)',
                            color: 'var(--md-sys-color-on-surface)',
                            fontFamily: 'var(--font-family-display)'
                        }}
                    />
                    <span style={{ fontSize: '24px', marginLeft: '8px' }}>min</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
                    {[1, 5, 10, 15, 30].map(m => (
                        <button
                            key={m}
                            onClick={() => setInputMinutes(m)}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--md-sys-color-outline)',
                                color: 'var(--md-sys-color-on-surface-variant)',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            {m}m
                        </button>
                    ))}
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <button
                        onClick={addTimer}
                        style={{
                            display: 'block',
                            margin: '16px auto',
                            backgroundColor: 'var(--md-sys-color-primary)',
                            color: 'var(--md-sys-color-on-primary)',
                            border: 'none',
                            padding: '12px 32px',
                            borderRadius: '24px',
                            fontSize: '18px',
                            cursor: 'pointer'
                        }}
                    >
                        Start Timer
                    </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
                    {timers.map(timer => (
                        <TimerItem
                            key={timer.id}
                            {...timer}
                            onDelete={() => deleteTimer(timer.id)}
                            onToggle={() => toggleTimer(timer.id)}
                            onReset={() => resetTimer(timer.id)}
                        />
                    ))}
                </div>
            </PageTransition >
        </div >
    );
}

function TimerItem({ total, remaining, isRunning, onDelete, onToggle, onReset }: TimerData & { onDelete: () => void, onToggle: () => void, onReset: () => void }) {
    const progress = (remaining / total);
    const radius = 60;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress * circumference;

    const seconds = Math.ceil(remaining / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const formatted = `${m}:${s.toString().padStart(2, '0')}`;

    return (
        <div style={{
            position: 'relative',
            width: '160px',
            height: '160px',
            backgroundColor: 'var(--md-sys-color-surface-container)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
        }}>
            {/* Progress Ring */}
            <svg
                height={radius * 2}
                width={radius * 2}
                style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
            >
                <circle
                    stroke="var(--md-sys-color-surface-variant)"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke="var(--md-sys-color-primary)"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.1s linear' }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>

            <div style={{ zIndex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontFamily: 'var(--font-family-display)', fontWeight: '500' }}>{formatted}</div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '4px' }}>
                    <button onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--md-sys-color-primary)' }}>
                        <span className="material-icon">{isRunning ? 'pause' : 'play_arrow'}</span>
                    </button>
                    <button onClick={onReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--md-sys-color-on-surface-variant)' }}>
                        <span className="material-icon">refresh</span>
                    </button>
                    <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--md-sys-color-error)' }}>
                        <span className="material-icon">close</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
