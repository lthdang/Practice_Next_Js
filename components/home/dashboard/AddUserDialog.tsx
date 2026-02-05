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
import { Role } from '../../../types/role';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import { ApiError } from '../../../types/api';

interface ValidationError {
  origin: string;
  code: string;
  format?: string;
  pattern?: string;
  path: string[];
  message: string;
}

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
}

interface UserFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  full_name?: string;
  role_id: number;
}

export const AddUserDialog = ({ open, onClose, onSuccess, onError }: AddUserDialogProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role_id: 0,
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Add state for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/role');
      const result = await response.json();
      if (result.status === 'success') {
        // Filter to only include active roles
        const activeRoles = result.data.filter((role: Role) => role.status === true);
        setRoles(activeRoles);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else {
      // Add client-side password validation
      if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      if (!/[A-Z]/.test(formData.password)) {
        errors.password = 'Password must contain at least one uppercase letter';
      }
      if (!/[a-z]/.test(formData.password)) {
        errors.password = 'Password must contain at least one lowercase letter';
      }
      if (!/[0-9]/.test(formData.password)) {
        errors.password = 'Password must contain at least one number';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role_id) {
      errors.role_id = 'Role is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...submitData } = formData;
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.status === 'error') {
        // Handle API validation errors
        if (result.error?.errors) {
          const apiFieldErrors: Record<string, string> = {};

          result.error.errors.forEach((err: ValidationError) => {
            // Get the field name from the path array
            const fieldName = err.path[err.path.length - 1];

            // Format the error message based on error type
            let errorMessage = err.message;
            if (err.code === 'invalid_format' && err.pattern) {
              // Add pattern information for format errors if needed
              errorMessage = `${err.message} (Pattern: ${err.pattern})`;
            }

            apiFieldErrors[fieldName] = errorMessage;
          });

          setFieldErrors(apiFieldErrors);

          // Set general error message with count
          const errorCount = Object.keys(apiFieldErrors).length;
          setError(`${errorCount} validation error${errorCount > 1 ? 's' : ''} found`);

          // Throw formatted error for notification
          throw {
            message: 'Validation failed',
            errors: result.error.errors,
          };
        } else {
          setError(result.error?.message || 'Failed to create user');
          throw result.error || new Error(result.message);
        }
      }

      onSuccess();
      handleClose();
    } catch (error) {
      if ('errors' in error) {
        onError(error as ApiError);
      } else {
        onError({
          message: error instanceof Error ? error.message : 'Failed to create user',
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
      password: '',
      confirmPassword: '',
      full_name: '',
      role_id: 0,
    });
    setError('');
    onClose();
  };

  // Add toggle handlers
  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleToggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  '& .MuiAlert-message': {
                    width: '100%',
                  },
                }}
              >
                <Stack spacing={1} width="100%">
                  <Typography variant="subtitle2" fontWeight="bold">
                    {error}
                  </Typography>
                  {Object.keys(fieldErrors).length > 0 && (
                    <Box sx={{ pl: 2 }}>
                      {Object.entries(fieldErrors).map(([field, message]) => (
                        <Typography
                          key={field}
                          variant="caption"
                          color="error.light"
                          component="div"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            '&:before': {
                              content: '"•"',
                              marginRight: 1,
                            },
                          }}
                        >
                          {field.charAt(0).toUpperCase() + field.slice(1)}: {message}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Stack>
              </Alert>
            )}
            <TextField
              error={!!fieldErrors.username}
              helperText={
                fieldErrors.username && (
                  <Typography variant="caption" color="error">
                    {fieldErrors.username}
                  </Typography>
                )
              }
              autoFocus
              label="Username"
              fullWidth
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              sx={{ mb: 2 }}
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
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              sx={{ mb: 2 }}
              error={!!fieldErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={
                <Stack spacing={0.5}>
                  {fieldErrors.password && (
                    <Typography variant="caption" color="error">
                      {fieldErrors.password}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Password must contain:
                    <br />
                    • At least 8 characters
                    <br />
                    • One uppercase letter
                    <br />
                    • One lowercase letter
                    <br />• One number
                  </Typography>
                </Stack>
              }
            />
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              sx={{ mb: 2 }}
              error={!!fieldErrors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={fieldErrors.confirmPassword}
            />
            <FormControl fullWidth required error={!!fieldErrors.role_id} sx={{ mb: 2 }}>
              <InputLabel error={!!fieldErrors.role_id}>Role</InputLabel>
              <Select
                value={formData.role_id}
                onChange={(e) => setFormData({ ...formData, role_id: Number(e.target.value) })}
                label="Role"
                error={!!fieldErrors.role_id}
              >
                {roles.length === 0 ? (
                  <MenuItem disabled>No active roles available</MenuItem>
                ) : (
                  roles.map((role) => (
                    <MenuItem key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {fieldErrors.role_id && <FormHelperText error>{fieldErrors.role_id}</FormHelperText>}
              {roles.length === 0 && (
                <FormHelperText>
                  No active roles are available. Please create an active role first.
                </FormHelperText>
              )}
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
            Create User
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
