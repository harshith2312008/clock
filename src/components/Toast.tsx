"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, duration]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        left: '50%',
                        x: '-50%',
                        zIndex: 2000,
                        backgroundColor: 'var(--md-sys-color-inverse-surface)',
                        color: 'var(--md-sys-color-inverse-on-surface)',
                        padding: '14px 24px',
                        borderRadius: '28px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        fontSize: '14px',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none' // Let clicks pass through if needed, though usually toasts block nothing
                    }}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
