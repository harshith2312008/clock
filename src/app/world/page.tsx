"use client";

import React, { useState, useEffect } from 'react';
import { useTime } from '@/hooks/useTime';
import PageTransition from '@/components/PageTransition';

export default function WorldClockPage() {
    const [savedTimezones, setSavedTimezones] = useState<string[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('world_clock_timezones');
        if (stored) {
            setSavedTimezones(JSON.parse(stored));
        } else {
            setSavedTimezones(['America/New_York', 'Europe/London', 'Asia/Tokyo']);
        }
    }, []);

    const saveTimezones = (newZones: string[]) => {
        setSavedTimezones(newZones);
        localStorage.setItem('world_clock_timezones', JSON.stringify(newZones));
    };

    const removeTimezone = (tz: string) => {
        saveTimezones(savedTimezones.filter(t => t !== tz));
    };

    const addTimezone = (tz: string) => {
        if (!savedTimezones.includes(tz)) {
            saveTimezones([...savedTimezones, tz]);
        }
        setIsAdding(false);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <PageTransition>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2>World Clock</h2>
                    <button
                        onClick={() => setIsAdding(true)}
                        style={{
                            backgroundColor: 'var(--md-sys-color-primary-container)',
                            color: 'var(--md-sys-color-on-primary-container)',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 500
                        }}
                    >
                        <span className="material-icon">add</span>
                        Add City
                    </button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {savedTimezones.map(tz => (
                        <WorldClockCard key={tz} timezone={tz} onDelete={() => removeTimezone(tz)} />
                    ))}
                </div>

                {isAdding && (
                    <CitySearchModal onClose={() => setIsAdding(false)} onSelect={addTimezone} />
                )}
            </PageTransition>
        </div>
    );
}

function WorldClockCard({ timezone, onDelete }: { timezone: string, onDelete: () => void }) {
    const time = useTime();

    // Parse timezone to get city name roughly
    const city = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;

    // Get time in that timezone
    const timeString = time.toLocaleTimeString([], {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    const dateString = time.toLocaleDateString([], {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });

    // Calculate offset relative to local
    // Simplified, just showing time

    return (
        <div style={{
            backgroundColor: 'var(--md-sys-color-surface-container)',
            borderRadius: 'var(--shape-corner-large)',
            padding: '24px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '140px',
            transition: 'transform 0.2s',
            // Simple hover effect could be added
        }}>
            <button
                onClick={onDelete}
                style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    opacity: 0.6
                }}
            >
                <span className="material-icon" style={{ fontSize: '20px' }}>close</span>
            </button>

            <div>
                <span style={{
                    display: 'block',
                    fontSize: '14px',
                    color: 'var(--md-sys-color-error)', // Just a color for 'Today'/'Tomorrow' could be logic, but here simple
                    marginBottom: '4px'
                }}>
                    {dateString}
                </span>
                <h3 style={{ fontSize: '24px', fontWeight: '500' }}>{city}</h3>
            </div>

            <div style={{ fontSize: '48px', fontWeight: '300', alignSelf: 'flex-end', lineHeight: 1 }}>
                {timeString}
            </div>
        </div>
    );
}

function CitySearchModal({ onClose, onSelect }: { onClose: () => void, onSelect: (tz: string) => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/timezones?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.timezones || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 300); // Debounce

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                backgroundColor: 'var(--md-sys-color-surface)',
                padding: '24px',
                borderRadius: '28px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                    <span className="material-icon">search</span>
                    <input
                        autoFocus
                        placeholder="Search City or Timezone"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            fontSize: '18px',
                            color: 'var(--md-sys-color-on-surface)',
                            outline: 'none'
                        }}
                    />
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="material-icon">close</span>
                    </button>
                </div>

                <div style={{ borderTop: '1px solid var(--md-sys-color-outline-variant)', paddingTop: '8px', overflowY: 'auto' }}>
                    {loading && <div style={{ padding: '16px', textAlign: 'center' }}>Loading...</div>}
                    {!loading && results.map(tz => (
                        <button
                            key={tz}
                            onClick={() => onSelect(tz)}
                            style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                padding: '12px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--md-sys-color-on-surface)',
                                borderRadius: '8px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-variant)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            {tz}
                        </button>
                    ))}
                    {!loading && query && results.length === 0 && (
                        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
                            No results found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
