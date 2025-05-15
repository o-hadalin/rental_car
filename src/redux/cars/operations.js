import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://car-rental-api.goit.global/';

axios.defaults.baseURL = BASE_URL;

export const fetchCars = createAsyncThunk(
  'cars/fetchAll',
  async ({ page = 1, limit = 12 }, thunkAPI) => {
    try {
      const response = await axios.get(`/cars?page=${page}&limit=${limit}`);
      const { cars, page: currentPage, totalPages } = response.data;
      return { cars, page: currentPage, totalPages };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
