"use client";

import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

    useEffect(() => {
        // Check local storage or system preference
        const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (stored) {
            setTheme(stored);
            document.documentElement.setAttribute('data-theme', stored);
        } else {
            setTheme('system');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--md-sys-color-on-surface-variant)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '50%',
                transition: 'background-color 0.2s'
            }}
            title="Toggle Theme"
        >
            <span className="material-icon">
                {theme === 'dark' ? 'dark_mode' : 'light_mode'}
            </span>
        </button>
    );
}
