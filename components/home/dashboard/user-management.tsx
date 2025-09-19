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
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
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

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch('/api/user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: selectedUser.user_id }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'error') {
        throw new Error(result.message);
      }

      setNotification({
        message: 'User deleted successfully',
        severity: 'success',
      });

      fetchUsers();
      setOpenDeleteDialog(false);
      setSelectedUser(null);
    } catch (error) {
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to delete user',
        severity: 'error',
      });
    }
  };

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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.user_id}
                    sx={{
                      backgroundColor: !user.status ? 'action.hover' : 'inherit',
                    }}
                  >
                    <TableCell>{user.full_name || user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role.role_name}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={user.status ? 'Active' : 'Inactive'}>
                        <Chip
                          label={user.status ? 'Active' : 'Inactive'}
                          color={user.status ? 'success' : 'default'}
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
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit User">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditClick(user)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.status ? 'Deactivate User' : 'User is already inactive'}>
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(user)}
                            disabled={!user.status}
                          >
                            <Delete />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No users found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
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

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            Are you sure you want to delete {selectedUser?.full_name || selectedUser?.username}?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <LoadingButton onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
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
