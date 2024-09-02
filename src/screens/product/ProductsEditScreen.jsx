import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from '../../slices/product/productApiSlice';
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

const ProductsEditScreen = () => {
  const { id: productId } = useParams();
  console.log(productId);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    brandId: '',
    category: '',
    image: '',
    unitPrice: '',
    description: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const {
    data: product,
    isLoading,
    error: fetchError,
    refetch,
  } = useGetProductByIdQuery(productId);
  const [updateProduct, { isLoading: isUpdating, error: updateError }] =
    useUpdateProductMutation();

  useEffect(() => {
    console.log('Product data received:', product);
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand.name || '',
        brandId: product.brand._id || '',
        category: product.category || '',
        image: product.image || '',
        unitPrice: product.unitPrice?.toString() || '',
        description: product.description || '',
      });
    }
  }, [product]);
  console.log(product);

  useEffect(() => {
    console.log('Form data updated:', formData); // Log the form data after it's updated
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFormData((prevData) => ({
      ...prevData,
      newImageFile: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        name: formData.name,
        brand: formData.brandId,
        category: formData.category,
        unitPrice: parseFloat(formData.unitPrice),
        description: formData.description,
        image: formData.image,
      };

      function getFileExtension(filename) {
        return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
      }

      console.log('Submitting update with data:', updatedProduct);

      if (formData.newImageFile) {
        const formDataToSend = new FormData();

        // Generate a filename similar to the backend
        const fileExtension = getFileExtension(formData.newImageFile.name);
        const newFileName = `image-${Date.now()}${fileExtension}`;

        // Append the file with the new filename
        formDataToSend.append('image', formData.newImageFile, newFileName);

        Object.keys(updatedProduct).forEach((key) => {
          formDataToSend.append(key, updatedProduct[key]);
        });

        const result = await updateProduct({
          id: productId,
          data: formDataToSend,
          ...updatedProduct,
        }).unwrap();
        toast.success('Product update successfully');
        navigate('/products-list');
      } else {
        const result = await updateProduct({
          id: productId,
          ...updatedProduct,
        }).unwrap();
        toast.success('Product update successfully');
        navigate('/products-list');
      }
      setFormData((prevData) => ({
        ...prevData,
        image: result.image,
        newImageFile: null,
      }));
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error(
        `Failed to Update Product: ${err.message || 'Unknown error'}`
      );
      console.error(err);
    }
  };

  if (isLoading) return <Loader />;
  if (fetchError)
    return <Typography color='error'>Error loading product</Typography>;

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, margin: 'auto' }}
    >
      <Typography variant='h4' gutterBottom>
        Update Product
      </Typography>
      <TextField
        name='name'
        label='Name'
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin='normal'
        required
      />
      <TextField
        name='brand'
        label='Brand'
        value={formData.brand}
        onChange={handleChange}
        fullWidth
        margin='normal'
        required
        disabled
      />
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
        <Box sx={{ mt: 2, mb: 2 }}>
          {formData.image && (
            <img
              src={
                formData.newImageFile
                  ? URL.createObjectURL(formData.newImageFile)
                  : `/${formData.image.replace(/^\/+/, '')}`
              }
              alt='Product'
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          )}
        </Box>

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
          {formData.newImageFile
            ? formData.newImageFile.name
            : formData.image.split('/').pop()}
        </Typography>
      </Box>
      <Button
        type='submit'
        variant='contained'
        color='primary'
        disabled={isUpdating}
        sx={{ mt: 2 }}
      >
        {isUpdating ? 'Updating...' : 'Update Product'}
      </Button>
    </Box>
  );
};

export default ProductsEditScreen;
