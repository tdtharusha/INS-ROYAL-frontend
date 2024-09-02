import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useUpdateGRNMutation,
  useGetGRNByIdQuery,
  useGetSuppliersBrandsAndProductsQuery,
} from '../../slices/grn/grnApiSlice';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const GRNEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateGRN, { isLoading }] = useUpdateGRNMutation();
  const { data: grnData, isLoading: isLoadingGRN } = useGetGRNByIdQuery(id);
  const { data: suppliersBrandsProducts, isLoading: isLoadingOptions } =
    useGetSuppliersBrandsAndProductsQuery();

  console.log('grn data:', grnData);

  const [formData, setFormData] = useState({
    supplier: '',
    brand: '',
    items: [],
    status: '',
    notes: '',
  });

  useEffect(() => {
    if (grnData && suppliersBrandsProducts) {
      console.log('Setting form data with:', grnData, suppliersBrandsProducts);
      setFormData({
        supplier: grnData.supplier._id,
        brand: grnData.brand._id,
        items: grnData.items.map((item) => ({
          ...item,
          productName: item.productName,
          expiryDate: item.expiryDate.split('T')[0],
        })),
        status: grnData.status,
        notes: grnData.notes,
      });
      console.log('prodcut name', grnData.items.productName);
    }
  }, [grnData, suppliersBrandsProducts]);

  useEffect(() => {
    console.log('Current form data:', formData);
    console.log('Available suppliers:', suppliersBrandsProducts?.suppliers);
  }, [formData, suppliersBrandsProducts]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          productName: '',
          category: '',
          quantityReceived: 0,
          unitPrice: 0,
          expiryDate: '',
        },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
    console.log('new item', newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateGRN({ id, ...formData }).unwrap();
      toast.success('Product deleted successfully');
      navigate('/grns');
    } catch (err) {
      toast.error('Failed to update GRN:', err);
    }
  };

  if (isLoadingGRN || isLoadingOptions) return <div>Loading...</div>;

  return (
    <Paper
      elevation={3}
      style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}
    >
      <Typography variant='h5' gutterBottom>
        Update GRN
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Supplier</InputLabel>
              <Select
                name='supplier'
                value={formData.supplier || ''}
                onChange={handleChange}
                disabled
              >
                {suppliersBrandsProducts?.suppliers.map((supplier) => (
                  <MenuItem key={supplier._id} value={supplier._id}>
                    {supplier.supplierName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Brand</InputLabel>
              <Select
                name='brand'
                value={formData.brand}
                onChange={handleChange}
                disabled
              >
                {suppliersBrandsProducts?.brands.map((brand) => (
                  <MenuItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {formData.items.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Typography variant='h6'>Item {index + 1}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Product Name</InputLabel>
                    {item.category === 'Pre-made-foods' ? (
                      <Select
                        value={item.productName || ''}
                        onChange={(e) =>
                          handleItemChange(index, 'productName', e.target.value)
                        }
                        required
                      >
                        {suppliersBrandsProducts?.brands
                          .find((b) => b._id === formData.brand)
                          ?.productNames.map((productName) => (
                            <MenuItem key={productName} value={productName}>
                              {productName}
                            </MenuItem>
                          ))}
                      </Select>
                    ) : (
                      <TextField
                        value={item.productName || ''}
                        onChange={(e) =>
                          handleItemChange(index, 'productName', e.target.value)
                        }
                        required
                      />
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={item.category}
                      onChange={(e) =>
                        handleItemChange(index, 'category', e.target.value)
                      }
                      required
                    >
                      <MenuItem value='Pre-made-foods'>Pre-made-foods</MenuItem>
                      <MenuItem value='Materials'>Materials</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label='Quantity Received'
                    type='number'
                    value={item.quantityReceived}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        'quantityReceived',
                        e.target.value
                      )
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label='Unit'
                    value={item.unit}
                    onChange={(e) =>
                      handleItemChange(index, 'unit', e.target.value)
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label='Unit Price'
                    type='number'
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, 'unitPrice', e.target.value)
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label='Expiry Date'
                    type='date'
                    value={item.expiryDate.split('T')[0]} // Assuming the date is in ISO format
                    onChange={(e) =>
                      handleItemChange(index, 'expiryDate', e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
              </Grid>
              <Button onClick={() => handleRemoveItem(index)}>
                Remove Item
              </Button>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={handleAddItem}>Add Item</Button>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name='status'
                value={formData.status}
                onChange={handleChange}
                required
              >
                <MenuItem value='Pending'>Pending</MenuItem>
                <MenuItem value='Complete'>Complete</MenuItem>
                <MenuItem value='Cancelled'>Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Notes'
              name='notes'
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update GRN'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default GRNEditScreen;
