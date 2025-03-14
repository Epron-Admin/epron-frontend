import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeModal: false,
    userLoggedIn: false,
}

const authSlice = createSlice({
    name: 'logout',
    initialState,
    reducers: {
        closeModal(state) {
            state.activeModal = false
        },
        openModal(state) {
            state.activeModal = true
        },
        userLogin(state) {
            state.userLoggedIn = true
        },
        userLogout(state) {
            state.activeModal = false
            state.userLoggedIn = false
        }
    }
})

export const {closeModal, openModal, userLogin, userLogout} = authSlice.actions
export default authSlice.reducer