const southIndianStates = [
    'Tamil Nadu',
    'Kerala',
    'Karnataka',
    'Andhra Pradesh',
    'Telangana'
];

export const getLocationDetails = async () => {
    console.log('📍 Location Service: Initializing...');
    
    try {
        // First check cache
        const cachedLocation = localStorage.getItem('cachedLocation');
        if (cachedLocation) {
            const parsed = JSON.parse(cachedLocation);
            const cacheAge = Date.now() - parsed.timestamp;
            
            if (cacheAge < 3600000) { // 1 hour
                console.log('📍 Location: Using cached data -', 
                    `${parsed.city}, ${parsed.state}, ${parsed.country}`);
                return parsed;
            }
        }

        // Get fresh location data
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });

        const { latitude, longitude } = position.coords;
        
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'YourTube/1.0'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`OpenStreetMap API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        const locationInfo = {
            city: data.address?.city || 
                  data.address?.town || 
                  data.address?.village || 
                  'Unknown',
            state: data.address?.state || 'Unknown',
            country: data.address?.country || 'Unknown',
            coords: { latitude, longitude }
        };

        console.log('📍 Location: Detected -', 
            `${locationInfo.city}, ${locationInfo.state}, ${locationInfo.country}`);

        // Cache the location
        localStorage.setItem('cachedLocation', JSON.stringify({
            ...locationInfo,
            timestamp: Date.now()
        }));

        return locationInfo;
    } catch (error) {
        console.error('📍 Location: Detection failed -', error.message);
        return null;
    }
};

export const isSouthIndianLocation = async () => {
    const location = await getLocationDetails();
    return location ? southIndianStates.includes(location.state) : false;
};









