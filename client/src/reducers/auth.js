const authReducer = (state = { authData: null }, action) => {
    switch (action.type) {
        case 'AUTH':
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            return { ...state, authData: action.data };
        case 'SIGNOUT':
            localStorage.clear();
            return { ...state, authData: null }
        case 'UPDATE':
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            return { ...state, authData: action.data };
        case 'GETUSER':
            return { ...state, authData: action.data };
        default:
            return state;
    }
}

export default authReducer;