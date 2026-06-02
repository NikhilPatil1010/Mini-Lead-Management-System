import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials, clearCredentials } from '../store/authSlice';
import { setAccessToken, clearAccessToken } from '../api/axios';
import { loginUser, logoutUser } from '../api/auth.api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const login = async (credentials) => {
    const { data } = await loginUser(credentials);
    setAccessToken(data.data.accessToken);
    dispatch(setCredentials(data.data.user));
    navigate('/');
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Even if API fails, clear local state
    }
    clearAccessToken();
    dispatch(clearCredentials());
    navigate('/login');
  };

  const hasRole = (...roles) => roles.includes(user?.role);

  return { user, isAuthenticated, login, logout, hasRole };
};
