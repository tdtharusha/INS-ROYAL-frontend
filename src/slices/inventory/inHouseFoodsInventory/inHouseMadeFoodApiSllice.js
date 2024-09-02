import { apiSlice } from '../../apiSlice';

const INHOUSEMADEINVENTORY_URL = '/api/in-house-made-foods';

export const inHouseMadeFoodApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInHouseInventory: builder.query({
      query: () => ({
        url: `${INHOUSEMADEINVENTORY_URL}`,
        //params: { page, pageSize, sort, filter },
      }),
      providesTags: ['InHouseMadeFoods'],
    }),

    getInHouseInventoryItem: builder.query({
      query: (productName) => `${INHOUSEMADEINVENTORY_URL}/${productName}`,
      providesTags: ['InHouseMadeFoods'],
    }),
  }),
});

export const {
  useGetInHouseInventoryQuery,
  useGetInHouseInventoryItemQuery,
  //   useUpdateInHouseReorderLevelMutation,
  //   useGetInHouseLowStockItemsQuery,
  // useGetInventoryReportQuery,
} = inHouseMadeFoodApiSlice;
