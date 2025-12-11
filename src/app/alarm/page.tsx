"use client";

import React, { useState, useEffect } from 'react';
import PageTransition from '@/components/PageTransition';
import AlarmEditor, { AlarmData } from '@/components/AlarmEditor';
import Toast from '@/components/Toast';

type Alarm = {
    id: string;
    time: string;
    label: string;
    isActive: boolean;
    days?: number[];
};

export default function AlarmPage() {
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Toast state
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Push State
    const [pushEnabled, setPushEnabled] = useState(false);

    useEffect(() => {
        // Check sw
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
            setPushEnabled(true);
        }
    }, []);

    // Helper (Basic duration text)
    const getDurationText = (timeStr: string, days?: number[]) => {
        const now = new Date();
        const [h, m] = timeStr.split(':').map(Number);
        let target = new Date();
        target.setHours(h, m, 0, 0);

        if (target <= now) target.setDate(target.getDate() + 1);

        if (days && days.length > 0) {
            while (!days.includes(target.getDay())) {
                target.setDate(target.getDate() + 1);
            }
        }

        const diffMs = target.getTime() - now.getTime();
        const diffMins = Math.round(diffMs / 60000);
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;

        if (hours === 0 && mins === 0) return "less than a minute";

        const parts = [];
        if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
        if (mins > 0) parts.push(`${mins} minute${mins > 1 ? 's' : ''}`);

        return parts.join(' and ');
    };


    // Helper to convert VAPID key
    function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    const enablePush = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            setToastMessage('Push notifications not supported');
            setShowToast(true);
            return;
        }

        try {
            const register = await navigator.serviceWorker.register('/sw.js');
            const resKey = await fetch('/api/push');
            if (!resKey.ok) throw new Error('Failed to fetch server key');

            const { publicKey } = await resKey.json();

            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey)
            });

            await fetch('/api/push', {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: { 'Content-Type': 'application/json' }
            });

            setPushEnabled(true);
            setToastMessage('Background Alarms Enabled!');
            setShowToast(true);
        } catch (e: any) {
            console.error(e);
            // Show actual error message for debugging
            setToastMessage(`Failed: ${e.message || 'Unknown error'}`);
            setShowToast(true);
        }
    };

    const toggleAlarm = async (id: string, currentState: boolean) => {
        const updatedAlarms = alarms.map(a => a.id === id ? { ...a, isActive: !currentState } : a);
        setAlarms(updatedAlarms);

        const alarm = updatedAlarms.find(a => a.id === id);
        if (alarm && !currentState) {
            const duration = getDurationText(alarm.time, alarm.days);
            setToastMessage(`Alarm set for ${duration} from now`);
            setShowToast(true);
        }

        await fetch('/api/alarms', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, isActive: !currentState })
        });
    };

    const deleteAlarm = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setAlarms(alarms.filter(a => a.id !== id));
        await fetch(`/api/alarms?id=${id}`, { method: 'DELETE' });
    };

    useEffect(() => {
        const fetchAlarms = async () => {
            try {
                const res = await fetch('/api/alarms');
                const data = await res.json();
                setAlarms(data);
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchAlarms();
        // Poll less frequently just to sync UI if changed globally
        const interval = setInterval(fetchAlarms, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSaveAlarm = async (data: AlarmData) => {
        if (data.id) {
            setAlarms(alarms.map(a => a.id === data.id ? { ...a, ...data } : a));
            await fetch('/api/alarms', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            const res = await fetch('/api/alarms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const newAlarm = await res.json();
            setAlarms([...alarms, newAlarm]);
        }

        const duration = getDurationText(data.time, data.days && data.days.length ? data.days : undefined);
        setToastMessage(`Alarm set for ${duration} from now`);
        setShowToast(true);

        setEditingAlarm(null);
        setIsCreating(false);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', position: 'relative' }}>
            <PageTransition>
                <header style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 400 }}>Alarms</h2>
                        <button
                            onClick={() => setIsCreating(true)}
                            style={{
                                backgroundColor: 'var(--md-sys-color-primary)',
                                color: 'var(--md-sys-color-on-primary)',
                                border: 'none',
                                width: '56px',
                                height: '56px',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }}
                        >
                            <span className="material-icon">add</span>
                        </button>
                    </div>

                    {!pushEnabled && (
                        <div style={{ backgroundColor: 'var(--md-sys-color-secondary-container)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ color: 'var(--md-sys-color-on-secondary-container)' }}>
                                <strong style={{ display: 'block' }}>Enable Background Alarms</strong>
                                <span style={{ fontSize: '14px', opacity: 0.8 }}>Get notifications even if the app is closed.</span>
                            </div>
                            <button
                                onClick={enablePush}
                                style={{
                                    backgroundColor: 'var(--md-sys-color-primary)',
                                    color: 'var(--md-sys-color-on-primary)',
                                    border: 'none',
                                    borderRadius: '20px',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                Enable
                            </button>
                        </div>
                    )}
                </header>

                {loading ? <div style={{ textAlign: 'center' }}>Loading...</div> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {alarms.length === 0 && <p style={{ textAlign: 'center', color: 'var(--md-sys-color-outline)' }}>No alarms set</p>}
                        {alarms.map(alarm => (
                            <div key={alarm.id}
                                onClick={() => setEditingAlarm({ ...alarm, days: alarm.days || [] })}
                                style={{
                                    backgroundColor: 'var(--md-sys-color-surface-container)',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}>
                                <div style={{ opacity: alarm.isActive ? 1 : 0.5 }}>
                                    <div style={{ fontSize: '48px', lineHeight: 1, fontFamily: 'var(--font-family-display)' }}>
                                        {alarm.time}
                                    </div>
                                    <div style={{ color: 'var(--md-sys-color-on-surface-variant)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span>{alarm.label}</span>
                                        {alarm.days && alarm.days.length > 0 && (
                                            <span style={{ fontSize: '12px', opacity: 0.8 }}>
                                                • {alarm.days.length === 7 ? 'Every day' :
                                                    alarm.days.map(d => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d]).join(' ')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <button
                                        onClick={(e) => deleteAlarm(alarm.id, e)}
                                        style={{ background: 'none', border: 'none', color: 'var(--md-sys-color-error)', cursor: 'pointer' }}
                                    >
                                        <span className="material-icon">delete</span>
                                    </button>
                                    <Switch checked={alarm.isActive} onChange={() => toggleAlarm(alarm.id, alarm.isActive)} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </PageTransition>

            {/* Editor Modal */}
            {(isCreating || editingAlarm) && (
                <AlarmEditor
                    initialData={editingAlarm ? { ...editingAlarm, days: editingAlarm.days || [] } : undefined}
                    onSave={handleSaveAlarm}
                    onCancel={() => { setIsCreating(false); setEditingAlarm(null); }}
                />
            )}

            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}

function Switch({ checked, onChange }: { checked: boolean, onChange: () => void }) {
    return (
        <div
            onClick={onChange}
            style={{
                width: '52px',
                height: '32px',
                backgroundColor: checked ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)',
                borderRadius: '16px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                border: checked ? 'none' : '2px solid var(--md-sys-color-outline)'
            }}
        >
            <div style={{
                width: '16px',
                height: '16px', // thumb
                backgroundColor: checked ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-surface)',
                borderRadius: '50%',
                position: 'absolute',
                top: '50%',
                left: checked ? 'calc(100% - 24px)' : '8px', // Simple math
                transform: 'translateY(-50%) scale(1.5)',
                transition: 'left 0.2s'
            }} />
        </div>
    );
}
