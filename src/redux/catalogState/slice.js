import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lastSearch: '',
};

const catalogStateSlice = createSlice({
  name: 'catalogState',
  initialState,
  reducers: {
    setLastSearch: (state, action) => {
      state.lastSearch = action.payload;
    },
  },
});

export const { setLastSearch } = catalogStateSlice.actions;
export default catalogStateSlice.reducer;
