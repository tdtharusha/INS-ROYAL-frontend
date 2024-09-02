import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { PayPalButton } from 'react-paypal-button-v2';
import { clearCart } from '../../slices/shoppingCart/shoppingCartSlice';
import {
  useCreateOrderMutation,
  useCalculateShippingPriceMutation,
} from '../../slices/order/orderApiSlice';
import { useGetCartQuery } from '../../slices/shoppingCart/shoppingCartApiSlice';
import { toast } from 'react-toastify';

const CheckoutScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const {
    data: cart,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useGetCartQuery();
  console.log('cart data:', cart);

  // const { cartItems, subTotal, discount, totalAmount } = useSelector(
  //   (state) => state.shoppingCart
  // );

  // console.log('cart item:', cartItems);
  // console.log('cart subTotal:', subTotal);
  // console.log('cart discount:', discount);
  // console.log('cart totalAmount:', totalAmount);

  const [createOrder] = useCreateOrderMutation();
  const [calculateShippingPrice] = useCalculateShippingPriceMutation();

  const [shippingMethod, setShippingMethod] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    // postalCode: '',
    country: '',
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (cart && cart.items) {
      const newSubTotal = cart.items.reduce(
        (acc, item) => acc + item.product.unitPrice * item.quantity,
        0
      );
      setSubTotal(newSubTotal);

      const newDiscount = 0;
      setDiscount(newDiscount);

      setTotalAmount(newSubTotal - newDiscount);
    }
  }, [cart]);

  useEffect(() => {
    if (
      shippingMethod === 'delivery' &&
      shippingAddress.address &&
      shippingAddress.city &&
      shippingAddress.country
    ) {
      calculateShipping();
    }
  }, [shippingAddress, shippingMethod]);

  // const getCoordinates = async () => {
  //   try {
  //     const response = await fetch(
  //       `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //         `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.country}`
  //       )}&key=${GOOGLE_MAPS_API_KEY}`
  //     );
  //     console.log('coordinates:', response);
  //     const data = await response.json();
  //     if (data.results && data.results.length > 0) {
  //       const { lat, lng } = data.results[0].geometry.location;
  //       setCoordinates({ lat, lng });
  //       calculateShipping({ lat, lng });
  //     }
  //     console.log('address data:', data);
  //   } catch (error) {
  //     console.error('Error getting coordinates:', error);
  //     toast.error('Failed to get location coordinates');
  //   }
  // };

  const calculateShipping = async () => {
    try {
      const result = await calculateShippingPrice({
        address: shippingAddress.address,
        city: shippingAddress.city,
        country: shippingAddress.country,
      }).unwrap();
      setShippingPrice(result.shippingPrice);
      setCoordinates({
        lat: result.shippingCoordinates.lat,
        lng: result.shippingCoordinates.lng,
      });
    } catch (error) {
      console.error('Error calculating shipping price:', error);
      toast.error('Failed to calculate shipping price');
    }
  };

  const handleShippingMethodChange = (event) => {
    setShippingMethod(event.target.value);
    if (event.target.value === 'pickup') {
      setShippingPrice(0);
    }
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleShippingAddressChange = (event) => {
    setShippingAddress({
      ...shippingAddress,
      [event.target.name]: event.target.value,
    });
  };

  const handleCardDetailsChange = (event) => {
    setCardDetails({
      ...cardDetails,
      [event.target.name]: event.target.value,
    });
  };

  const validatePickupDateTime = () => {
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const currentDateTime = new Date();
    const hourDifference =
      (pickupDateTime - currentDateTime) / (1000 * 60 * 60);
    return hourDifference >= 1;
  };

  const handlePlaceOrder = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error(
        'Your cart is empty. Please add items before placing an order.'
      );
      return;
    }

    if (shippingMethod === 'pickup' && !validatePickupDateTime()) {
      toast.error(
        'Pickup time must be at least 1 hour after the current time.'
      );
      return;
    }

    if (shippingMethod === 'delivery' && !coordinates) {
      toast.error('Please enter a valid shipping address.');
      return;
    }

    if (
      paymentMethod === 'card' &&
      (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv)
    ) {
      toast.error('Please enter valid card details.');
      return;
    }

    setIsLoading(true);

    try {
      const pickupDateTime =
        shippingMethod === 'pickup'
          ? new Date(`${pickupDate}T${pickupTime}`)
          : null;

      const orderData = {
        orderItems: cart.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.unitPrice,
          image: item.product.image,
        })),
        shippingMethod,
        pickupDateTime,
        shippingAddress: shippingMethod === 'delivery' ? shippingAddress : null,
        paymentMethod,
        subTotal,
        shippingPrice,
        totalPrice: totalAmount + shippingPrice,
        isPaid: paymentMethod === 'card',
        paidAt: paymentMethod === 'card' ? new Date().toISOString() : null,
        coordinates:
          shippingMethod === 'delivery'
            ? [coordinates.lng, coordinates.lat]
            : null,
      };

      const res = await createOrder(orderData).unwrap();
      dispatch(clearCart());
      toast.success('Order created successfully');
      navigate(`/order-summary/${res._id}`);
    } catch (err) {
      toast.error(err.data?.message || 'Failed to create order');
      console.log('Failed to create order:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant='h6' gutterBottom>
              Checkout
            </Typography>
            <RadioGroup
              value={shippingMethod}
              onChange={handleShippingMethodChange}
            >
              <FormControlLabel
                value='delivery'
                control={<Radio />}
                label='Delivery'
              />
              <FormControlLabel
                value='pickup'
                control={<Radio />}
                label='Pickup'
              />
            </RadioGroup>

            {shippingMethod === 'delivery' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant='h6' gutterBottom>
                  Shipping Address
                </Typography>
                <TextField
                  required
                  name='address'
                  label='Address'
                  fullWidth
                  value={shippingAddress.address}
                  onChange={handleShippingAddressChange}
                  margin='normal'
                />
                <TextField
                  required
                  name='city'
                  label='City'
                  fullWidth
                  value={shippingAddress.city}
                  onChange={handleShippingAddressChange}
                  margin='normal'
                />
                {/*<TextField
                  required
                  name='postalCode'
                  label='Postal Code'
                  fullWidth
                  value={shippingAddress.postalCode}
                  onChange={handleShippingAddressChange}
                  margin='normal'
                />*/}
                <TextField
                  required
                  name='country'
                  label='Country'
                  fullWidth
                  value={shippingAddress.country}
                  onChange={handleShippingAddressChange}
                  margin='normal'
                />
                {coordinates && (
                  <Box sx={{ mt: 2, height: '300px', width: '100%' }}>
                    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                      <GoogleMap
                        mapContainerStyle={{ height: '100%', width: '100%' }}
                        center={{ lat: coordinates.lat, lng: coordinates.lng }}
                        zoom={15}
                      >
                        <Marker
                          position={{
                            lat: coordinates.lat,
                            lng: coordinates.lng,
                          }}
                        />
                      </GoogleMap>
                    </LoadScript>
                  </Box>
                )}
              </Box>
            )}

            {shippingMethod === 'pickup' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant='h6' gutterBottom>
                  Pickup Date and Time
                </Typography>
                <TextField
                  type='date'
                  label='Pickup Date'
                  fullWidth
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  type='time'
                  label='Pickup Time'
                  fullWidth
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant='h6' gutterBottom>
                Payment Method
              </Typography>
              <RadioGroup
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel
                  value='card'
                  control={<Radio />}
                  label='Card'
                />
                <FormControlLabel
                  value='cash'
                  control={<Radio />}
                  label='Cash on Delivery'
                />
              </RadioGroup>
            </Box>

            {paymentMethod === 'card' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant='h6' gutterBottom>
                  Card Details
                </Typography>
                <TextField
                  required
                  name='cardNumber'
                  label='Card Number'
                  fullWidth
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                  margin='normal'
                />
                <TextField
                  required
                  name='expiryDate'
                  label='Expiry Date'
                  fullWidth
                  value={cardDetails.expiryDate}
                  onChange={handleCardDetailsChange}
                  margin='normal'
                />
                <TextField
                  required
                  name='cvv'
                  label='CVV'
                  fullWidth
                  value={cardDetails.cvv}
                  onChange={handleCardDetailsChange}
                  margin='normal'
                />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant='h6' gutterBottom>
              Cart Summary
            </Typography>
            {isCartLoading ? (
              <CircularProgress />
            ) : isCartError ? (
              <Typography>Error loading cart</Typography>
            ) : cart && cart.items && cart.items.length > 0 ? (
              <>
                {cart.items.map((item) => (
                  <Box key={item.product._id} sx={{ display: 'flex', mb: 1 }}>
                    <Typography variant='body1' sx={{ flexGrow: 1 }}>
                      {item.product.name} x {item.quantity}
                    </Typography>
                    <Typography variant='body1'>
                      Rs.{item.product.unitPrice * item.quantity}
                    </Typography>
                  </Box>
                ))}
                <Box sx={{ mt: 2 }}>
                  <Typography variant='body1'>
                    Subtotal: Rs.{subTotal.toFixed(2)}
                  </Typography>
                  <Typography variant='body1'>
                    Discount: Rs.{discount.toFixed(2)}
                  </Typography>
                  <Typography variant='body1'>
                    Shipping Price: Rs.{shippingPrice.toFixed(2)}
                  </Typography>
                  <Typography variant='h6'>
                    Total: Rs.{(totalAmount + shippingPrice).toFixed(2)}
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography>Your cart is empty</Typography>
            )}
            <Button
              variant='contained'
              color='primary'
              fullWidth
              sx={{ mt: 2 }}
              onClick={handlePlaceOrder}
              disabled={
                isLoading || !cart || !cart.items || cart.items.length === 0
              }
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : paymentMethod === 'card' ? (
                'Pay'
              ) : (
                'Place Order'
              )}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutScreen;
