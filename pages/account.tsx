import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Box,
  Button,
  TextField,
  Divider,
  Alert,
} from '@mui/material';
import { ArrowBack, Edit, Save, Cancel } from '@mui/icons-material';

interface UserData {
  user_id: number;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role_id: number;
  role?: {
    role_id: number;
    role_name: string;
  };
}

export default function Account() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
  });
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setFormData({
        full_name: userData.full_name || '',
        email: userData.email || '',
      });
    } catch (error) {
      console.error('Failed to parse user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // TODO: Implement API call to update user data
    console.log('Saving user data:', formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
      });
    }
    setEditMode(false);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  const avatarUrl = user.avatar_url || '/default-avatar.png';

  return (
    <>
      <Head>
        <title>Account Settings - EduPlatform</title>
      </Head>

      <Container maxWidth="md" sx={{ py: 8 }}>
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button startIcon={<ArrowBack />} onClick={() => router.back()} variant="text">
            Back
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              alt={user.full_name || user.username}
              src={avatarUrl}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              imgProps={{
                onError: (e: any) => {
                  e.target.src = '/default-avatar.png';
                },
              }}
            />
            <Typography variant="h4" gutterBottom>
              {user.full_name || user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
            {user.role && (
              <Typography
                variant="caption"
                sx={{
                  display: 'inline-block',
                  mt: 1,
                  px: 2,
                  py: 0.5,
                  bgcolor: 'primary.light',
                  color: 'primary.dark',
                  borderRadius: 1,
                }}
              >
                {user.role.role_name}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Account Information */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h6">Account Information</Typography>
              {!editMode ? (
                <Button startIcon={<Edit />} variant="outlined" onClick={() => setEditMode(true)}>
                  Edit
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button startIcon={<Save />} variant="contained" onClick={handleSave}>
                    Save
                  </Button>
                  <Button startIcon={<Cancel />} variant="outlined" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  sx={{ flex: '1 1 45%' }}
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  variant="outlined"
                />
                <TextField
                  sx={{ flex: '1 1 45%' }}
                  label="Username"
                  value={user.username}
                  disabled={!editMode}
                  variant="outlined"
                  helperText="Username cannot be changed"
                />
              </Box>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
                variant="outlined"
                type="email"
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Additional Info */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Account Details
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 45%' }}>
                <Typography variant="body2" color="text.secondary">
                  User ID
                </Typography>
                <Typography variant="body1">{user.user_id}</Typography>
              </Box>
              <Box sx={{ flex: '1 1 45%' }}>
                <Typography variant="body2" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1">{user.role?.role_name || 'N/A'}</Typography>
              </Box>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mt: 3 }}>
            Need to change your password? Contact support or visit the security settings page.
          </Alert>
        </Paper>
      </Container>
    </>
  );
}
