import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { AccountCircle, Logout, Person } from '@mui/icons-material';

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

export default function UserMenu() {
  const [user, setUser] = useState<UserData | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const open = Boolean(anchorEl);

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Close menu and redirect
    handleClose();
    router.push('/login');
  };

  const handleAccount = () => {
    handleClose();
    router.push('/account');
  };

  if (!user) {
    return null;
  }

  // Don't show for super_admin (role_id === 1)
  if (user.role_id === 1) {
    return null;
  }

  // Determine avatar URL
  const avatarUrl = user.avatar_url || '/default-avatar.png';
  const displayName = user.full_name || user.username;

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar
          alt={displayName}
          src={avatarUrl}
          sx={{ width: 40, height: 40 }}
          imgProps={{
            onError: (e: any) => {
              // Fallback to default avatar if image fails to load
              e.target.src = '/default-avatar.png';
            },
          }}
        />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="user-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            minWidth: 200,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar
              alt={displayName}
              src={avatarUrl}
              sx={{ width: 40, height: 40 }}
              imgProps={{
                onError: (e: any) => {
                  e.target.src = '/default-avatar.png';
                },
              }}
            />
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        <Divider />

        {/* Menu Items */}
        <MenuItem onClick={handleAccount}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Account</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>
            <span className="text-red-600">Logout</span>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
