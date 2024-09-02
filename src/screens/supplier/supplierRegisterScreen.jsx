import React, { useState } from 'react';
import { useCreateSupplierMutation } from '../../slices/supplier/supplierApiSlice';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SupplierRegisterScreen = () => {
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierEmail: '',
    supplierAddress: '',
  });

  const navigate = useNavigate();

  const [createSupplier, { isLoading }] = useCreateSupplierMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSupplier(formData).unwrap();
      toast.success('Spplier update successfully');
      navigate('/suppliers');
      setFormData({ supplierName: '', supplierEmail: '', supplierAddress: '' });
    } catch (err) {
      toast.error(
        `Failed to Update Supplier: ${err.message || 'Unknown error'}`
      );
      console.error('Failed to register supplier:', err);
    }
  };

  return (
    <Paper
      elevation={3}
      style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}
    >
      <Typography variant='h5' gutterBottom>
        Register Supplier
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Supplier Name'
              name='supplierName'
              value={formData.supplierName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Supplier Email'
              name='supplierEmail'
              type='email'
              value={formData.supplierEmail}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Supplier Address'
              name='supplierAddress'
              value={formData.supplierAddress}
              onChange={handleChange}
              multiline
              rows={3}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register Supplier'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default SupplierRegisterScreen;
