import React, { useState } from 'react';
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

interface AddRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddRoleDialog = ({ open, onClose, onSuccess }: AddRoleDialogProps) => {
  const [formData, setFormData] = useState({
    role_name: '',
    description: '',
    status: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Add new function to format role name
  const formatRoleName = (name: string): string => {
    // Split by spaces and filter out empty strings
    const words = name.split(/\s+/).filter((word) => word.length > 0);

    // Convert to uppercase and join with underscore
    const formattedName = words.join('_').toUpperCase();

    return formattedName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formattedData = {
        ...formData,
        role_name: formatRoleName(formData.role_name),
      };

      const response = await fetch('/api/role', {
        method: 'POST',
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
      setError(error instanceof Error ? error.message : 'Failed to create role');
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
        <DialogTitle>Add New Role</DialogTitle>
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
            Create Role
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
