import { apiSlice } from '../../apiSlice';

const MATERIALSINVENTORY_URL = '/api/materials';

export const materialApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMaterialsInventory: builder.query({
      query: () => ({
        url: `${MATERIALSINVENTORY_URL}`,
        method: 'GET',
        //params: { page, pageSize, sort, filter },
      }),
      providesTags: ['Inventory'],
    }),

    getMaterialsInventoryItem: builder.query({
      query: (productName) => `${MATERIALSINVENTORY_URL}/${productName}`,
      providesTags: ['Inventory'],
    }),
    updateMaterialsReorderLevel: builder.mutation({
      query: ({ productName, reorderLevel }) => ({
        url: `${MATERIALSINVENTORY_URL}/${productName}/reorder-level`,
        method: 'PUT',
        body: { reorderLevel },
      }),
      invalidatesTags: ['Inventory'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Error updating reorder level:', error);
        }
      },
    }),
    getLowStockMaterials: builder.query({
      query: () => `${MATERIALSINVENTORY_URL}/low-stock`,
      providesTags: ['Inventory'],
    }),
    // getInventoryReport: builder.query({
    //   query: () => `${INVENTORY_URL}/report`,
    //   providesTags: ['Inventory'],
    // }),
  }),
});

export const {
  useGetMaterialsInventoryQuery,
  useGetMaterialsInventoryItemQuery,
  useUpdateMaterialsReorderLevelMutation,
  useGetLowStockMaterialsQuery,
  // useGetInventoryReportQuery,
} = materialApiSlice;
