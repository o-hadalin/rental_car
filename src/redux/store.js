import { configureStore } from '@reduxjs/toolkit';
import carsReducer from './cars/slice';
import filtersReducer from './filters/slice';
import favoritesReducer from './favorites/slice';

const store = configureStore({
  reducer: {
    cars: carsReducer,
    filters: filtersReducer,
    favorites: favoritesReducer,
  },
});

store.subscribe(() => {
  localStorage.setItem('favorites', JSON.stringify(store.getState().favorites));
});

export default store;
