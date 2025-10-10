import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    university : null,
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
    }
  }
});

export const { set, remove} = universitySlice.actions;
export default universitySlice.reducer;
