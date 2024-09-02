import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from '../../slices/shoppingCart/shoppingCartApiSlice';
import {
  removeFromCart,
  updateCartItemQuantity,
} from '../../slices/shoppingCart/shoppingCartSlice';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const ShoppingCartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: cart, isLoading, isError } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveFromCartMutation();

  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (cart && cart.items) {
      const newSubtotal = cart.items.reduce(
        (acc, item) => acc + item.product.unitPrice * item.quantity,
        0
      );
      setSubTotal(newSubtotal);

      // Calculate discount (you'll need to implement your discount logic here)
      const newDiscount = 0; // Replace with your discount calculation
      setDiscount(newDiscount);

      setTotalAmount(newSubtotal - newDiscount);
    }
  }, [cart]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity > 0) {
      await updateCartItem({ productId, quantity: newQuantity });
      dispatch(
        updateCartItemQuantity({ id: productId, quantity: newQuantity })
      );
      toast.success('Your cart updated');
    }
  };

  const handleRemoveItem = async (productId) => {
    await removeCartItem(productId);
    dispatch(removeFromCart(productId));
    toast.success('Item removed from your cart');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading) return <Loader />;
  if (isError) return <Typography>Error Loading cart</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 2 }}>
      <Typography variant='h4' gutterBottom>
        Shopping Cart
      </Typography>
      <Box
        display='flex'
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent='space-between'
      >
        <TableContainer
          component={Paper}
          sx={{
            width: isMobile ? '100%' : '70%',
            marginBottom: isMobile ? 2 : 0,
          }}
        >
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell width='15%'></TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                <TableCell align='center' sx={{ fontWeight: 'bold' }}>
                  Price
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 'bold' }}>
                  Qty
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 'bold' }}>
                  Total
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 'bold' }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.items.map((item) => (
                <TableRow key={item.product._id}>
                  <TableCell>
                    <Box
                      component='img'
                      sx={{
                        height: 50,
                        width: 50,
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      alt={item.product.name || 'Product Image'}
                      src={
                        item.product.image
                          ? item.product.image.replace('//', '/')
                          : 'https://via.placeholder.com/50'
                      }
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.product.name}
                  </TableCell>
                  <TableCell align='center'>
                    Rs. {item.product.unitPrice}
                  </TableCell>
                  <TableCell>
                    <Box
                      display='flex'
                      justifyContent='center'
                      alignItems='center'
                    >
                      <IconButton
                        size='small'
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity - 1
                          )
                        }
                      >
                        <RemoveOutlinedIcon fontSize='small' />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.product._id,
                            parseInt(e.target.value)
                          )
                        }
                        type='number'
                        InputProps={{
                          inputProps: {
                            min: 1,
                            style: {
                              textAlign: 'center',
                              padding: '2px',
                              width: '30px',
                            },
                          },
                        }}
                        variant='standard'
                        sx={{ width: 40, mx: 1 }}
                      />
                      <IconButton
                        size='small'
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity + 1
                          )
                        }
                      >
                        <AddIcon fontSize='small' />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align='center'>
                    Rs. {item.product.unitPrice * item.quantity}
                  </TableCell>
                  <TableCell align='center'>
                    <IconButton
                      size='small'
                      onClick={() => handleRemoveItem(item.product._id)}
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ width: isMobile ? '100%' : '25%' }}>
          <Typography variant='h6' gutterBottom>
            Summary
          </Typography>
          <Box display='flex' justifyContent='space-between'>
            <Typography>Items:</Typography>
            <Typography>{cart.items.length}</Typography>
          </Box>
          <Box display='flex' justifyContent='space-between'>
            <Typography>Sub Total:</Typography>
            <Typography>Rs. {subTotal.toFixed(2)}</Typography>
          </Box>
          <Box display='flex' justifyContent='space-between'>
            <Typography>Discount:</Typography>
            <Typography>Rs. {discount.toFixed(2)}</Typography>
          </Box>
          <Box
            display='flex'
            justifyContent='space-between'
            sx={{ fontWeight: 'bold', marginTop: 2 }}
          >
            <Typography sx={{ fontWeight: 'bold' }}>TOTAL:</Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              Rs. {totalAmount.toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={() => handleCheckout()}
          >
            Proceed to checkout
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ShoppingCartScreen;
