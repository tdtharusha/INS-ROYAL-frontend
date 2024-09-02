import { apiSlice } from '../../apiSlice';

const PREMADEINVENTORY_URL = '/api/pre-made-foods-inventory';

export const preMadeFoodApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventory: builder.query({
      query: () => ({
        url: `${PREMADEINVENTORY_URL}`,
        // method: 'GET',
        //params: { page, pageSize, sort, filter },
      }),
      providesTags: ['PreMadeFoods'],
    }),

    getInventoryItem: builder.query({
      query: (productName) => `${PREMADEINVENTORY_URL}/${productName}`,
      providesTags: ['PreMadeFoods'],
    }),
    updateReorderLevel: builder.mutation({
      query: ({ productName, reorderLevel }) => ({
        url: `${PREMADEINVENTORY_URL}/${productName}/reorder-level`,
        method: 'PUT',
        body: { reorderLevel },
      }),
      invalidatesTags: ['PreMadeFoods'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Error updating reorder level:', error);
        }
      },
    }),
    getLowStockItems: builder.query({
      query: () => `${PREMADEINVENTORY_URL}/low-stock`,
      providesTags: ['PreMadeFoods'],
    }),
    // getInventoryReport: builder.query({
    //   query: () => `${INVENTORY_URL}/report`,
    //   providesTags: ['Inventory'],
    // }),
    searchInventoryByCategory: builder.query({
      query: (category) => ({
        url: `${PREMADEINVENTORY_URL}/search`,
        method: 'GET',
        params: { category },
      }),
      providesTags: ['PreMadeFoods'],
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useGetInventoryItemQuery,
  useUpdateReorderLevelMutation,
  useGetLowStockItemsQuery,
  // useGetInventoryReportQuery,
  useSearchInventoryByCategoryQuery,
} = preMadeFoodApiSlice;
