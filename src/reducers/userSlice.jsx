import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {},
    token: '',
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      setUserData(state, {payload}) {
        state.user = payload;
      },
      setToken(state, {payload}) {
        state.token = payload.token;
      }
    }
  })

  export const {setUserData, setToken} = userSlice.actions
  export default userSlice.reducer