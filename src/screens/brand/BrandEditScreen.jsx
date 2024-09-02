import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetBrandByIdQuery,
  useUpdateBrandMutation,
} from '../../slices/brand/brandApiSlice';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const UpdateBrandForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [productNames, setProductNames] = useState('');

  const { data: brand, isLoading, isError, error } = useGetBrandByIdQuery(id);
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();

  useEffect(() => {
    if (brand) {
      setName(brand.name);
      setProductNames(
        Array.isArray(brand.productNames) ? brand.productNames.join(', ') : ''
      );
    }
  }, [brand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedBrandData = {
      id,
      name,
      productNames: productNames.split(',').map((product) => product.trim()),
    };

    try {
      await updateBrand(updatedBrandData).unwrap();
      toast.success('Brand update successfully');
      navigate('/brands'); // Navigate back to the brand list after successful update
    } catch (err) {
      toast.error(`Failed to Update Brand: ${err.message || 'Unknown error'}`);
      console.error('Failed to update the brand:', err);
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <div>Error Loading page</div>;

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, margin: 'auto' }}
    >
      <Typography variant='h6'>Edit Brand</Typography>
      <TextField
        fullWidth
        label='Brand Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin='normal'
        required
      />
      <TextField
        fullWidth
        label='Product Names (comma-separated)'
        value={productNames}
        onChange={(e) => setProductNames(e.target.value)}
        margin='normal'
        required
      />
      <Button
        type='submit'
        fullWidth
        variant='contained'
        sx={{ mt: 3, mb: 2 }}
        disabled={isUpdating}
      >
        {isUpdating ? 'Updating...' : 'Update Brand'}
      </Button>
      <Button
        fullWidth
        variant='outlined'
        onClick={() => navigate('/brands')}
        sx={{ mt: 1 }}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default UpdateBrandForm;
