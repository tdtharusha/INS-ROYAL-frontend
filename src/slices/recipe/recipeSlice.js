import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  recipes: [],
  selectedRecipe: null,
  loading: false,
  error: null,
};

const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    setRecipes: (state, action) => {
      state.recipes = action.payload;
    },
    setSelectedRecipe: (state, action) => {
      state.selectedRecipe = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setRecipes, setSelectedRecipe, setLoading, setError } =
  recipeSlice.actions;

export default recipeSlice.reducer;
