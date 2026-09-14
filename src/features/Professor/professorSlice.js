import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    professor : null,
};

const professorSlice = createSlice({
    name : 'professor',
    initialState,
    reducers : {
        setProfessor : (state, action)=>{
            state.professor = action.payload;
        },
    }
});

export const { setProfessor } = professorSlice.actions;
export default professorSlice.reducer;