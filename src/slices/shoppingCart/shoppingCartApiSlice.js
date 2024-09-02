import { apiSlice } from '../apiSlice';

const CART_URL = '/api/cart';

export const ShoppingCartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({
        url: `${CART_URL}`,
      }),
      providesTags: ['ShoppingCart'],
    }),
    addToCart: builder.mutation({
      query: (product) => ({
        url: `${CART_URL}`,
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['ShoppingCart'],
    }),
    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `${CART_URL}/${productId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['ShoppingCart'],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `${CART_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ShoppingCart'],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: `${CART_URL}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ShoppingCart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = ShoppingCartApi;
