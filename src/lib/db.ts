import fs from 'fs';
import path from 'path';

// For local dev, we store data in data/alarms.json
const DATA_DIR = path.join(process.cwd(), 'data');
const ALARMS_FILE = path.join(DATA_DIR, 'alarms.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Ensure file exists
if (!fs.existsSync(ALARMS_FILE)) {
    fs.writeFileSync(ALARMS_FILE, JSON.stringify([]));
}

export type Alarm = {
    id: string;
    time: string; // HH:mm
    label: string;
    days: number[]; // 0-6, 0=Sunday
    isActive: boolean;
};

export const getAlarms = (): Alarm[] => {
    try {
        const data = fs.readFileSync(ALARMS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

export const saveAlarms = (alarms: Alarm[]) => {
    fs.writeFileSync(ALARMS_FILE, JSON.stringify(alarms, null, 2));
};
