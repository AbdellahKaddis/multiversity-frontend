import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    applicant : null,
};

const applicantSlice = createSlice({
    name : 'applicant',
    initialState,
    reducers : {
        setApplicant : (state, action)=>{
            state.applicant = action.payload;
        }
    }
});

export const { setApplicant } = applicantSlice.actions;
export default applicantSlice.reducer;