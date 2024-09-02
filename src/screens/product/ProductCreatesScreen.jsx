import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProductMutation } from '../../slices/product/productApiSlice';
import { useGetBrandsQuery } from '../../slices/brand/brandApiSlice';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

const ProductCreateScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    brandId: '',
    category: '',
    image: '',
    unitPrice: '',
    description: '',
  });

  const [productNames, setProductNames] = useState([]);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const { data: brands, isLoading: isBrandsLoading } = useGetBrandsQuery();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === 'brandId') {
      const selectedBrand = brands.find((brand) => brand._id === value);
      console.log('brandId ', value);
      if (selectedBrand && selectedBrand.productNames) {
        setProductNames(selectedBrand.productNames);
        console.log('brand', selectedBrand);
        console.log('productNames', productNames);
      } else {
        setProductNames([]);
      }
      setFormData((prevData) => ({ ...prevData, name: '' }));
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
    setFormData((prevData) => ({ ...prevData, image: e.target.files[0].name }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== 'image') {
          productData.append(key, formData[key]);
        }
      });

      if (selectedFile) {
        productData.append('image', selectedFile);
      }
      console.log('product data', formData);

      const result = await createProduct(formData).unwrap();
      console.log(productData);
      toast.success('Product created successfully');
      navigate('/products-list');
    } catch (err) {
      console.error('Error creating product:', err);
      toast.error(
        `Failed to create Product: ${err.message || 'Unknown error'}`
      );
    }
  };

  if (isBrandsLoading) return <Loader />;

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, margin: 'auto' }}
    >
      <Typography variant='h4' gutterBottom>
        Create New Product
      </Typography>
      <FormControl fullWidth margin='normal' required>
        <InputLabel>Brand</InputLabel>
        <Select name='brandId' value={formData.brandId} onChange={handleChange}>
          {brands.map((brand) => (
            <MenuItem key={brand._id} value={brand._id}>
              {brand.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin='normal' required>
        <InputLabel>Product Name</InputLabel>
        <Select
          name='name'
          value={formData.name}
          onChange={handleChange}
          disabled={!formData.brandId}
        >
          {productNames.map((name, index) => (
            <MenuItem key={index} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin='normal' required>
        <InputLabel>Category</InputLabel>
        <Select
          name='category'
          value={formData.category}
          onChange={handleChange}
        >
          <MenuItem value='In-house-made-foods'>In-house-made-foods</MenuItem>
          <MenuItem value='Pre-made-foods'>Pre-made-foods</MenuItem>
        </Select>
      </FormControl>
      <TextField
        name='unitPrice'
        label='Unit Price'
        type='number'
        value={formData.unitPrice}
        onChange={handleChange}
        fullWidth
        margin='normal'
        required
      />
      <TextField
        name='description'
        label='Description'
        value={formData.description}
        onChange={handleChange}
        fullWidth
        margin='normal'
        multiline
        rows={4}
        required
      />
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
        <input
          type='file'
          accept='image/*'
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
        <Button
          variant='outlined'
          onClick={() => fileInputRef.current.click()}
          sx={{ mr: 2 }}
        >
          Choose Image
        </Button>
        <Typography>
          {selectedFile ? selectedFile.name : 'No file chosen'}
        </Typography>
      </Box>
      <Button
        type='submit'
        variant='contained'
        color='primary'
        disabled={isCreating}
        sx={{ mt: 2 }}
      >
        {isCreating ? 'Creating...' : 'Create Product'}
      </Button>
    </Box>
  );
};

export default ProductCreateScreen;
