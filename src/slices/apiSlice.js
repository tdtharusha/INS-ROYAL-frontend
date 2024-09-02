import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ baseUrl: '' });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [
    'User',
    'Product',
    'Brand',
    'PreMadeFoods',
    'Materials',
    'InHouseMadeFoods',
    'Supplier',
    'GRN',
    'Recipe',
    'DailyProduct',
    'ShoppingCart',
    'Report',
  ],
  endpoints: (builder) => ({}),
});

export default apiSlice;
