import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import store from './store';

const AppWrapper = () => {
    const [clerkConfig, setClerkConfig] = useState(null);

    useEffect(() => {
        const userLocation = localStorage.getItem('userLocation') || 'non-south-india';
        
        const config = {
            appearance: {
                variables: {
                    colorPrimary: '#8ab4f8',
                    colorBackground: '#202124',
                    colorText: '#ffffff',
                    colorTextSecondary: '#bdc1c6',
                },
            },
            signIn: {
                firstFactorOptions: userLocation === 'south-india' 
                    ? [{ strategy: "phone_code", supportedIdentifierTypes: ["phone_number"] }]
                    : [{ strategy: "email_code", supportedIdentifierTypes: ["email_address"] }],
            },
            signUp: {
                disabled: true
            }
        };

        setClerkConfig(config);
    }, []);

    if (!clerkConfig) return null;

    return (
        <ThemeProvider>
            <ClerkProvider 
                publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}
                {...clerkConfig}
            >
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </ClerkProvider>
        </ThemeProvider>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <AppWrapper />
    </Provider>
);

