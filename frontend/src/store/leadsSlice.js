import { createSlice } from '@reduxjs/toolkit';

const leadsSlice = createSlice({
  name: 'leads',
  initialState: {
    items: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    filters: { search: '', status: '', source: '', sortBy: 'created_at', order: 'desc' },
    loading: false,
    error: null,
  },
  reducers: {
    setLeads: (state, action) => {
      state.items = action.payload.leads;
      state.meta = action.payload.meta;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = { search: '', status: '', source: '', sortBy: 'created_at', order: 'desc' };
    },
  },
});

export const { setLeads, setLoading, setError, setFilters, resetFilters } = leadsSlice.actions;
export default leadsSlice.reducer;
