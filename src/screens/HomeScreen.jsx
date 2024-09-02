import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Box,
} from '@mui/material';
import { ShoppingCart, ZoomIn } from '@mui/icons-material';
import Carousel from 'react-bootstrap/Carousel';
import {
  useGetProductsQuery,
  useGetTopProductsQuery,
} from '../slices/product/productApiSlice';
import { useGetInventoryQuery } from '../slices/inventory/preMadeFoodsInventory/preMadeFoodApiSlice';
import { useGetInHouseInventoryQuery } from '../slices/inventory/inHouseFoodsInventory/inHouseMadeFoodApiSllice';
import { addToCart } from '../slices/shoppingCart/shoppingCartSlice';
import { useAddToCartMutation } from '../slices/shoppingCart/shoppingCartApiSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const HomeScreen = () => {
  // Import necessary hooks and functions from React Router, Redux local file
  const navigate = useNavigate();
  const { keyword } = useParams();
  const dispatch = useDispatch();

  const [addToCartMutation] = useAddToCartMutation();
  const [category, setCategory] = useState('all');

  const {
    data: products = [],
    isLoading: loadingProducts,
    error: errorProducts,
  } = useGetProductsQuery({ keyword, category });
  const {
    data: topProducts = [],
    isLoading: loadingTopProducts,
    error: errorTopProducts,
  } = useGetTopProductsQuery();

  const { data: preMadeInventory = {} } = useGetInventoryQuery();
  const { data: inHouseInventory = {} } = useGetInHouseInventoryQuery();
  console.log('preMadeInventory data:', preMadeInventory);
  console.log('inHouseInventory data:', inHouseInventory);

  // console.log('products', products);
  // console.log('top products', topProducts);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}/overview`);
  };

  const handleAddToCart = async (product) => {
    const inventoryInfo = getInventoryInfo(product);
    if (inventoryInfo.quantity === 0) {
      toast.error('This item is out of stock');
      return;
    }

    try {
      const result = await addToCartMutation({
        productId: product._id,
        quantity: 1,
      }).unwrap();
      // console.log('Add to cart result:', result);
      dispatch(
        addToCart({
          ...product,
          quantity: 1,
        })
      );
      toast.success('Item added sucessfully to Cart');
    } catch (err) {
      toast.error('Failed to add item to cart');
      console.error('Failed to add item to cart', err);
    }
  };

  const getInventoryInfo = (product) => {
    console.log('prodct data: ', product);
    return product.inventoryInfo || { quantity: 0, reorderLevel: 0 };
  };

  // If products are loading, then display a loader to the better user experience
  if (loadingProducts || loadingTopProducts) return <Loader />;

  // code continue below like this

  if (errorProducts) {
    console.error('Error fetching products:', errorProducts);
    return (
      <Typography>Error fetching products: {errorProducts.message}</Typography>
    );
  }

  if (errorTopProducts) {
    console.error('Error fetching top products:', errorTopProducts);
    return (
      <Typography>
        Error fetching top products: {errorTopProducts.message}
      </Typography>
    );
  }

  return (
    <Container>
      <Carousel align='center'>
        {products.map((product) => (
          <Carousel.Item key={product.id}>
            <img
              className='d-block w-15'
              height='300'
              src={product.image}
              alt={product.name}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      <Typography variant='h4' align='center' gutterBottom>
        Top Products
        <br />
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              <CardMedia
                component='img'
                height='100'
                align='center'
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                  {product.name}
                </Typography>
              </CardContent>
              {/* <Box
                sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}
              >
                <IconButton onClick={() => handleProductClick(product._id)}>
                  <ZoomIn />
                </IconButton>
                <IconButton onClick={() => handleAddToCart(product)}>
                  <ShoppingCart />
                </IconButton>
              </Box> */}
            </Card>
          </Grid>
        ))}
      </Grid>
      <br />
      <Typography variant='h4' align='center' gutterBottom>
        All Products
      </Typography>
      <br />
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              <CardMedia
                component='img'
                height='100'
                align='center'
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                  {product.name}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Rs.{product.unitPrice}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Category: {product.category}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Availability:{' '}
                  {getInventoryInfo(product).quantity > 0
                    ? 'In Stock'
                    : 'Out of Stock'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Quantity: {getInventoryInfo(product).quantity}
                </Typography>
              </CardContent>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}
              >
                <IconButton onClick={() => handleProductClick(product._id)}>
                  <ZoomIn />
                </IconButton>
                <IconButton
                  onClick={() => handleAddToCart(product)}
                  disabled={getInventoryInfo(product).quantity === 0}
                >
                  <ShoppingCart />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomeScreen;
