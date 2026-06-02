const authService = require('../services/auth.service');
const { sendResponse } = require('../utils/response');

const register = async (req, res) => {
  const user = await authService.register(req.body);
  sendResponse(res, 201, true, user, 'User registered successfully');
};

const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, 200, true, { user, accessToken }, 'Login successful');
};

const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return sendResponse(res, 401, false, null, 'Refresh token not found');
  }

  const result = authService.refreshAccessToken(token);
  sendResponse(res, 200, true, result, 'Token refreshed');
};

const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  authService.logout(token);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  sendResponse(res, 200, true, null, 'Logged out successfully');
};

module.exports = { register, login, refreshToken, logout };
