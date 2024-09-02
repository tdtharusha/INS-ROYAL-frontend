import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  useGetSuppliersQuery,
  useDeleteSupplierMutation,
} from '../../slices/supplier/supplierApiSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SupplierListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [paginationModel, setPaginationModel] = useState();
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  const [deleteSupplier] = useDeleteSupplierMutation();

  const {
    data: suppliersData,
    isLoading,
    isError,
    error,
  } = useGetSuppliersQuery();

  const suppliers = suppliersData
    ? suppliersData.map((supplier) => ({
        ...supplier,
        id: supplier._id,
      }))
    : [];

  const handleEdit = (id) => {
    navigate(`/suppliers/${id}/edit`);
  };

  const handleAddNew = () => {
    navigate('/registersupplier');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this Supplier?')) {
      try {
        await deleteSupplier(id).unwrap();
        toast.success('Supplier deleted successfully');
      } catch (err) {
        toast.error('Failed to delete the supplier', err);
      }
    }
  };

  const columns = [
    {
      field: 'supplierName',
      headerName: 'Suuplier Name',
      flex: 1,
      width: 200,
      sortable: true,
    },
    {
      field: 'supplierEmail',
      headerName: 'Email',
      flex: 1,
      width: 250,
      sortable: true,
    },
    {
      field: 'supplierAddress',
      headerName: 'Address',
      flex: 1,
      width: 150,
      sortable: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <strong>
          <Tooltip title='Edit'>
            <IconButton color='primary' onClick={() => handleEdit(params.id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton color='error' onClick={() => handleDelete(params.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </strong>
      ),
    },
  ];

  if (isLoading) return <Loader />;
  if (isError)
    return <Typography color='error'>Error loading suppliers</Typography>;

  return (
    <Box sx={{ height: '70vh', width: '100%', p: 2 }}>
      <Typography variant='h5'>Supplier List</Typography>
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
          onClick={handleAddNew}
        >
          Register New Supplier
        </Button>
      </Box>

      <Paper elevation={3} sx={{ height: '50vh', width: '100%' }}>
        <DataGrid
          rows={suppliers}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortingModel={sortModel}
          onSortingModelChange={setSortModel}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          autoPageSize
          {...suppliers}
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

export default SupplierListScreen;
