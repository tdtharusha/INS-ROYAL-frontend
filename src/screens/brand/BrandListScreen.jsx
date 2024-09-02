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
  useGetBrandsQuery,
  useDeleteBrandMutation,
} from '../../slices/brand/brandApiSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BrandListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [deleteBrand] = useDeleteBrandMutation();

  const [paginationModel, setPaginationModel] = useState();
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });

  const { data: brandsData, isLoading, isError } = useGetBrandsQuery();

  const brands = brandsData
    ? brandsData.map((brand) => ({
        ...brand,
        id: brand._id,
      }))
    : [];

  const handleEdit = (id) => {
    navigate(`/brands/${id}/edit`);
  };

  const handleAddNew = () => {
    navigate('/registerbrand');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this Brand?')) {
      try {
        await deleteBrand(id).unwrap();
        toast.success('Brand deleted successfully');
      } catch (err) {
        toast.error('Failed to delete the brand', err);
      }
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, Width: 100 },
    {
      field: 'productNames',
      headerName: 'Product Names',
      flex: 2,
      Width: 250,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      Width: 50,
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
    return <Typography color='error'>Error loading brands</Typography>;

  return (
    <Box sx={{ height: '70vh', width: '100%', p: 2 }}>
      <Typography variant='h5'>Brand List</Typography>
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
          Register New Brand
        </Button>
      </Box>

      <Paper elevation={3} sx={{ height: '50vh', width: '100%' }}>
        <DataGrid
          rows={brands}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          onPaginationModelChange={setPaginationModel}
          sortingModel={sortModel}
          onSortingModelChange={setSortModel}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          autoPageSize
          {...brands}
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

export default BrandListScreen;
