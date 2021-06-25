import * as api from '../api/axios'
import constants from './constants';

export const signin = (formData, history) => async (dispatch) => {
    try {
        const { data } = await api.signIn(formData); // sending to backend server by axios

        dispatch({ type: constants.AUTH, data }) // reducer implement this logic

        history.push('/')
    } catch (error) {
        return error.response.data.message;
    }
}

export const signup = (formData, history) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData); // sending to backend server by axios

        dispatch({ type: constants.AUTH, data }) // reducer implement this logic

        history.push('/')
    } catch (error) {
        return error.response.data.message;
    }
}

export const activation = (activationToken) => async (dispatch) => {
    try {
        const { data } = await api.activate({ activationToken: activationToken })

        return data;
    } catch (error) {
        return { error: error.message }
    }
}

export const resendActivationEmail = (email) => async (dispatch) => {
    await api.resendActivationEmail({ email: email });
}

export const sendResetPasswordLink = async (email) => {
    try {
        return await api.sendResetPasswordLink({ email: email });
    } catch (error) {
    }
}

export const resetPassword = async (resetToken, formData) => {
    try {
        return await api.resetPassword(resetToken, formData);
    } catch (error) {
        return error.response;
    }
}

export const updateUser = (refreshToken, formData) => async (dispatch) => {
    try {
        const res = await api.getAccessToken({ refreshToken });
        const accessToken = res.data.accessToken;

        const response = await api.updateUser(accessToken, formData);
        const data = { user: { ...response.data }, refreshToken: refreshToken };
        dispatch({ type: 'UPDATE', data })
        
        return response;
    } catch (error) {
        return error.response;
    }
}

export const getUser = (refreshToken) => async (dispatch) => {
    try {
        const res = await api.getAccessToken({ refreshToken });
        const accessToken = res.data.accessToken;

        const response = await api.getUser(accessToken);
        const data = { user: response.data, refreshToken: refreshToken }
        dispatch({ type: 'GETUSER', data })
    } catch (error) {
        console.log(error.response)
    }
}

export const changePassword = async (refreshToken, formData) => {
    try {

        const res = await api.getAccessToken({ refreshToken });
        const accessToken = res.data.accessToken;

        const response = await api.changePassword(accessToken, formData);
        return response;
    } catch (error) {
        return error.response;
    }
}

export const userLogout = () => (dispatch) => {
    try {
        dispatch({ type: 'SIGNOUT' });
    } catch (error) {
        console.log(error)
    }
}