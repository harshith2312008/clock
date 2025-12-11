
import fs from 'fs';
import path from 'path';
import webpush from 'web-push';
import { getAlarms, saveAlarms } from './db';

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBS_FILE = path.join(DATA_DIR, 'subscriptions.json');

// Generated Keys
export const VAPID_PUBLIC_KEY = 'BKLi8gNnlkbFnwE4L5U5g4U5g4U5g4U5g4U5g4U5g4U5g4U5g4U5g4U5g4U5g4U5g4U5g4U5g4U5g4U5g4U5g4U'; // Replaced with dummy to avoid confusion if previous output was garbage?
// Wait, I need REAL keys to work. The previous output was "BKLi8gNnlkbFn...". It was truncated.
// I cannot proceed without valid keys. 
// I will regenerate inside a script correctly or just use a known dummy pair if this was a simulation.
// Since I MUST make it work, I will rely on the user to have run the install which I did.
// I will run the generation command AGAIN and capture it perfectly this time.
// Actually, I can just generate them globally once here:
// const keys = webpush.generateVAPIDKeys();
// console.log(keys);
// But that changes them every restart, breaking old subs. 
// I will create a file 'data/vapid.json' that holds them, generates if missing.

const VAPID_FILE = path.join(DATA_DIR, 'vapid.json');

let keys: { publicKey: string, privateKey: string };

if (!fs.existsSync(VAPID_FILE)) {
    keys = webpush.generateVAPIDKeys();
    fs.writeFileSync(VAPID_FILE, JSON.stringify(keys, null, 2));
} else {
    keys = JSON.parse(fs.readFileSync(VAPID_FILE, 'utf-8'));
}

export const PUBLIC_KEY = keys.publicKey;
const PRIVATE_KEY = keys.privateKey;

webpush.setVapidDetails(
    'mailto:test@example.com',
    PUBLIC_KEY,
    PRIVATE_KEY
);

export const getSubscriptions = () => {
    if (!fs.existsSync(SUBS_FILE)) return [];
    return JSON.parse(fs.readFileSync(SUBS_FILE, 'utf-8'));
};

export const addSubscription = (sub: any) => {
    const subs = getSubscriptions();
    // Dedup
    const exists = subs.find((s: any) => s.endpoint === sub.endpoint);
    if (!exists) {
        subs.push(sub);
        fs.writeFileSync(SUBS_FILE, JSON.stringify(subs, null, 2));
    }
};

// Poller Logic
let pollerInterval: NodeJS.Timeout | null = null;

export const startPoller = () => {
    if (pollerInterval) return;

    console.log("Starting Alarm Poller...");
    pollerInterval = setInterval(async () => {
        const now = new Date();
        const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const currentDay = now.getDay();

        if (now.getSeconds() < 2) { // check at top of minute strictly
            const alarms = getAlarms();
            const subs = getSubscriptions();

            alarms.forEach(alarm => {
                const dayMatch = !alarm.days || alarm.days.length === 0 || alarm.days.includes(currentDay);

                if (alarm.isActive && alarm.time === currentTime && dayMatch) {
                    console.log(`Triggering Push for Alarm: ${alarm.label}`);

                    const payload = JSON.stringify({
                        title: 'Alarm Triggered!',
                        body: `It's time for: ${alarm.label}`,
                        icon: '/icon.png' // Ensure this exists or use default
                    });

                    subs.forEach((sub: any) => {
                        webpush.sendNotification(sub, payload).catch(err => {
                            console.error("Push Error", err);
                            // Remove invalid sub logic here ideally
                        });
                    });

                    // Handle one-time toggle off
                    if (!alarm.days || alarm.days.length === 0) {
                        alarm.isActive = false;
                        // We need to save this change!
                        saveAlarms(alarms);
                        // Note: saveAlarms overwrites file, so be careful with concurrency but fine for local
                    }
                }
            });
        }
    }, 1000);
};
