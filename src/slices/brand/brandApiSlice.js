import { apiSlice } from '../apiSlice';

const BRANDS_URL = '/api/brands';

export const brandApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => ({
        url: `${BRANDS_URL}`,
      }),
      providesTags: ['Brand'],
    }),

    getBrandById: builder.query({
      query: (id) => `${BRANDS_URL}/${id}`,
      providesTags: ['Brand'],
    }),
    createBrand: builder.mutation({
      query: (brand) => ({
        url: `${BRANDS_URL}`,
        method: 'POST',
        body: brand,
      }),
      invalidatesTags: ['Brand'],
    }),
    updateBrand: builder.mutation({
      query: ({ id, ...brand }) => ({
        url: `${BRANDS_URL}/${id}`,
        method: 'PUT',
        body: brand,
      }),
      invalidatesTags: ['Brand'],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `${BRANDS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brand'],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
