import React, { useState, useEffect } from 'react';
import { useCreateBrandMutation } from '../../slices/brand/brandApiSlice';
import {
  TextField,
  Button,
  Box,
  Typography,
  // Snackbar,
  Alert,
} from '@mui/material';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const RegisterBrandForm = ({ brand, onSuccess }) => {
  const [name, setName] = useState('');
  const [productNames, setProductNames] = useState('');
  // const [openSnackbar, setOpenSnackbar] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState('');
  // const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [createBrand, { isLoading: isRegistering }] = useCreateBrandMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const brandData = {
      name,
      productNames: productNames.split(',').map((product) => product.trim()),
    };

    try {
      await createBrand(brandData).unwrap();
      toast.success('Brand registered successfully');
      // setSnackbarMessage('Brand registered successfully!');
      // setSnackbarSeverity('success');
      // setOpenSnackbar(true);
      // setName('');
      // setProductNames('');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to register the brand:', err);
      toast.error('Failed to register the brand:', err);
      // setSnackbarMessage('Failed to register the brand. Please try again.');
      // setSnackbarSeverity('error');
      // setOpenSnackbar(true);
    }
  };

  // const handleCloseSnackbar = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setOpenSnackbar(false);
  // };

  return (
    <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant='h6'>Register New Brand</Typography>
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
        disabled={isRegistering}
      >
        {isRegistering ? 'Registering...' : 'Register Brand'}
      </Button>
      {/* <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar> */}
    </Box>
  );
};

export default RegisterBrandForm;
