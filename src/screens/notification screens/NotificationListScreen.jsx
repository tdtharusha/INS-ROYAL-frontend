import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} from '../../slices/notificationSlices/notificationApiSlice';
import {
  setNotifications,
  markAsRead,
  removeNotification,
} from '../../slices/notificationSlices/notificationSlice';
import Loader from '../../components/Loader';

const NotificationListScreen = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const {
    data: notificationData,
    isLoading,
    isError,
    error,
  } = useGetNotificationsQuery();
  const [markAsReadMutation] = useMarkNotificationAsReadMutation();
  const [deleteNotificationMutation] = useDeleteNotificationMutation();

  const notifications = useSelector((state) => state.notification);

  const [paginationModel, setPaginationModel] = useState();

  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  const notificationsData = notificationData
    ? notificationData.map((notification) => ({
        ...notification,
        id: notification._id,
      }))
    : [];

  useEffect(() => {
    if (notificationsData) {
      dispatch(setNotifications(notificationsData.notifications));
    }
  }, [notificationsData, dispatch]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsReadMutation(id).unwrap();
      dispatch(markAsRead(id));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotificationMutation(id).unwrap();
      dispatch(removeNotification(id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const columns = [
    // {
    //   field: '_id',
    //   headerName: 'ID',
    //   flex: 1,
    //   Width: 150,
    //   sortable: true,
    // },
    {
      field: 'user',
      headerName: 'User',
      flex: 1,
      Width: 150,
      sortable: true,
      renderCell: (params) => params.user,
    },
    {
      field: 'emailType',
      headerName: 'Email Type',
      flex: 1,
      Width: 150,
      sortable: true,
    },
    {
      field: 'sendingStatus',
      headerName: 'Sending Status',
      flex: 1,
      Width: 150,
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
              onClick={() => handleDelete(params.row.id)}
              size='small'
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Mark as Read'>
            <IconButton
              onClick={() => handleMarkAsRead(params.row.id)}
              size='small'
              color='primary'
            >
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (isLoading) return <Loader />;
  if (isError) return <Typography>Error: {error.message}</Typography>;

  return (
    <Box sx={{ height: '70vh', width: '100%', p: 2 }}>
      <Typography variant='h5'>Notification List</Typography>
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
          rows={notificationsData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortingModel={sortModel}
          onSortingModelChange={setSortModel}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          autoPageSize
          {...notificationsData}
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

export default NotificationListScreen;
