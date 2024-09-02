import { apiSlice } from '../apiSlice';

const GRNS_URL = '/api/grn';

export const grnApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGRNs: builder.query({
      query: (params) => ({
        url: `${GRNS_URL}`,
        params,
      }),
      providesTags: ['GRN'],
    }),
    getGRNById: builder.query({
      query: (id) => `${GRNS_URL}/${id}`,
      providesTags: ['GRN'],
    }),
    createGRN: builder.mutation({
      query: (data) => ({
        url: `${GRNS_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GRN'],
    }),
    updateGRN: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${GRNS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['GRN'],
    }),
    deleteGRN: builder.mutation({
      query: (id) => ({
        url: `${GRNS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GRN'],
    }),
    getSuppliersBrandsAndProducts: builder.query({
      query: () => `${GRNS_URL}/suppliers-brands-products`,
    }),
    getSupplierQuantity: builder.query({
      query: () => `${GRNS_URL} /supplier-quantity/:supplierId`,
    }),
  }),
});

export const {
  useGetGRNsQuery,
  useGetGRNByIdQuery,
  useCreateGRNMutation,
  useUpdateGRNMutation,
  useDeleteGRNMutation,
  useGetSuppliersBrandsAndProductsQuery,
  useGetSupplierQuantityQuery,
} = grnApiSlice;
