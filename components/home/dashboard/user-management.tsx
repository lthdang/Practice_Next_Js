import { Add, Delete, Edit } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { UserData } from '../../../types/user';
import { AddUserDialog } from './AddUserDialog';
import { EditUserDialog } from './EditUserDialog';
import { ApiError, ApiResponse } from '../../../types/api';

interface Notification {
  message: string;
  severity: 'success' | 'error';
  details?: string[];
}

export const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/user');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const result: ApiResponse<UserData[]> = await response.json();

      if (result.status === 'error') {
        throw new Error(result.message);
      }

      setUsers(result.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddSuccess = () => {
    fetchUsers();
    setNotification({
      message: 'User created successfully',
      severity: 'success',
    });
  };

  const handleAddError = (error: ApiError) => {
    const details = error.errors?.map((err) => `${err.path[err.path.length - 1]}: ${err.message}`);

    setNotification({
      message: error.message,
      severity: 'error',
      details: details,
    });
  };

  const handleEditClick = (user: UserData) => {
    setSelectedUser(user);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (user: UserData) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async (deleteType: 'soft' | 'hard') => {
    if (!selectedUser) return;

    try {
      const response = await fetch('/api/user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: selectedUser.user_id,
          deleteType,
        }),
      });

      const result = await response.json();

      if (result.status === 'error') {
        throw new Error(result.message);
      }

      setNotification({
        message: deleteType === 'hard' ? 'User permanently deleted' : 'User disabled successfully',
        severity: 'success',
      });

      fetchUsers();
      setOpenDeleteDialog(false);
      setSelectedUser(null);
    } catch (error) {
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to process user deletion',
        severity: 'error',
      });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      valueGetter: (value, row) => {
        return row?.full_name || row?.username || '';
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      renderCell: (params) => {
        const row = params.row as UserData;
        return <Chip label={row.role.role_name} color="primary" size="small" variant="outlined" />;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: GridRenderCellParams<UserData>) => (
        <Tooltip title={params.row.status ? 'Active' : 'Inactive'}>
          <Chip
            label={params.row.status ? 'Active' : 'Inactive'}
            color={params.row.status ? 'success' : 'default'}
            size="small"
            sx={{
              '&.MuiChip-colorSuccess': {
                backgroundColor: 'success.light',
                color: 'success.dark',
              },
              '&.MuiChip-colorDefault': {
                backgroundColor: 'grey.200',
                color: 'grey.700',
              },
            }}
          />
        </Tooltip>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams<UserData>) => (
        <Box>
          <Tooltip title="Edit User">
            <IconButton size="small" color="primary" onClick={() => handleEditClick(params.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.status ? 'Deactivate User' : 'User is already inactive'}>
            <span>
              <IconButton size="small" color="error" onClick={() => handleDeleteClick(params.row)}>
                <Delete />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            User Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddDialog(true)}
            sx={{
              background: 'linear-gradient(45deg, #4f46e5 30%, #7c3aed 90%)',
            }}
          >
            Add New User
          </Button>
        </Box>

        {error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row.user_id}
              pagination
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              sx={{
                '& .MuiDataGrid-row': {
                  backgroundColor: (theme) => theme.palette.background.paper,
                  '&:nth-of-type(odd)': {
                    backgroundColor: (theme) => theme.palette.action.hover,
                  },
                },
              }}
              disableRowSelectionOnClick
              autoHeight
            />
          </Box>
        )}

        <AddUserDialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          onSuccess={handleAddSuccess}
          onError={handleAddError}
        />

        <EditUserDialog
          open={openEditDialog}
          user={selectedUser}
          onClose={() => setOpenEditDialog(false)}
          onSuccess={() => {
            fetchUsers();
            setNotification({
              message: 'User updated successfully',
              severity: 'success',
            });
          }}
          onError={(error) => {
            setNotification({
              message: error.message,
              severity: 'error',
              details: error.errors?.map(
                (err) => `${err.path[err.path.length - 1]}: ${err.message}`
              ),
            });
          }}
        />

        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>
              <Typography gutterBottom>
                What would you like to do with user "
                {selectedUser?.full_name || selectedUser?.username}"?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Disable user: User will be marked as inactive but data will be preserved
                <br />• Delete permanently: All user data will be permanently removed
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <LoadingButton
              onClick={() => handleDeleteConfirm('soft')}
              color="warning"
              variant="contained"
              sx={{ mr: 1 }}
            >
              Disable User
            </LoadingButton>
            <LoadingButton
              onClick={() => handleDeleteConfirm('hard')}
              color="error"
              variant="contained"
            >
              Delete Permanently
            </LoadingButton>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!notification}
          autoHideDuration={6000}
          onClose={() => setNotification(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {notification && (
            <Alert
              onClose={() => setNotification(null)}
              severity={notification.severity}
              sx={{ width: '100%', maxWidth: 400 }}
              elevation={6}
              variant="filled"
            >
              <Typography variant="subtitle2">{notification.message}</Typography>
              {notification.details && notification.details.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {notification.details.map((detail, index) => (
                    <Typography
                      key={index}
                      variant="caption"
                      component="div"
                      sx={{
                        mt: 0.5,
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      • {detail}
                    </Typography>
                  ))}
                </Box>
              )}
            </Alert>
          )}
        </Snackbar>
      </CardContent>
    </Card>
  );
};
