import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLeads, setLoading, setError, setFilters } from '../store/leadsSlice';
import { fetchLeads } from '../api/leads.api';

export const useLeads = () => {
  const dispatch = useDispatch();
  const { items, meta, filters, loading, error } = useSelector((state) => state.leads);

  const loadLeads = useCallback(async (overrides = {}) => {
    dispatch(setLoading(true));
    try {
      const params = { ...filters, page: meta.page, limit: meta.limit, ...overrides };
      const { data } = await fetchLeads(params);
      dispatch(setLeads(data.data));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to load leads'));
    }
  }, [dispatch, filters, meta.page, meta.limit]);

  const updateFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  return { items, meta, filters, loading, error, loadLeads, updateFilters };
};
