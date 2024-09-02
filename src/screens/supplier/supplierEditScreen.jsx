import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetSupplierByIdQuery,
  useUpdateSupplierMutation,
} from '../../slices/supplier/supplierApiSlice';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';
import { toast } from 'react-toastify';

const SupplierEditForm = () => {
  const { id } = useParams();
  const { data: supplier, isLoading: isLoadingSupplier } =
    useGetSupplierByIdQuery(id);
  const [updateSupplier, { isLoading: isUpdating }] =
    useUpdateSupplierMutation();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    supplierName: '',
    supplierEmail: '',
    supplierAddress: '',
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        supplierName: supplier.supplierName,
        supplierEmail: supplier.supplierEmail,
        supplierAddress: supplier.supplierAddress,
      });
    }
  }, [supplier]);

  console.log('supplier :', supplier);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateSupplier({ id, ...formData }).unwrap();
      toast.success('Spplier update successfully');
      navigate('/suppliers');
      console.log('updated supplier', result);
    } catch (err) {
      console.error('Error updating Supplier:', err);
      toast.error(`Failed to Update Supplier'}`);
    }
  };

  if (isLoadingSupplier) return <div>Loading...</div>;

  return (
    <Paper
      elevation={3}
      style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}
    >
      <Typography variant='h5' gutterBottom>
        Edit Supplier
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
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Supplier'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default SupplierEditForm;
