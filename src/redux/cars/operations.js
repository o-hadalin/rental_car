import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://car-rental-api.goit.global/';

axios.defaults.baseURL = BASE_URL;

export const fetchCars = createAsyncThunk(
  'cars/fetchAll',
  async (
    { page = 1, limit = 12, brand, rentalPrice, minMileage, maxMileage },
    thunkAPI
  ) => {
    try {
      const params = {
        page,
        limit,
      };

      if (brand) params.brand = brand;
      if (rentalPrice) params.rentalPrice = rentalPrice; // 🔶 Note: rentalPrice performs filtering on the backend, but the API returns all cars with price ≤ rentalPrice
      if (minMileage) params.minMileage = minMileage;
      if (maxMileage) params.maxMileage = maxMileage;

      const response = await axios.get('/cars', { params });

      const { cars, page: currentPage, totalPages } = response.data;
      return { cars, page: currentPage, totalPages };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
