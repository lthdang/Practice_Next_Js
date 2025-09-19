import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Role } from '../../../types/role';

interface EditRoleDialogProps {
  open: boolean;
  role: Role | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditRoleDialog = ({ open, role, onClose, onSuccess }: EditRoleDialogProps) => {
  const [formData, setFormData] = useState({
    role_name: '',
    description: '',
    status: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (role) {
      setFormData({
        role_name: role.role_name,
        description: role.description || '',
        status: role.status,
      });
    }
  }, [role]);

  const formatRoleName = (name: string): string => {
    const words = name.split(/\s+/).filter((word) => word.length > 0);
    return words.join('_').toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    setLoading(true);
    setError('');

    try {
      const formattedData = {
        ...formData,
        role_name: formatRoleName(formData.role_name),
        role_id: role.role_id,
      };

      const response = await fetch('/api/role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (result.status === 'error') {
        throw new Error(result.message);
      }

      onSuccess();
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update role');
      throw error; // Propagate error to parent
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      role_name: '',
      description: '',
      status: true,
    });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              autoFocus
              label="Role Name"
              fullWidth
              required
              value={formData.role_name}
              onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                />
              }
              label="Active"
            />
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
            Update Role
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
