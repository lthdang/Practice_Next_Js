import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import { AccountCircle, Logout, Notifications } from '@mui/icons-material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useState } from 'react';
import { MenuData, UserData } from './interface';
import { useRouter } from 'next/router';

interface AppBarContentProps {
  data: MenuData[];
  user: UserData;
  activeSection: string;
  handleDrawerToggle: () => void;
  sidebarOpen: boolean;
}

export const AppBarContent = ({
  data,
  user,
  activeSection,
  handleDrawerToggle,
  sidebarOpen,
}: AppBarContentProps) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const router = useRouter();
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };
  return (
    <Toolbar>
      {isMobile && (
        <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
          {sidebarOpen ? <MenuOpenIcon /> : <MenuOpenIcon />}
        </IconButton>
      )}
      <Box sx={{ flexGrow: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          {/* Breadcrumb navigation */}
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            {(() => {
              const parentItem = data.find((item) =>
                item.children?.some((child) => child.id === activeSection)
              );
              if (parentItem) {
                return (
                  <>{parentItem.children?.find((child) => child.id === activeSection)?.name}</>
                );
              }
              return data.find((item) => item.id === activeSection)?.name || 'Dashboard';
            })()}
          </Typography>
        </Stack>
        {!isMobile && (
          <Typography variant="body2" color="text.secondary">
            Welcome back, {user.full_name || user.username}!
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <Avatar
            alt={user.full_name || user.username}
            src={user.avatar_url || '/default-avatar.png'}
            sx={{ width: 40, height: 40 }}
          >
            {(user.full_name || user.username).charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <AccountCircle sx={{ mr: 1 }} />
            Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Toolbar>
  );
};
