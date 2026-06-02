import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import leadsReducer from './leadsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
  },
});

export default store;
