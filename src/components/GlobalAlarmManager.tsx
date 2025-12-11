"use client";

import React, { useState, useEffect, useRef } from 'react';

type Alarm = {
    id: string;
    time: string;
    label: string;
    isActive: boolean;
    days?: number[];
};

export default function GlobalAlarmManager() {
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [triggeredAlarm, setTriggeredAlarm] = useState<Alarm | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);
    const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch alarms periodically
    useEffect(() => {
        const fetchAlarms = async () => {
            try {
                const res = await fetch('/api/alarms');
                if (res.ok) {
                    const data = await res.json();
                    setAlarms(data);
                }
            } catch (e) {
                console.error("Failed to fetch alarms", e);
            }
        };
        fetchAlarms();
        const interval = setInterval(fetchAlarms, 2000); // 2s polling
        return () => clearInterval(interval);
    }, []);

    // Prime Audio Context on Interaction
    useEffect(() => {
        const prime = () => {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!audioCtxRef.current) {
                audioCtxRef.current = new AudioContext();
            }
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume().catch(() => { });
            }
        };
        window.addEventListener('click', prime, { once: true });
        window.addEventListener('keydown', prime, { once: true });
        window.addEventListener('touchstart', prime, { once: true });
        return () => {
            window.removeEventListener('click', prime);
            window.removeEventListener('keydown', prime);
            window.removeEventListener('touchstart', prime);
        };
    }, []);

    const startAlarmSound = () => {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContext();
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
            ctx.resume().catch(e => console.error("Audio resume failed", e));
        }

        // Stop existing
        if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
        if (oscillatorRef.current) {
            try { oscillatorRef.current.stop(); } catch (e) { }
            oscillatorRef.current = null;
        }

        const playBeep = () => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'square';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.4);

            gain.gain.setValueAtTime(0.5, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.4);

            oscillatorRef.current = osc;
        };

        playBeep();
        loopIntervalRef.current = setInterval(playBeep, 600);
    };

    const stopAlarmSound = () => {
        if (loopIntervalRef.current) {
            clearInterval(loopIntervalRef.current);
            loopIntervalRef.current = null;
        }
        if (oscillatorRef.current) {
            try { oscillatorRef.current.stop(); } catch (e) { }
            oscillatorRef.current = null;
        }
    };

    useEffect(() => {
        const checkInterval = setInterval(() => {
            const now = new Date();
            // Manual formatting to ensure HH:MM matches exactly regardless of locale
            const hh = now.getHours().toString().padStart(2, '0');
            const mm = now.getMinutes().toString().padStart(2, '0');
            const currentTime = `${hh}:${mm}`;
            const currentDay = now.getDay();

            if (now.getSeconds() === 0 && !triggeredAlarm) {
                // Find ALL matching alarms (in case multiple set for same time)
                const match = alarms.find(alarm => {
                    const dayMatch = !alarm.days || alarm.days.length === 0 || alarm.days.includes(currentDay);
                    return alarm.isActive && alarm.time === currentTime && dayMatch;
                });

                if (match) {
                    console.log("Global Alarm Triggered:", match);
                    setTriggeredAlarm(match);
                    startAlarmSound();

                    // Disable one-time alarms
                    if (!match.days || match.days.length === 0) {
                        setAlarms(prev => prev.map(a => a.id === match.id ? { ...a, isActive: false } : a));
                        fetch('/api/alarms', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: match.id, isActive: false })
                        });
                    }
                }
            }
        }, 1000);
        return () => clearInterval(checkInterval);
    }, [alarms, triggeredAlarm]);

    const handleDismiss = () => {
        stopAlarmSound();
        setTriggeredAlarm(null);
    };

    const handleSnooze = async () => {
        stopAlarmSound();
        if (triggeredAlarm) {
            const now = new Date();
            now.setMinutes(now.getMinutes() + 10);
            const snoozeTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

            const snoozed = {
                id: 'snooze-' + Date.now(),
                time: snoozeTime,
                label: `Snoozed: ${triggeredAlarm.label}`,
                isActive: true,
                days: []
            };

            // Save snooze
            await fetch('/api/alarms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(snoozed)
            });
            // Refresh alarms
            const res = await fetch('/api/alarms');
            const data = await res.json();
            setAlarms(data);
        }
        setTriggeredAlarm(null);
    };


    if (!triggeredAlarm) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--md-sys-color-scrim, rgba(0,0,0,0.9))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999, // Max z-index
            flexDirection: 'column',
            color: 'var(--md-sys-color-on-surface)',
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{
                backgroundColor: 'var(--md-sys-color-surface-container-high)',
                padding: '48px',
                borderRadius: '28px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                minWidth: '320px',
                animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <style jsx>{`
                    @keyframes popIn {
                        from { opacity: 0; transform: scale(0.8); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    @keyframes ring {
                        0% { transform: rotate(0deg); }
                        10% { transform: rotate(-10deg); }
                        20% { transform: rotate(10deg); }
                        30% { transform: rotate(-10deg); }
                        40% { transform: rotate(10deg); }
                        50% { transform: rotate(0deg); }
                    }
                `}</style>
                <span className="material-icon" style={{
                    fontSize: '84px',
                    color: 'var(--md-sys-color-error)',
                    marginBottom: '24px',
                    animation: 'ring 1s infinite'
                }}>notifications_active</span>

                <h2 style={{ fontSize: '6rem', margin: '0 0 8px', fontWeight: 500, fontFamily: 'var(--font-family-display)' }}>{triggeredAlarm.time}</h2>
                <p style={{ fontSize: '2rem', marginBottom: '48px', color: 'var(--md-sys-color-on-surface-variant)' }}>{triggeredAlarm.label}</p>

                <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
                    <button
                        onClick={handleSnooze}
                        style={{
                            backgroundColor: 'var(--md-sys-color-surface-container)',
                            color: 'var(--md-sys-color-on-surface)',
                            padding: '20px 40px',
                            fontSize: '1.5rem',
                            border: 'none',
                            borderRadius: '40px',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        Snooze
                    </button>
                    <button
                        onClick={handleDismiss}
                        style={{
                            backgroundColor: 'var(--md-sys-color-error)',
                            color: 'var(--md-sys-color-on-error)',
                            padding: '20px 56px',
                            fontSize: '1.5rem',
                            border: 'none',
                            borderRadius: '40px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                    >
                        Stop
                    </button>
                </div>
            </div>
        </div>
    );
}
