"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type AlarmData = {
    id?: string;
    time: string; // HH:mm
    label: string;
    days: number[]; // 0-6
    isActive: boolean;
};

interface AlarmEditorProps {
    initialData?: AlarmData;
    onSave: (data: AlarmData) => void;
    onCancel: () => void;
}

export default function AlarmEditor({ initialData, onSave, onCancel }: AlarmEditorProps) {
    // Parse initial time
    const initialTime = initialData?.time || '08:00';
    const [h, m] = initialTime.split(':');

    const [hour, setHour] = useState(parseInt(h));
    const [minute, setMinute] = useState(parseInt(m));
    const [label, setLabel] = useState(initialData?.label || 'Alarm');
    const [days, setDays] = useState<number[]>(initialData?.days || []);

    const handleSave = () => {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        onSave({
            id: initialData?.id,
            time: timeStr,
            label,
            days: days.sort(),
            isActive: true
        });
    };

    const toggleDay = (day: number) => {
        if (days.includes(day)) {
            setDays(days.filter(d => d !== day));
        } else {
            setDays([...days, day]);
        }
    };

    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                    backgroundColor: 'var(--md-sys-color-surface)',
                    padding: '24px',
                    borderRadius: '28px',
                    width: '90%',
                    maxWidth: '400px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
            >
                <h2 style={{ fontSize: '24px', marginBottom: '24px', color: 'var(--md-sys-color-on-surface)' }}>
                    {initialData ? 'Edit Alarm' : 'Add Alarm'}
                </h2>

                {/* Time Picker (Simple inputs for now, could be scroll wheel) */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <input
                            type="number"
                            min="0" max="23"
                            value={hour.toString().padStart(2, '0')}
                            onChange={(e) => {
                                let val = parseInt(e.target.value);
                                if (isNaN(val)) val = 0;
                                if (val > 23) val = 23;
                                if (val < 0) val = 0;
                                setHour(val);
                            }}
                            style={{
                                fontSize: '56px',
                                fontFamily: 'var(--font-family-display)',
                                background: 'var(--md-sys-color-surface-container-high)',
                                border: 'none',
                                borderRadius: '16px',
                                width: '96px',
                                textAlign: 'center',
                                color: 'var(--md-sys-color-on-surface)',
                                padding: '16px 0'
                            }}
                        />
                        <span style={{ fontSize: '12px', marginTop: '4px', color: 'var(--md-sys-color-on-surface-variant)' }}>Hour</span>
                    </div>
                    <span style={{ fontSize: '56px', fontWeight: 'bold', paddingBottom: '20px' }}>:</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <input
                            type="number"
                            min="0" max="59"
                            value={minute.toString().padStart(2, '0')}
                            onChange={(e) => {
                                let val = parseInt(e.target.value);
                                if (isNaN(val)) val = 0;
                                if (val > 59) val = 59;
                                if (val < 0) val = 0;
                                setMinute(val);
                            }}
                            style={{
                                fontSize: '56px',
                                fontFamily: 'var(--font-family-display)',
                                background: 'var(--md-sys-color-surface-container-high)',
                                border: 'none',
                                borderRadius: '16px',
                                width: '96px',
                                textAlign: 'center',
                                color: 'var(--md-sys-color-on-surface)',
                                padding: '16px 0'
                            }}
                        />
                        <span style={{ fontSize: '12px', marginTop: '4px', color: 'var(--md-sys-color-on-surface-variant)' }}>Minute</span>
                    </div>
                </div>

                {/* Repeat Days */}
                <div style={{ marginBottom: '24px' }}>
                    <p style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--md-sys-color-on-surface-variant)' }}>Repeat</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {weekDays.map((d, i) => {
                            const selected = days.includes(i);
                            return (
                                <button
                                    key={i}
                                    onClick={() => toggleDay(i)}
                                    style={{
                                        width: '36px', height: '36px',
                                        borderRadius: '18px',
                                        border: selected ? 'none' : '1px solid var(--md-sys-color-outline)',
                                        backgroundColor: selected ? 'var(--md-sys-color-primary)' : 'transparent',
                                        color: selected ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface)',
                                        cursor: 'pointer',
                                        fontWeight: 500
                                    }}
                                >
                                    {d}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Label */}
                <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--md-sys-color-on-surface-variant)' }}>Label</label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="Alarm Name"
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--md-sys-color-outline)',
                            backgroundColor: 'transparent',
                            color: 'var(--md-sys-color-on-surface)',
                            fontSize: '16px'
                        }}
                    />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--md-sys-color-primary)',
                            fontWeight: 500,
                            padding: '10px 24px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            backgroundColor: 'var(--md-sys-color-primary)',
                            color: 'var(--md-sys-color-on-primary)',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '10px 24px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Save
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
