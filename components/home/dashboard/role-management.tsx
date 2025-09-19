import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { AddRoleDialog } from './AddRoleDialog';
import { EditRoleDialog } from './EditRoleDialog';
import { Role } from '../../../types/role';
import _ from 'lodash';

interface ApiResponse {
  status: 'success' | 'error';
  message: string;
  data?: Role[];
}

interface Notification {
  message: string;
  severity: 'success' | 'error';
}

export const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<Notification | null>(null);

  // Get list of roles from API role endpoint
  // Example: GET /api/role
  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/role');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result: ApiResponse = await response.json();

      setRoles(result.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Call fetchRoles when component mounts
  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddSuccess = () => {
    fetchRoles();
    setNotification({
      message: 'Role created successfully',
      severity: 'success',
    });
  };

  const handleEditSuccess = () => {
    fetchRoles();
    setNotification({
      message: 'Role updated successfully',
      severity: 'success',
    });
  };

  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (role: Role) => {
    setSelectedRole(role);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRole) return;

    try {
      const response = await fetch('/api/role', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role_id: selectedRole.role_id }),
      });

      const result = await response.json();

      if (result.status === 'error') {
        throw new Error(result.message);
      }

      fetchRoles();
      setOpenDeleteDialog(false);
      setNotification({
        message: 'Role deleted successfully',
        severity: 'success',
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete role');
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to delete role',
        severity: 'error',
      });
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Role Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddDialog(true)}
            sx={{
              background: 'linear-gradient(45deg, #4f46e5 30%, #7c3aed 90%)',
            }}
          >
            Add New Role
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.role_id}>
                  <TableCell>{role.role_name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={role.status ? 'Active' : 'Inactive'}
                      color={role.status ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary" onClick={() => handleEditClick(role)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(role)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <AddRoleDialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          onSuccess={handleAddSuccess}
        />

        <EditRoleDialog
          open={openEditDialog}
          role={selectedRole}
          onClose={() => setOpenEditDialog(false)}
          onSuccess={handleEditSuccess}
        />

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Delete Role</DialogTitle>
          <DialogContent>
            Are you sure you want to delete the role "{selectedRole?.role_name}"?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!notification}
          autoHideDuration={3000}
          onClose={() => setNotification(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {notification && (
            <Alert
              onClose={() => setNotification(null)}
              severity={notification.severity}
              sx={{ width: '100%' }}
              elevation={6}
              variant="filled"
            >
              {notification.message}
            </Alert>
          )}
        </Snackbar>
      </CardContent>
    </Card>
  );
};
