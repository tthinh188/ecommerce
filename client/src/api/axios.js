import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000' });

export const signIn = (formData) => API.post('/api/v1/users/signin', formData);
export const signUp = (formData) => API.post('/api/v1/users/signup', formData);

export const activate = (activateToken) => API.post('/api/v1/users/activate', activateToken);
export const resendActivationEmail = (email) => API.post('/api/v1/users/resend_activate', email);
export const sendResetPasswordLink = (email) => API.post('api/v1/users/forgot', email);
export const resetPassword = (resetToken, formData) => API.patch('/api/v1/users/reset', formData, {
    headers: { Authorization: resetToken }
})

export const getAccessToken = (refreshToken) => API.post('/api/v1/users/refresh_token', refreshToken);
export const updateUser = (accessToken, formData) => API.patch('/api/v1/users/update', formData, {
    headers: { Authorization: accessToken }
})

export const getUser = (accessToken) => API.get('/api/v1/users/user', {
    headers: { Authorization: accessToken }
})
