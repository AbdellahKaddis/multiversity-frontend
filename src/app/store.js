import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/auth/authSlice';
import universityReducer from '../features/university/universitySlice'
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    university: universityReducer,
  },
});
