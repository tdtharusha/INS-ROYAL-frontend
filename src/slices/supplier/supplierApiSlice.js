import { apiSlice } from '../apiSlice';

const SUPPLIERS_URL = '/api/suppliers';

export const supplierApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query({
      query: () => ({
        url: `${SUPPLIERS_URL}`,
      }),
      providesTags: ['Supplier'],
    }),

    getSupplierById: builder.query({
      query: (id) => `${SUPPLIERS_URL}/${id}`,
      providesTags: ['Supplier'],
    }),
    createSupplier: builder.mutation({
      query: (supplier) => ({
        url: `${SUPPLIERS_URL}`,
        method: 'POST',
        body: supplier,
      }),
      invalidatesTags: ['Supplier'],
    }),
    updateSupplier: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${SUPPLIERS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Supplier'],
    }),
    deleteSupplier: builder.mutation({
      query: (id) => ({
        url: `${SUPPLIERS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Supplier'],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi;
