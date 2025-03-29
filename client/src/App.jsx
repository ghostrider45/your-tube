import React, { useContext, useEffect } from 'react';
import { ThemeContext } from './context/ThemeContext';
import Allroutes from './Allroutes';
import LocationTracker from './components/LocationTracker';

function App() {
    const { isLightTheme } = useContext(ThemeContext);

    useEffect(() => {
        document.body.className = isLightTheme ? 'light-theme' : 'dark-theme';
    }, [isLightTheme]);

    return (
        <div className={`App ${isLightTheme ? 'light-theme' : 'dark-theme'}`}>
            <LocationTracker />
            <Allroutes />
        </div>
    );
}

export default App;



