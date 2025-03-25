import { isSouthIndianLocation } from '../utils/themeUtils';

export const authMiddleware = () => next => async action => {
    // Check if the action is related to authentication
    if (action.type?.includes('auth/') || action.type?.includes('clerk/')) {
        const isInSouthIndia = await isSouthIndianLocation();
        const identifier = action.payload?.identifier;

        if (identifier) {
            const isEmail = identifier.includes('@');
            
            if (isInSouthIndia && isEmail) {
                throw new Error('Only phone number sign-in is allowed in your region');
            }
            if (!isInSouthIndia && !isEmail) {
                throw new Error('Only email sign-in is allowed in your region');
            }
        }
    }
    
    return next(action);
};