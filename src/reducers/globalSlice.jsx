import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    categories: [],
    types: [],
}

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
      setCategoriesData(state, {payload}) {
        state.categories = payload.data;
      },
      setTypesData(state, {payload}) {
        state.types = payload.data;
      },
    }
  })

  export const {setCategoriesData, setTypesData} = globalSlice.actions
  export default globalSlice.reducer