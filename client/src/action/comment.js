import * as api from "../Api";

export const editcomment=(commentdata)=>async(dispatch)=>{
    try {
        const {id,commentbody}=commentdata
        const {data}=await api.editcomment(id,commentbody)
        dispatch({type:"EDIT_COMMENT",payload:data})
        dispatch(getallcomment())
    } catch (error) {
        console.log(error)
    }
}

export const postcomment = (commentdata) => async (dispatch) => {
    try {
        // Get cached location from localStorage
        const cachedLocation = localStorage.getItem('cachedLocation');
        const location = cachedLocation ? JSON.parse(cachedLocation) : null;

        // Add location to comment data
        const commentWithLocation = {
            ...commentdata,
            location
        };

        const { data } = await api.postcomment(commentWithLocation);
        dispatch({ type: "POST_COMMENT", payload: data });
        dispatch(getallcomment());
    } catch (error) {
        console.log(error);
    }
};
export const getallcomment=()=>async(dispatch)=>{
    try {
        const {data}=await api.getallcomment()
        // console.log(data)
        dispatch({type:"FETCH_ALL_COMMENTS",payload:data})
    } catch (error) {
        console.log(error)
    }
}

export const deletecomment=(id)=>async(dispatch)=>{
    try {
        await api.deletecomment(id)
        dispatch(getallcomment())
    } catch (error) {
        console.log(error)
    }
}

export const likeComment = (id) => async (dispatch) => {
    try {
        await api.likeComment(id);
        dispatch(getallcomment());
    } catch (error) {
        console.log(error);
    }
};

export const dislikeComment = (id) => async (dispatch) => {
    try {
        await api.dislikeComment(id);
        dispatch(getallcomment());
    } catch (error) {
        console.log(error);
    }
};


