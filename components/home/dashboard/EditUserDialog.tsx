import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ApiError } from '../../../types/api';
import { UserData } from '../../../types/user';
import { Role } from '../../../types/role';

interface EditUserDialogProps {
  open: boolean;
  user: UserData | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
}

interface EditUserFormData {
  username: string;
  email: string;
  full_name?: string;
  role_id: number;
}

export const EditUserDialog = ({
  open,
  user,
  onClose,
  onSuccess,
  onError,
}: EditUserDialogProps) => {
  const [formData, setFormData] = useState<EditUserFormData>({
    username: '',
    email: '',
    full_name: '',
    role_id: 0,
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchRoles();
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        full_name: user.full_name || '',
        role_id: user.role_id,
      });
    }
  }, [user]);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/role');
      const result = await response.json();
      if (result.status === 'success') {
        const activeRoles = result.data.filter((role: Role) => role.status === true);
        setRoles(activeRoles);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.user_id,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'error') {
        if (result.error?.errors) {
          const apiFieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err: any) => {
            const fieldName = err.path[err.path.length - 1];
            apiFieldErrors[fieldName] = err.message;
          });
          setFieldErrors(apiFieldErrors);
          throw result.error;
        } else {
          throw new Error(result.message);
        }
      }

      onSuccess();
      handleClose();
    } catch (error) {
      if ('errors' in error) {
        onError(error as ApiError);
      } else {
        onError({
          message: error instanceof Error ? error.message : 'Failed to update user',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      username: '',
      email: '',
      full_name: '',
      role_id: 0,
    });
    setError('');
    setFieldErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              label="Username"
              fullWidth
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              sx={{ mb: 2 }}
              error={!!fieldErrors.username}
              helperText={fieldErrors.username}
            />
            <TextField
              label="Full Name"
              fullWidth
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ mb: 2 }}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
            />
            <FormControl fullWidth required error={!!fieldErrors.role_id} sx={{ mb: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role_id}
                onChange={(e) => setFormData({ ...formData, role_id: Number(e.target.value) })}
                label="Role"
              >
                {roles.map((role) => (
                  <MenuItem key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.role_id && <FormHelperText error>{fieldErrors.role_id}</FormHelperText>}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            sx={{
              background: 'linear-gradient(45deg, #4f46e5 30%, #7c3aed 90%)',
            }}
          >
            Update User
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
