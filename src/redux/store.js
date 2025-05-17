import { configureStore } from '@reduxjs/toolkit';
import carsReducer from './cars/slice';
import filtersReducer from './filters/slice';
import favoritesReducer from './favorites/slice';
import catalogStateReducer from './catalogState/slice';

const store = configureStore({
  reducer: {
    cars: carsReducer,
    filters: filtersReducer,
    favorites: favoritesReducer,
    catalogState: catalogStateReducer,
  },
});

store.subscribe(() => {
  localStorage.setItem('favorites', JSON.stringify(store.getState().favorites));
});

export default store;
