import * as api from "../Api";
import { setcurrentuser } from "./currentuser";
import { getLocationDetails } from '../utils/themeUtils';

export const login = (authdata) => async (dispatch) => {
    try {
        const locationDetails = await getLocationDetails();
        const location = locationDetails 
            ? `${locationDetails.city}, ${locationDetails.state}, ${locationDetails.country}`
            : 'Unknown';

        // Include location in auth data
        const { data } = await api.login({ ...authdata, location });
        
        dispatch({ type: "AUTH", data });
        dispatch(setcurrentuser(data.token));
        dispatch(setcurrentuser(JSON.parse(localStorage.getItem('Profile'))));
    } catch (error) {
        alert(error);
    }
};



