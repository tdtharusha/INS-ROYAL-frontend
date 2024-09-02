import { apiSlice } from '../apiSlice';

const DAILYPD_URL = '/api/dailyProducts';

export const dailyProductApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    produceDailyInHouseMadeFoods: builder.mutation({
      query: (data) => ({
        url: `${DAILYPD_URL}/produce-daily`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DailyProduct'],
    }),
    produceInHouseMadeFoodsSpecialOrder: builder.mutation({
      query: (data) => ({
        url: `${DAILYPD_URL}/special-order`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DailyProduct'],
    }),
  }),
});

export const {
  useProduceDailyInHouseMadeFoodsMutation,
  useProduceInHouseMadeFoodsSpecialOrderMutation,
} = dailyProductApiSlice;
