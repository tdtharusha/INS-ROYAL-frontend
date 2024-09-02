import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useCreateRecipeMutation,
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

const RecipeCreateScreen = () => {
  const navigate = useNavigate();
  const [createRecipe] = useCreateRecipeMutation();
  const {
    data: products,
    isLoading: isLoadingProducts,
    error,
  } = useGetProductsAndBrandQuery();
  console.log('products data:', products);

  const [formData, setFormData] = useState({
    brandId: '',
    productName: '',
    category: 'In-house-made-foods',
    subSection: '',
    ingredients: [{ name: '', quantity: 0, unit: '' }],
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load products');
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'productName') {
      const selectedProduct = products?.find((p) => p.name === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        brandId: selectedProduct?.brand?._id || '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [
        ...formData.ingredients,
        { name: '', quantity: 0, unit: '' },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRecipe(formData).unwrap();
      toast.success('Recipe created successfully');
      navigate('/recipes');
    } catch (err) {
      console.error('Failed to create the recipe', err);
      toast.error('Failed to create the recipe');
    }
  };

  if (isLoadingProducts) return <Loader />;

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}
    >
      <Typography variant='h4' gutterBottom>
        Create New Recipe
      </Typography>
      <FormControl fullWidth margin='normal'>
        <InputLabel>Product</InputLabel>
        <Select
          name='productName'
          value={formData.productName}
          onChange={handleChange}
          required
        >
          {products &&
            products.map((product) => (
              <MenuItem key={product.name} value={product.name}>
                {product.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin='normal'
        name='brandId'
        label='Brand'
        value={
          formData.brandId
            ? products?.find((p) => p.brand._id === formData.brandId)?.brand
                .name || ''
            : ''
        }
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        fullWidth
        margin='normal'
        name='category'
        label='Category'
        value={formData.category}
        InputProps={{
          readOnly: true,
        }}
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
        <Box key={index} sx={{ display: 'flex', gap: 2, my: 2 }}>
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
        Create Recipe
      </Button>
    </Box>
  );
};

export default RecipeCreateScreen;
