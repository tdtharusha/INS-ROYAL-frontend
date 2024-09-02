import { apiSlice } from '../apiSlice';

const PRODUCTS_URL = '/api/products';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}`,
        //method: 'GET',
      }),
      async transformResponse(responseData, meta, arg) {
        const transformedProducts = await Promise.all(
          responseData.map(async (product) => {
            const inventoryInfo = await getInventoryInfo(product);
            return {
              ...product,
              image: product.image.startsWith('http')
                ? product.image
                : `/${product.image.replace(/^\/+/, '')}`,
              inventoryInfo,
            };
          })
        );
        return transformedProducts;
      },
      providesTags: ['Product'],
    }),

    getProductById: builder.query({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
      }),
      async transformResponse(responseData, meta, arg) {
        if (!responseData) {
          console.error('No response data received for getProductById');
          return null;
        }
        const inventoryInfo = await getInventoryInfo(responseData);
        return {
          ...responseData,
          image: responseData.image
            ? responseData.image.startsWith('http')
              ? responseData.image
              : `/${responseData.image.replace(/^\/+/, '')}`
            : '',
          inventoryInfo,
        };
      },
      providesTags: ['Product'],
    }),

    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top-products`,
        method: 'GET',
      }),
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}`,
        method: 'POST',
        customConfig: { headers: { 'Content-Type': 'multipart/form-data' } },
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: 'PUT',
        customConfig: { headers: { 'Content-Type': 'multipart/form-data' } },
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    createProductReview: builder.mutation({
      query: ({ productId, review }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews`,
        method: 'POST',
        body: review,
      }),
    }),
    getInHouseMadeProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/in-house-foods`,
      }),
    }),
  }),
});

async function getInventoryInfo(product) {
  if (product.category === 'Pre-made-foods') {
    const response = await fetch(
      `/api/pre-made-foods-inventory/${encodeURIComponent(product.name)}`
    );
    if (response.ok) {
      const data = await response.json();
      return { quantity: data.quantity, reorderLevel: data.reorderLevel };
    }
  } else if (product.category === 'In-house-made-foods') {
    const response = await fetch(
      `/api/in-house-made-foods/${encodeURIComponent(product.name)}`
    );
    if (response.ok) {
      const data = await response.json();
      return { quantity: data.quantity, reorderLevel: data.reorderLevel };
    }
  }
  return { quantity: 0, reorderLevel: 0 };
}

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetTopProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductReviewMutation,
  useGetInHouseMadeProductsQuery,
} = productApiSlice;
