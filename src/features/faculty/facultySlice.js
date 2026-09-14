import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    faculty : null,
    faculties:null,
};

const facultySlice = createSlice({
    name : 'faculty',
    initialState,
    reducers : {
        setFaculty : (state, action)=>{
            state.faculty = action.payload;
        },
        setUniversityFaculties : (state, action)=>{
            state.faculties = action.payload;
        },
    }
});

export const { setFaculty, setUniversityFaculties } = facultySlice.actions;
export default facultySlice.reducer;