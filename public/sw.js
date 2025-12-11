
self.addEventListener('push', function (event) {
    const data = event.data.json();

    // Keep alive
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/icon-192x192.png', // Assuming Next.js public folder has icons or fallback
            requireInteraction: true, // Keep it visible
            vibrate: [200, 100, 200, 100, 200, 100, 400], // Vibration pattern
            actions: [
                { action: 'snooze', title: 'Snooze' },
                { action: 'dismiss', title: 'Dismiss' }
            ]
        })
    );

    // Play sound via client? 
    // Service Workers cannot play Audio objects directly easily, usually notifications handle sound.
    // But we can try to open a window.
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (event.action === 'snooze') {
        // Handle snooze API call?
        // clients.openWindow('/?action=snooze&id=...')
    } else {
        // Focus window
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(windowClients => {
                for (let i = 0; i < windowClients.length; i++) {
                    const client = windowClients[i];
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow('/alarm');
                }
            })
        );
    }
});
