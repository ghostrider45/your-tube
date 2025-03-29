import { useEffect, useCallback } from 'react';
import { getLocationDetails } from '../utils/themeUtils';

const LocationTracker = () => {
    const logLocation = useCallback(async () => {
        try {
            const location = await getLocationDetails();
            if (location) {
                console.log('📍 Current Location:', `${location.city}, ${location.state}, ${location.country}`);
                console.log('📌 Coordinates:', `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`);
                
                // Store location in localStorage for persistence
                localStorage.setItem('userLocation', JSON.stringify({
                    city: location.city,
                    state: location.state,
                    country: location.country,
                    lastUpdated: new Date().toISOString()
                }));
            }
        } catch (error) {
            console.error('📍 Location Error:', error.message);
        }
    }, []);

    useEffect(() => {
        // Log location immediately on component mount
        logLocation();

        // Set up periodic location checking (every 5 minutes)
        const intervalId = setInterval(logLocation, 5 * 60 * 1000);

        // Log location on tab focus
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                logLocation();
            }
        };

        // Log location on online/offline events
        const handleOnline = () => {
            console.log('🌐 Network connection restored. Updating location...');
            logLocation();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('online', handleOnline);

        // Cleanup
        return () => {
            clearInterval(intervalId);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('online', handleOnline);
        };
    }, [logLocation]);

    return null;
};

export default LocationTracker;



