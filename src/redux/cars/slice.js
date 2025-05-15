import { createSlice } from '@reduxjs/toolkit';
import { fetchCars } from './operations';

const carsSlice = createSlice({
  name: 'cars',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    page: 1,
    totalPages: 1,
    hasMore: true,
  },
  reducers: {
    resetCars(state) {
      state.items = [];
      state.page = 1;
      state.totalPages = 1;
      state.hasMore = true;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCars.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.isLoading = false;

        const cars = Array.isArray(action.payload.cars)
          ? action.payload.cars
          : [];
        const existingIds = new Set(state.items.map(car => car.id));
        const uniqueNewCars = cars.filter(car => !existingIds.has(car.id));

        const currentPage = Number(action.payload.page);
        const totalPages = Number(action.payload.totalPages);

        state.items.push(...uniqueNewCars);
        state.page = currentPage || state.page;
        state.totalPages = totalPages || state.totalPages;
        state.hasMore = currentPage < totalPages;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to load cars';
      });
  },
});

export const { resetCars, incrementPage } = carsSlice.actions;
export default carsSlice.reducer;
