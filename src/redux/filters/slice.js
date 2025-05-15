import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brand: '',
  price: '',
  mileageFrom: '',
  mileageTo: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setBrand(state, action) {
      state.brand = action.payload;
    },
    setPrice(state, action) {
      state.price = action.payload;
    },
    setMileageFrom(state, action) {
      state.mileageFrom = action.payload;
    },
    setMileageTo(state, action) {
      state.mileageTo = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setBrand,
  setPrice,
  setMileageFrom,
  setMileageTo,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
