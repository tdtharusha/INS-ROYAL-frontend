import { apiSlice } from '../apiSlice';

const ORDER_URL = '/api/orders';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: `${ORDER_URL}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),
    calculateShippingPrice: builder.mutation({
      query: (addressData) => ({
        url: `${ORDER_URL}/shippingPrice`,
        method: 'POST',
        body: addressData,
      }),
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: `${ORDER_URL}`,
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Product', 'PreMadeFoods', 'InHouseMadeFoods'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${ORDER_URL}/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
    deleteOreder: builder.mutation({
      query: (id) => ({
        url: `${ORDER_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brand'],
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: `${ORDER_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useCalculateShippingPriceMutation,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrederMutation,
  useGetOrderByIdQuery,
} = orderApiSlice;
