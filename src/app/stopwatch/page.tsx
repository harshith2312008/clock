"use client";

import React, { useState, useEffect, useRef } from 'react';
import PageTransition from '@/components/PageTransition';

export default function StopwatchPage() {
    const [elapsed, setElapsed] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const startTimeRef = useRef<number>(0);
    const requestRef = useRef<number | undefined>(undefined);

    const animate = React.useCallback(() => {
        if (startTimeRef.current && isRunning) {
            setElapsed(Date.now() - startTimeRef.current);
            requestRef.current = requestAnimationFrame(animate);
        }
    }, [isRunning]);

    useEffect(() => {
        if (isRunning) {
            // Adjust start time to account for existing elapsed
            startTimeRef.current = Date.now() - elapsed;
            requestRef.current = requestAnimationFrame(animate);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
        // We act on isRunning change. elapsed is used as seed but we don't want to re-run on elapsed change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRunning, animate]);

    const toggle = () => {
        setIsRunning(!isRunning);
    };

    const reset = () => {
        setIsRunning(false);
        setElapsed(0);
        setLaps([]);
    };

    const lap = () => {
        setLaps([elapsed, ...laps]);
    };

    const formatTime = (ms: number) => {
        const m = Math.floor(ms / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        const cs = Math.floor((ms % 1000) / 10);
        return (
            <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'var(--font-family-display)', lineHeight: 1 }}>
                <span style={{ fontSize: '6rem', fontWeight: 500 }}>{m.toString().padStart(2, '0')}</span>
                <span style={{ fontSize: '6rem', fontWeight: 500 }}>:</span>
                <span style={{ fontSize: '6rem', fontWeight: 500 }}>{s.toString().padStart(2, '0')}</span>
                <span style={{ fontSize: '3rem', fontWeight: 400, width: '80px', textAlign: 'left', marginLeft: '8px' }}>.{cs.toString().padStart(2, '0')}</span>
            </div>
        );
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <PageTransition>
                <div style={{ marginTop: '48px', marginBottom: '48px' }}>
                    {formatTime(elapsed)}
                </div>

                <div style={{ display: 'flex', gap: '32px', marginBottom: '48px' }}>
                    <button
                        onClick={reset}
                        disabled={elapsed === 0}
                        style={{
                            width: '64px', height: '64px', borderRadius: '32px', border: 'none',
                            backgroundColor: 'var(--md-sys-color-surface-container)', color: 'var(--md-sys-color-on-surface)',
                            cursor: elapsed === 0 ? 'default' : 'pointer', opacity: elapsed === 0 ? 0.5 : 1
                        }}
                    >
                        <span className="material-icon">refresh</span>
                    </button>

                    <button
                        onClick={toggle}
                        style={{
                            width: '80px', height: '80px', borderRadius: '40px', border: 'none',
                            backgroundColor: isRunning ? 'var(--md-sys-color-tertiary)' : 'var(--md-sys-color-primary)',
                            color: isRunning ? 'var(--md-sys-color-on-tertiary)' : 'var(--md-sys-color-on-primary)',
                            cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        <span className="material-icon" style={{ fontSize: '36px' }}>{isRunning ? 'pause' : 'play_arrow'}</span>
                    </button>

                    <button
                        onClick={lap}
                        disabled={!isRunning}
                        style={{
                            width: '64px', height: '64px', borderRadius: '32px', border: 'none',
                            backgroundColor: 'var(--md-sys-color-surface-container)', color: 'var(--md-sys-color-on-surface)',
                            cursor: !isRunning ? 'default' : 'pointer', opacity: !isRunning ? 0.5 : 1
                        }}
                    >
                        <span className="material-icon">flag</span>
                    </button>
                </div>

                <div style={{ width: '100%', maxHeight: '300px', overflowY: 'auto' }}>
                    {laps.map((lapTime, index) => (
                        <div key={laps.length - index} style={{
                            display: 'flex', justifyContent: 'space-between', padding: '16px 24px',
                            borderBottom: '1px solid var(--md-sys-color-outline-variant)'
                        }}>
                            <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Lap {laps.length - index}</span>
                            <span style={{ fontFamily: 'monospace', fontSize: '18px' }}>
                                {Math.floor(lapTime / 60000).toString().padStart(2, '0')}:
                                {Math.floor((lapTime % 60000) / 1000).toString().padStart(2, '0')}.
                                {Math.floor((lapTime % 1000) / 10).toString().padStart(2, '0')}
                            </span>
                        </div>
                    ))}
                </div>
            </PageTransition>
        </div>
    );
}
