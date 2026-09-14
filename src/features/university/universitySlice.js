import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    university : null,
    faculties: null,
};
const universitySlice = createSlice({
  name: "university",
  initialState,
  reducers: {
    set:(state, action) => {
      state.university = action.payload;
    },
    remove: (state) => {
      state.university = null;
    },
    setFaculties:(state, action)=>{
      state.faculties = action.payload;
    }
  }
});

export const { set, remove, setFaculties} = universitySlice.actions;
export default universitySlice.reducer;
