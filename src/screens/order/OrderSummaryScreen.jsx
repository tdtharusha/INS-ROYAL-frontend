import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import QRCode from 'qrcode';
import { useGetOrderByIdQuery } from '../../slices/order/orderApiSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { useReactToPrint } from 'react-to-print';
import OrderInvoice from '../report/OrderInvoice';

const OrderSummaryScreen = () => {
  const { orderId } = useParams();
  const { data: order, isLoading, isError } = useGetOrderByIdQuery(orderId);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  console.log('order Id:', orderId);
  console.log('order data:', order);

  const invoiceRef = useRef();

  useEffect(() => {
    if (order) {
      generateQRCode();
    }
  }, [order]);

  const generateQRCode = async () => {
    try {
      const qrData = JSON.stringify({
        orderId: order._id,
        total: order.totalPrice,
        date: order.createdAt,
      });
      const url = await QRCode.toDataURL(qrData);
      setQrCodeUrl(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
      toast.error('Failed to generate QR code');
    }
  };

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    toast.error('Failed to load order details');
    return (
      <Container>
        <Typography variant='h6'>Error loading order details</Typography>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <Typography variant='h6'>Order not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant='h4' gutterBottom>
          Order {order._id}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box>
              <Typography variant='h6' gutterBottom>
                {order.shippingMethod === 'delivery'
                  ? 'Delivery Details'
                  : 'Pickup Details'}
              </Typography>
              {order.shippingMethod === 'delivery' && (
                <>
                  <Typography>
                    Address: {order.shippingAddress.address}
                  </Typography>
                  <Typography>City: {order.shippingAddress.city}</Typography>
                  <Typography>
                    Country: {order.shippingAddress.country}
                  </Typography>
                </>
              )}
              {order.shippingMethod === 'pickup' && (
                <Typography>
                  Pickup Date/Time:{' '}
                  {new Date(order.pickupDateTime).toLocaleString()}
                </Typography>
              )}
              <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
                <Typography>Order Status: {order.status}</Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant='h6' gutterBottom>
                Payment Method
              </Typography>
              <Typography>Method: {order.paymentMethod}</Typography>
              <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
                <Typography>
                  Payment Status: {order.isPaid ? 'Paid' : 'Pending'}
                </Typography>
                {order.isPaid && (
                  <Typography>
                    Paid on: {new Date(order.paidAt).toLocaleString()}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant='h6' gutterBottom>
                Order Items
              </Typography>
              {order.orderItems && order.orderItems.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align='center'>Quantity</TableCell>
                        <TableCell align='center'>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.orderItems.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell component='th' scope='row'>
                            {item.name}
                          </TableCell>
                          <TableCell align='center'>{item.quantity}</TableCell>
                          <TableCell align='center'>
                            Rs {(item.quantity * item.unitPrice).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No items in this order</Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant='h6' gutterBottom>
                Order Summary
              </Typography>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography>Subtotal</Typography>
                <Typography>Rs {order.subTotal.toFixed(2)}</Typography>
              </Box>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography>Shipping Price</Typography>
                <Typography>Rs {order.shippingPrice.toFixed(2)}</Typography>
              </Box>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
              >
                <Typography variant='h6'>Total Price</Typography>
                <Typography variant='h6'>
                  Rs {order.totalPrice.toFixed(2)}
                </Typography>
              </Box>
            </Paper>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl}
                  alt='Order QR Code'
                  style={{ width: 128, height: 128 }}
                />
              )}
            </Box>

            <Box sx={{ mt: 3, display: 'none' }}>
              <div ref={invoiceRef}>
                <OrderInvoice order={order} />
              </div>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                onClick={handlePrint}
              >
                Print Invoice
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default OrderSummaryScreen;
