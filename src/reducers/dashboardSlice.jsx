import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sideNavStatus: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    showSideNav(state, { payload }) {
      state.sideNavStatus = payload.status;
    },
    hideSideNav(state) {
      state.sideNavStatus = false;
    },
  },
});

export const { showSideNav, hideSideNav } = dashboardSlice.actions;
export default dashboardSlice.reducer;
