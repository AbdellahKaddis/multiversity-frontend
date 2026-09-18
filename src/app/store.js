import { configureStore } from '@reduxjs/toolkit';
import applicantReducer from '../features/applicant/applicantSlice';
import authReducer from '../features/auth/authSlice';
import universityReducer from '../features/university/universitySlice';
import facultyReducer from '../features/faculty/facultySlice';
import professorReducer from  '../features/Professor/professorSlice';


export const store = configureStore({
  reducer: {
    application: applicantReducer,
    auth: authReducer,
    university: universityReducer,
    faculty:facultyReducer,
    professor: professorReducer,
    applicant : applicantReducer
  },
});
