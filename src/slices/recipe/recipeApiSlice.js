import { apiSlice } from '../apiSlice';

const RECIPE_URL = '/api/recipes';

export const recipeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecipes: builder.query({
      query: () => ({
        url: `${RECIPE_URL}`,
        //params: { page, limit, sort, filter },
      }),
      providesTags: ['Recipe'],
    }),
    getRecipeById: builder.query({
      query: (id) => `${RECIPE_URL}/${id}`,
      providesTags: ['Recipe'],
    }),
    createRecipe: builder.mutation({
      query: (recipe) => ({
        url: `${RECIPE_URL}`,
        method: 'POST',
        body: recipe,
      }),
      invalidatesTags: ['Recipe'],
    }),
    updateRecipe: builder.mutation({
      query: ({ id, ...recipe }) => ({
        url: `${RECIPE_URL}/${id}`,
        method: 'PUT',
        body: recipe,
      }),
      invalidatesTags: ['Recipe'],
    }),
    deleteRecipe: builder.mutation({
      query: (id) => ({
        url: `${RECIPE_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Recipe'],
    }),
    getProductsAndBrand: builder.query({
      query: () => `${RECIPE_URL}/products`,
    }),
    providesTags: ['Product'],
  }),
});

export const {
  useGetRecipesQuery,
  useGetRecipeByIdQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useGetProductsAndBrandQuery,
} = recipeApiSlice;
