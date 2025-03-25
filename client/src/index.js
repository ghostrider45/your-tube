import { ClerkProvider } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import Reducers from './Reducers';
import App from './App';

const AppWrapper = () => {
    const [clerkConfig, setClerkConfig] = useState(null);

    useEffect(() => {
        // Get user's location from localStorage or fetch it
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
                // Restrict to only one authentication method
                firstFactorOptions: userLocation === 'south-india' 
                    ? [{ strategy: "phone_code", supportedIdentifierTypes: ["phone_number"] }]
                    : [{ strategy: "email_code", supportedIdentifierTypes: ["email_address"] }],
            },
            // Completely disable unwanted authentication methods
            signUp: {
                // Prevent sign-ups with the wrong method
                disabled: true
            }
        };

        setClerkConfig(config);
    }, []);

    if (!clerkConfig) return null;

    return (
        <ClerkProvider 
            publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}
            {...clerkConfig}
        >
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </ClerkProvider>
    );
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    Reducers,
    composeEnhancers(applyMiddleware(thunk))
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <AppWrapper />
    </Provider>
);


