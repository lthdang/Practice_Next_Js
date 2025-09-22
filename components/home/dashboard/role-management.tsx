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
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Role } from '../../../types/role';
import { ApiResponse } from '../../../types/api';
import { AddRoleDialog } from './AddRoleDialog';
import { EditRoleDialog } from './EditRoleDialog';

interface Notification {
  message: string;
  severity: 'success' | 'error';
  details?: string[];
}

export const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/role');
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }

      const result: ApiResponse<Role[]> = await response.json();

      if (result.status === 'error') {
        throw new Error(result.message);
      }

      setRoles(result.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'role_name',
      headerName: 'Role Name',
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: GridRenderCellParams<Role>) => (
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
      renderCell: (params: GridRenderCellParams<Role>) => (
        <Box>
          <Tooltip title="Edit Role">
            <IconButton size="small" color="primary" onClick={() => handleEditClick(params.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.status ? 'Deactivate Role' : 'Role is already inactive'}>
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
    if (!selectedRole) {
      setNotification({
        message: 'No role selected for deletion',
        severity: 'error',
      });
      return;
    }

    try {
      const response = await fetch(`/api/role?role_id=${selectedRole.role_id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || result.status === 'error') {
        throw new Error(result.message || 'Failed to delete role');
      }

      await fetchRoles();
      setOpenDeleteDialog(false);
      setSelectedRole(null);
      setNotification({
        message: 'Role deleted successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error deleting role:', error);
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to delete role',
        severity: 'error',
        details: ['Please try again or contact support if the problem persists'],
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

        {error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={roles}
              columns={columns}
              getRowId={(row) => row.role_id}
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
