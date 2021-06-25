import * as api from '../api/axios'

export const uploadAvatar = (refreshToken, image) => async (dispatch) => {
    try {
        const res = await api.getAccessToken({ refreshToken });
        const accessToken = res.data.accessToken;

        const response = await api.uploadAvatar(accessToken, image);
        const data = { user: { ...response.data }, refreshToken: refreshToken };
        dispatch({ type: 'UPDATE', data })

    } catch (error) {

    }
}