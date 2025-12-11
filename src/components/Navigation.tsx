"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './Navigation.module.css';

const navItems = [
    { label: 'Clock', path: '/', icon: 'schedule' },
    { label: 'World', path: '/world', icon: 'public' },
    { label: 'Alarm', path: '/alarm', icon: 'alarm' },
    { label: 'Timer', path: '/timer', icon: 'hourglass_empty' },
    { label: 'Stopwatch', path: '/stopwatch', icon: 'timer' },
];

export default function Navigation() {
    const pathname = usePathname();

    // Helper to determine if active
    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <nav className={styles.navContainer}>
            {navItems.map((item) => (
                <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                    <motion.div
                        className={`${styles.navItem} ${isActive(item.path) ? styles.navItemActive : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            className={styles.navItemIconContainer}
                            layoutId="navPill" // Shared layout ID for potentially morphing pill eventually
                        >
                            <span className="material-icon">{item.icon}</span>
                        </motion.div>
                        <span className={styles.navLabel}>{item.label}</span>
                    </motion.div>
                </Link>
            ))}
        </nav>
    );
}
