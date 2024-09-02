import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useUpdateRecipeMutation,
  useGetRecipeByIdQuery,
  useGetProductsAndBrandQuery,
} from '../../slices/recipe/recipeApiSlice';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const RecipeEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [updateRecipe] = useUpdateRecipeMutation();

  const { data: recipeData, isLoading: isLoadingRecipe } =
    useGetRecipeByIdQuery(id);

  const [formData, setFormData] = useState({
    brandName: '',
    productName: '',
    category: '',
    subSection: '',
    ingredients: [],
  });

  const {
    data: products,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useGetProductsAndBrandQuery(formData.brandName, {
    skip: !formData.brandName,
  });

  useEffect(() => {
    if (recipeData) {
      console.log('recipe data:', recipeData);
      setFormData({
        brandName: recipeData.brand.name,
        productName: recipeData.productName,
        category: recipeData.category,
        subSection: recipeData.subSection,
        ingredients: recipeData.ingredients.map((ingredient) => ({
          ...ingredient,
        })),
      });
    }
  }, [recipeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = formData.ingredients.map((ingredient, i) => {
      if (i === index) {
        return {
          ...ingredient,
          [field]: field === 'quantity' ? Number(value) : value,
        };
      }
      return ingredient;
    });
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [
        ...formData.ingredients,
        { name: '', quantity: '', unit: '' },
      ],
    });
  };

  const handleDeleteIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateRecipe({ id, ...formData }).unwrap();
      toast.success('Recipe successfully updated');
      navigate('/recipes');
    } catch (err) {
      toast.error('Failed to update the recipe');
      console.error('Failed to update the recipe', err);
    }
  };

  if (isLoadingRecipe) return <Loader />;
  //if (productsError)
  //return <Typography color='error'>Error loading data</Typography>;

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}
    >
      <Typography variant='h4' gutterBottom>
        Update Recipe
      </Typography>
      <TextField
        fullWidth
        margin='normal'
        name='brand'
        label='Brand'
        value={formData.brandName}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin='normal'
        name='productName'
        label='Product Name'
        value={formData.productName}
        onChange={handleChange}
        required
        disabled={isLoadingProducts}
      />

      <TextField
        fullWidth
        margin='normal'
        name='category'
        label='Category'
        value={formData.category}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin='normal'
        name='subSection'
        label='Sub Section'
        value={formData.subSection}
        onChange={handleChange}
        required
      />
      <Typography variant='h6' sx={{ mt: 2 }}>
        Ingredients
      </Typography>

      {formData.ingredients.map((ingredient, index) => (
        <Box
          key={index}
          sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}
        >
          <TextField
            label='Ingredient Name'
            value={ingredient.name}
            onChange={(e) =>
              handleIngredientChange(index, 'name', e.target.value)
            }
            required
          />
          <TextField
            label='Quantity'
            type='number'
            value={ingredient.quantity}
            onChange={(e) =>
              handleIngredientChange(index, 'quantity', e.target.value)
            }
            required
          />
          <TextField
            label='Unit'
            value={ingredient.unit}
            onChange={(e) =>
              handleIngredientChange(index, 'unit', e.target.value)
            }
            required
          />
          <Button
            onClick={() => handleDeleteIngredient(index)}
            variant='outlined'
            color='error'
            sx={{ height: '56px' }}
          >
            Delete Ingredient
          </Button>
        </Box>
      ))}

      <Button onClick={handleAddIngredient} variant='outlined' sx={{ mt: 2 }}>
        Add Ingredient
      </Button>

      <Button
        type='submit'
        variant='contained'
        color='primary'
        fullWidth
        sx={{ mt: 4 }}
      >
        Update Recipe
      </Button>
    </Box>
  );
};

export default RecipeEditScreen;
