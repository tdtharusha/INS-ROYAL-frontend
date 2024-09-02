import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useProduceDailyInHouseMadeFoodsMutation,
  useProduceInHouseMadeFoodsSpecialOrderMutation,
} from '../../slices/dailyProduct/dailyProductApiSlice';
import {
  setDailyProducts,
  setLoading,
  setError,
} from '../../slices/dailyProduct/dailyProductSlice';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Button,
  Container,
  Typography,
  Box,
  TextField,
  Alert,
  Autocomplete,
} from '@mui/material';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useGetInHouseMadeProductsQuery } from '../../slices/product/productApiSlice';

const DailyProductScreen = () => {
  const dispatch = useDispatch();
  const { dailyProducts, loading, error } = useSelector(
    (state) => state.dailyProduct
  );
  const [produceDailyInHouseMadeFoods] =
    useProduceDailyInHouseMadeFoodsMutation();

  const [produceInHouseMadeFoodsSpecialOrder] =
    useProduceInHouseMadeFoodsSpecialOrderMutation();

  const { data: inHouseMadeFoods, isLoading: isLoadingProducts } =
    useGetInHouseMadeProductsQuery();

  const [specialOrder, setSpecialOrder] = useState({
    productName: '',
    brandId: '',
    quantity: '',
  });
  console.log('special order', specialOrder);
  const [paginationModel, setPaginationModel] = useState();
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });

  const handleDailyProduction = async () => {
    try {
      dispatch(setLoading(true));
      const result = await produceDailyInHouseMadeFoods().unwrap();
      dispatch(setDailyProducts(result));
      toast.success('Daily production completed successfully');
    } catch (err) {
      dispatch(setError(err.data?.message || 'An error occurred'));
      toast.error(err.data?.message || 'Error in daily production');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSpecialOrder = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      await produceInHouseMadeFoodsSpecialOrder(specialOrder).unwrap();
      toast.success('Special order produced successfully');
      setSpecialOrder({ productName: '', brandId: '', quantity: '' });
    } catch (err) {
      dispatch(setError(err.data?.message || 'An error occurred'));
      // toast.error(err.data?.message || 'Error in Special order production');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const columns = [
    { field: 'productName', headerName: 'Product Name', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 1 },
  ];

  return (
    <Container maxWidth='lg'>
      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Typography variant='h4' gutterBottom>
        Daily Production
      </Typography>

      <Box mb={3}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleDailyProduction}
          disabled={loading}
        >
          {loading ? <Loader /> : 'Produce Daily In-House Made Foods'}
        </Button>
      </Box>
      {dailyProducts.length > 0 && (
        <Box mb={3} style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={dailyProducts.map((product, index) => ({
              ...product,
              id: index,
            }))}
            columns={columns}
            autoPageSize
            {...dailyProducts}
          />
        </Box>
      )}
      <Typography variant='h5' gutterBottom>
        Special Order
      </Typography>
      <Box
        component='form'
        onSubmit={handleSpecialOrder}
        noValidate
        sx={{ mt: 1 }}
      >
        {isLoadingProducts ? (
          <Loader />
        ) : (
          <Autocomplete
            options={inHouseMadeFoods || []}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label='Product Name' />
            )}
            value={specialOrder.productName}
            onChange={(event, newValue) => {
              setSpecialOrder({
                ...specialOrder,
                productName: newValue ? newValue.name : '',
                brandId: newValue ? newValue.brand._id : '',
              });
            }}
            fullWidth
            margin='normal'
          />
        )}
        <TextField
          margin='normal'
          required
          fullWidth
          id='brandId'
          label='Brand ID'
          name='brandId'
          value={
            specialOrder.brandId
              ? inHouseMadeFoods.find(
                  (product) => product.brand._id === specialOrder.brandId
                )?.brand.name
              : ''
          }
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='quantity'
          label='Quantity'
          name='quantity'
          type='number'
          value={specialOrder.quantity}
          onChange={(e) =>
            setSpecialOrder({ ...specialOrder, quantity: e.target.value })
          }
        />
        <Button
          type='submit'
          fullWidth
          variant='contained'
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <Loader /> : 'Produce Special Order'}
        </Button>
      </Box>
    </Container>
  );
};

export default DailyProductScreen;
