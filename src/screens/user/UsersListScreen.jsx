import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from '../../slices/user/userApiSlice';
import { useDispatch, useSelector } from 'react-redux';
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
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const UsersListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { data: usersData, isLoading, isError, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const [paginationModel, setPaginationModel] = useState();

  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const users = usersData
    ? usersData.map((userInfo) => ({
        ...userInfo,
        id: userInfo._id,
        name: userInfo.name,
        email: userInfo.email,
      }))
    : [];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this user?'))
      try {
        await deleteUser(id).unwrap();
        toast.success('User deleted successfully');
        refetch();
      } catch (err) {
        toast.error('Failed to delete user');
      }
  };

  const handleEdit = (id) => {
    navigate(`/user/${id}/edit`);
  };

  const columns = [
    {
      field: 'name',
      headerName: 'User Name',
      flex: 1,
      Width: 150,
      sortable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      Width: 150,
      sortable: true,
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      Width: 150,
      sortable: true,
    },
    {
      field: 'isAdmin',
      headerName: 'Admin',
      flex: 1,
      renderCell: (params) => (params.value ? 'Yes' : 'No'),
      Width: 120,
      sortable: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      Width: 120,
      renderCell: (params) => (
        <Box>
          <Tooltip title='Edit'>
            <IconButton
              color='primary'
              onClick={() => handleEdit(params.row.id)}
              size='small'
            >
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
  if (isError) return <div>Error... Loading Users</div>;

  return (
    <Box sx={{ height: '70vh', width: '100%', p: 2 }}>
      <Typography variant='h5'>User List</Typography>
      <br />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      ></Box>
      <Paper eelevation={3} sx={{ height: '50vh', width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortingModel={sortModel}
          onSortingModelChange={setSortModel}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          autoPageSize
          {...users}
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

export default UsersListScreen;
