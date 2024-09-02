import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from '../../slices/product/productApiSlice';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Tooltip,
  IconButton,
  Rating,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const ProductsListScreen = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [deleteProduct] = useDeleteProductMutation();

  const [paginationModel, setPaginationModel] = useState();

  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useGetProductsQuery();

  const products = productsData
    ? productsData.map((product) => ({
        ...product,
        id: product._id,
        brandName: product.brand ? product.brand.name : 'N/A',
      }))
    : [];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this Product?'))
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted successfully');
        refetch();
      } catch (err) {
        toast.error('Failed to delete Product');
      }
  };

  const handleEdit = (id) => {
    navigate(`/product/${id}/edit`);
  };

  const handleCreateProduct = () => {
    navigate(`/product/createproduct`);
  };

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <Avatar
          alt={params.row.name}
          src={params.value}
          variant='square'
          sx={{ width: 50, height: 50 }}
        />
      ),
      hide: isSmallScreen,
    },
    { field: 'name', headerName: 'Product Name', flex: 1, Width: 100 },
    {
      field: 'brandName',
      headerName: 'Brand',
      flex: 1,
      Width: 100,
    },
    { field: 'category', headerName: 'Category', flex: 1, width: 150 },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      flex: 0.5,
      width: 50,
      valueFormatter: (unitPrice) => `Rs.${unitPrice}`,
    },
    {
      field: 'averageRating',
      headerName: 'Rating',
      flex: 0.8,
      width: 50,
      renderCell: (params) => (
        <Rating value={params.value} readOnly precision={0.5} size='small' />
      ),
      hide: isSmallScreen,
      //isMediumScreen,
    },

    {
      field: 'description',
      headerName: 'Description',
      flex: 1.5,
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value.slice(0, 50)}...</span>
        </Tooltip>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      width: 80,
      renderCell: (params) => (
        <Box>
          <Tooltip title='Edit'>
            <IconButton onClick={() => handleEdit(params.row.id)} size='small'>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton
              onClick={() => handleDelete(params.row.id)}
              size='small'
              color='error'
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (isLoading) return <Loader />;
  if (isError)
    return <Typography color='error'>Error loading products</Typography>;

  return (
    <Box sx={{ height: '70vh', width: '100%', p: 2 }}>
      <Typography variant='h5'>Product List</Typography>
      <br />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Button
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
          onClick={handleCreateProduct}
        >
          Register New Product
        </Button>
      </Box>

      <Paper elevation={3} sx={{ height: '60vh', width: '100%' }}>
        <DataGrid
          rows={products}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortingModel={sortModel}
          onSortingModelChange={setSortModel}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          autoPageSize
          {...products}
          checkboxSelection={!isSmallScreen}
          disableSelectionOnClick
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          sx={{
            '& .MuiDataGrid-toolbarContainer': {
              borderBottom: 'solid 1px rgba(224, 224, 224, 1)',
              p: 1,
            },
            '& .MuiDataGrid-cell': {
              borderBottom: 'solid 1px rgba(224, 224, 224, 0.8)',
            },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: 'solid 2px rgba(224, 224, 224, 1)',
              bgcolor: 'background.paper',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default ProductsListScreen;
