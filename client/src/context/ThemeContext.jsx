import React, { createContext, useState, useEffect } from 'react';
import { getLocationDetails } from '../utils/themeUtils';
import LoadingSpinner from '../components/LoadingSpinner';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isLightTheme, setIsLightTheme] = useState(false);
    const [locationChecked, setLocationChecked] = useState(false);

    useEffect(() => {
        console.log('🎨 ThemeProvider: Initializing...');
        
        const checkLocationAndSetTheme = async () => {
            console.log('🎨 ThemeProvider: Checking location...');
            
            try {
                const location = await getLocationDetails();
                if (location) {
                    console.log('🎨 ThemeProvider: Location found:', 
                        `${location.city}, ${location.state}, ${location.country}`
                    );
                    
                    const southIndianStates = [
                        'Tamil Nadu',
                        'Kerala',
                        'Karnataka',
                        'Andhra Pradesh',
                        'Telangana'
                    ];

                    const isFromSouth = southIndianStates.includes(location.state);
                    const theme = isFromSouth ? 'Light Theme' : 'Dark Theme';
                    console.log(`🎨 ThemeProvider: Setting ${theme} for ${location.state}`);
                    
                    setIsLightTheme(isFromSouth);
                    localStorage.setItem('userLocation', isFromSouth ? 'south-india' : 'non-south-india');
                } else {
                    console.log('🎨 ThemeProvider: No location data, defaulting to dark theme');
                    setIsLightTheme(false);
                }
            } catch (error) {
                console.error('🎨 ThemeProvider Error:', error);
                setIsLightTheme(false);
            } finally {
                console.log('🎨 ThemeProvider: Location check complete');
                setLocationChecked(true);
            }
        };

        checkLocationAndSetTheme();
    }, []);

    if (!locationChecked) {
        return <LoadingSpinner />;
    }

    console.log('🎨 ThemeProvider: Rendering with theme:', isLightTheme ? 'light' : 'dark');
    return (
        <ThemeContext.Provider value={{ isLightTheme, setIsLightTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};




