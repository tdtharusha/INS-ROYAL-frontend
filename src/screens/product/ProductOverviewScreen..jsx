import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Box,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from '@mui/material';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import {
  useGetProductByIdQuery,
  useCreateProductReviewMutation,
} from '../../slices/product/productApiSlice';
import { useGetInventoryQuery } from '../../slices/inventory/preMadeFoodsInventory/preMadeFoodApiSlice';
import { useGetInHouseInventoryQuery } from '../../slices/inventory/inHouseFoodsInventory/inHouseMadeFoodApiSllice';
import { addToCart } from '../../slices/shoppingCart/shoppingCartSlice';
import { useAddToCartMutation } from '../../slices/shoppingCart/shoppingCartApiSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const ProductOverviewScreen = ({}) => {
  const { id: productId } = useParams();
  console.log(productId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId, { skip: !productId });

  const [addReview] = useCreateProductReviewMutation();
  const [addToCartMutation] = useAddToCartMutation();

  const { data: preMadeInventory = {} } = useGetInventoryQuery();
  const { data: inHouseInventory = {} } = useGetInHouseInventoryQuery();

  console.log('Product data:', product);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);

  const [category, setCategory] = useState('all');

  const isAuthenticated = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user);

  const getInventoryInfo = (product) => {
    if (product.category === 'In-house-made-foods') {
      return inHouseInventory[product._id] || { quantity: 0, reorderLevel: 0 };
    } else {
      return preMadeInventory[product._id] || { quantity: 0, reorderLevel: 0 };
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart');
      navigate('/login');
      return;
    }

    const inventoryInfo = getInventoryInfo(product);
    if (product.inventoryInfo.quantity < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    try {
      const result = await addToCartMutation({
        productId: product._id,
        quantity,
      }).unwrap();
      dispatch(addToCart({ ...product, quantity }));
      toast.success('Item added successfully to Cart');
    } catch (err) {
      toast.error('Failed to add item to cart');
      console.error('Failed to add item to cart', err);
    }
  };

  const handleAddReview = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add a review');
      navigate('/login');
      return;
    }

    try {
      await addReview({
        productId,
        text: reviewText,
        rating: reviewRating,
      }).unwrap();
      setReviewDialogOpen(false);
      setReviewText('');
      setReviewRating(0);
      toast.success('Review added successfully');
    } catch (err) {
      toast.error('Failed to add review');
      console.error('Failed to add review:', err);
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return <Typography color='error'>Error loading Product</Typography>;

  const inventoryInfo = getInventoryInfo(product);

  return (
    <Container maxWidth='lg'>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <Zoom>
              <CardMedia
                component='img'
                height='400'
                image={product.image || ''}
                alt={product.name || 'Product Image'}
              />
            </Zoom>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant='h4' gutterBottom>
            {product.name}
          </Typography>
          <Typography variant='subtitle1' gutterBottom>
            Brand: {product.brand.name}
          </Typography>
          <Typography variant='body1' gutterBottom>
            Category: {product.category}
          </Typography>
          <Box display='flex' alignItems='center' mb={1}>
            <Rating value={product.averageRating} readOnly precision={0.5} />
            <Typography variant='body2' ml={1}>
              ({product.numberOfReviews} reviews)
            </Typography>
          </Box>
          <Typography variant='h6' gutterBottom>
            Price: Rs {product.unitPrice}
          </Typography>
          <Typography variant='body1' gutterBottom>
            Availability:{' '}
            {product.inventoryInfo.quantity > 0 ? 'In Stock' : 'Out of Stock'}
          </Typography>
          <Typography variant='body1' gutterBottom>
            Quantity Available: {product.inventoryInfo.quantity}
          </Typography>
          <Box my={2}>
            <TextField
              type='number'
              label='Quantity'
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value)))
              }
              InputProps={{
                inputProps: { min: 1, max: inventoryInfo.quantity },
              }}
            />
          </Box>
          <Button
            variant='contained'
            color='primary'
            onClick={handleAddToCart}
            // disabled={!isAuthenticated || product.availableQuantity === 0}
            disabled={
              !isAuthenticated ||
              product.inventoryInfo.quantity === 0 ||
              quantity > product.inventoryInfo.quantity
            }
          >
            Add to Cart
          </Button>
          <Typography variant='body1' style={{ marginTop: '20px' }}>
            Description: {product.description}
          </Typography>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant='h5' gutterBottom>
          Reviews
        </Typography>
        {isAuthenticated && (
          <Button variant='outlined' onClick={() => setReviewDialogOpen(true)}>
            Add Review
          </Button>
        )}
        <List>
          {product.reviews.map((review, index) => (
            <ListItem key={index} alignItems='flex-start'>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      component='span'
                      variant='body1'
                      color='text.primary'
                    >
                      {review.user.name}
                    </Typography>
                    <Rating value={review.rating} readOnly size='small' />
                  </React.Fragment>
                }
                secondary={review.text}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
      >
        <DialogTitle>Add Review</DialogTitle>
        <DialogContent>
          <Rating
            value={reviewRating}
            onChange={(event, newValue) => setReviewRating(newValue)}
          />
          <TextField
            autoFocus
            margin='dense'
            label='Review'
            type='text'
            fullWidth
            multiline
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddReview}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductOverviewScreen;
