import React, { useState, useEffect } from 'react';
import {
  useCreateGRNMutation,
  useGetSuppliersBrandsAndProductsQuery,
  useGetSupplierQuantityQuery,
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
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const GRNCreateScreen = () => {
  const navigate = useNavigate();

  const [createGRN, { isLoading }] = useCreateGRNMutation();
  const { data: suppliersBrandsProducts, isLoading: isLoadingOptions } =
    useGetSuppliersBrandsAndProductsQuery();
  const [formData, setFormData] = useState({
    supplier: '',
    brand: '',
    items: [
      {
        productName: '',
        category: '',
        quantityReceived: 0,
        unit: '',
        unitPrice: 0,
        expiryDate: '',
      },
    ],
    status: 'Pending',
    notes: '',
  });

  const [availableProducts, setAvailableProducts] = useState([]);
  const [supplierQuantityError, setSupplierQuantityError] = useState('');
  const { data: supplierQuantity, refetch: refetchSupplierQuantity } =
    useGetSupplierQuantityQuery(formData.supplier, {
      skip: !formData.supplier,
    });

  useEffect(() => {
    if (formData.brand && suppliersBrandsProducts) {
      const selectedBrand = suppliersBrandsProducts.brands.find(
        (brand) => brand._id === formData.brand
      );
      setAvailableProducts(selectedBrand ? selectedBrand.productNames : []);
    }
  }, [formData.brand, suppliersBrandsProducts]);

  useEffect(() => {
    if (formData.supplier) {
      refetchSupplierQuantity();
    }
  }, [formData.supplier, refetchSupplierQuantity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'brand') {
      setFormData((prevState) => ({
        ...prevState,
        items: [{ ...prevState.items[0], productName: '' }],
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === 'category' && value === 'Materials') {
      newItems[index].productName = '';
    }
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
  };

  const validateSupplierQuantity = () => {
    if (!supplierQuantity) return true;

    for (const item of formData.items) {
      const supplierProduct = supplierQuantity.find(
        (sq) => sq.product.name === item.productName
      );
      if (supplierProduct && item.quantityReceived > supplierProduct.quantity) {
        setSupplierQuantityError(
          `Requested quantity for ${item.productName} exceeds supplier's available quantity.`
        );
        return false;
      }
    }
    setSupplierQuantityError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSupplierQuantity()) {
      return;
    }
    try {
      const dataToSend = {
        ...formData,
        brand:
          formData.items[0].category === 'Pre-made-foods'
            ? formData.brand
            : formData.brand.toString(),
      };
      await createGRN(formData).unwrap();
      toast.success('GRN created successfully');
      navigate('/grns');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to create GRN');
    }
  };

  if (isLoadingOptions) return <div>Loading...</div>;

  return (
    <Paper
      elevation={3}
      style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}
    >
      <Typography variant='h5' gutterBottom>
        Create New GRN
      </Typography>
      {supplierQuantityError && (
        <Typography color='error' gutterBottom>
          {supplierQuantityError}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Supplier</InputLabel>
              <Select
                name='supplier'
                value={formData.supplier}
                onChange={handleChange}
                required
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
              {formData.items[0].category === 'Materials' ? (
                <TextField
                  name='brand'
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  placeholder=' Brand name'
                />
              ) : (
                <Select
                  name='brand'
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  placeholder=' Brand name'
                >
                  {suppliersBrandsProducts?.brands.map((brand) => (
                    <MenuItem key={brand._id} value={brand._id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
          </Grid>
          {formData.items.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Typography variant='h6'>Item {index + 1}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    {formData.items[0].category === 'Pre-made-foods' ? (
                      <Select
                        value={item.productName}
                        onChange={(e) =>
                          handleItemChange(index, 'productName', e.target.value)
                        }
                        required
                        disabled={!formData.brand}
                      >
                        {availableProducts.map((productName) => (
                          <MenuItem key={productName} value={productName}>
                            {productName}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <TextField
                        value={item.productName}
                        onChange={(e) =>
                          handleItemChange(index, 'productName', e.target.value)
                        }
                        required
                        placeholder='product name'
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
                    value={item.expiryDate}
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
              {isLoading ? 'Registering...' : 'Register GRN'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default GRNCreateScreen;
