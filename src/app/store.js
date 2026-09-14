import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/auth/authSlice';
import universityReducer from '../features/university/universitySlice';
import facultyReducer from '../features/faculty/facultySlice';
import professorReducer from  '../features/Professor/professorSlice';
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    university: universityReducer,
    faculty:facultyReducer,
    professor: professorReducer
  },
});
