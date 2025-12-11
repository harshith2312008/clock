import { useState, useEffect } from 'react';

export function useTime() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        // Initial sync
        setTime(new Date());

        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return time;
}
