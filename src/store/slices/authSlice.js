import { createSlice } from '@reduxjs/toolkit';

const stored = JSON.parse(localStorage.getItem('pw_user') || 'null') // use redux

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: stored?.user || null, token: stored?.token || null
    },
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('pw_user', JSON.stringify(action.payload))
        },
        clearCredentials: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('pw_user')
        },
    },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;