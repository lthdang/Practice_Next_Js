import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RoleEnum } from '../../utils/enum/role_emun';
import SalesLineCardData from './card/sale-chart-1';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
// MUI Imports
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
} from '@mui/material';

// MUI Icons
import {
  AccountCircle,
  Add,
  Analytics,
  ChevronLeft,
  ChevronRight,
  Construction,
  Dashboard,
  Delete,
  Edit,
  Logout,
  Notifications,
  People,
  School,
  Settings,
  TrendingUp,
  Visibility,
} from '@mui/icons-material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
// MUI Theme
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DashboardCard } from './interface/dashboard';
import { CardReport } from './card/card-report';
import _ from 'lodash';
import { SalesLineCard } from './card/SalesLineCard';
import { RevenueChartCard } from './card/RevenuChartCard';
import RevenueChartCardData from './card/revenue-chart';
import { styled } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5', // Indigo
      light: '#7c3aed', // Purple
    },
    secondary: {
      main: '#10b981', // Green
    },
    background: {
      default: '#f8fafc',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: 'white',
        },
      },
    },
  },
});

const drawerWidth = 280;
const collapsedDrawerWidth = 64;

export const Content = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role_id !== 1) {
      router.push('/customer');
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (loading || !user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress color="primary" />
          <Typography variant="h6" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      </Box>
    );
  }

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <Dashboard /> },
    { id: 'users', name: 'Manage Users', icon: <People /> },
    { id: 'courses', name: 'Manage Courses', icon: <School /> },
    { id: 'analytics', name: 'Analytics', icon: <Analytics /> },
    { id: 'settings', name: 'Settings', icon: <Settings /> },
  ];

  const dashboardCards: DashboardCard[] = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      color: 'success',
      icon: <People />,
    },
    {
      title: 'Total Courses',
      value: '89',
      change: '+5%',
      color: 'primary',
      icon: <School />,
    },
    {
      title: 'Active Enrollments',
      value: '456',
      change: '+8%',
      color: 'warning',
      icon: <TrendingUp />,
    },
    {
      title: 'Revenue',
      value: '$12,345',
      change: '+15%',
      color: 'secondary',
      icon: <Analytics />,
    },
  ];

  const currentDrawerWidth = sidebarOpen ? drawerWidth : collapsedDrawerWidth;

  const FlatCardBlock = styled((props) => <Grid size={{ sm: 6, xs: 12 }} {...props} />)(
    ({ theme }) => ({
      padding: '25px 25px',
      borderLeft: '1px solid' + theme.palette.background.default,
      [theme.breakpoints.down('sm')]: {
        borderLeft: 'none',
        borderBottom: '1px solid' + theme.palette.background.default,
      },
      [theme.breakpoints.down('md')]: {
        borderBottom: '1px solid' + theme.palette.background.default,
      },
    })
  );

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Admin Dashboard - Language Learning Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${currentDrawerWidth}px)` },
            ml: { md: `${currentDrawerWidth}px` },
            bgcolor: 'white',
            color: 'text.primary',
            boxShadow: 1,
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
                {sidebarOpen ? <MenuOpenIcon /> : <MenuOpenIcon />}
              </IconButton>
            )}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                {menuItems.find((item) => item.id === activeSection)?.name || 'Dashboard'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome back, {user.full_name || user.username}!
              </Typography>
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
        </AppBar>

        {/* Sidebar */}
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? sidebarOpen : true}
          onClose={handleDrawerToggle}
          sx={{
            width: currentDrawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: currentDrawerWidth,
              boxSizing: 'border-box',
              transition: 'width 0.3s ease',
            },
          }}
        >
          {/* Sidebar Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Collapse in={sidebarOpen} orientation="horizontal">
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h4">🎓</Typography>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    EduAdmin
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Learning Platform
                  </Typography>
                </Box>
              </Box>
            </Collapse>

            {!isMobile && (
              <IconButton onClick={handleDrawerToggle} sx={{ color: 'white', ml: 'auto' }}>
                {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
              </IconButton>
            )}
          </Box>

          {/* Navigation */}
          <List sx={{ flexGrow: 1, py: 2 }}>
            {menuItems.map((item) => (
              <Tooltip key={item.id} title={!sidebarOpen ? item.name : ''} placement="right">
                <ListItem disablePadding>
                  <ListItemButton
                    selected={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    sx={{
                      mx: 1,
                      my: 0.5,
                      borderRadius: 2,
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                        },
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <Collapse in={sidebarOpen} orientation="horizontal">
                      <ListItemText primary={item.name} sx={{ ml: 1, color: 'white' }} />
                    </Collapse>
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ))}
          </List>

          {/* User Info */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  width: 40,
                  height: 40,
                }}
              >
                {(user.full_name || user.username).charAt(0).toUpperCase()}
              </Avatar>
              <Collapse in={sidebarOpen} orientation="horizontal">
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {user.full_name || user.username}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {RoleEnum[user.role.role_name] || user.role.role_name}
                  </Typography>
                </Box>
              </Collapse>
            </Box>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${currentDrawerWidth}px)` },
            bgcolor: 'background.default',
            minHeight: '100vh',
          }}
        >
          <Toolbar />

          {/* Dashboard Content */}
          {activeSection === 'dashboard' && (
            <Box>
              {/* Stats Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {_.map(dashboardCards, (card, index) => (
                  <CardReport data={card} key={index} />
                ))}
              </Grid>

              {/* Charts Section */}
              <Grid container spacing={3} sx={{ mb: 4, height: '100%' }} alignItems="stretch">
                {/* Sales Line Chart */}
                <Grid size={{ xs: 12, lg: 6 }} display="flex">
                  <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        User Growth
                      </Typography>
                      <SalesLineCard
                        chartData={SalesLineCardData}
                        title="Sales Per Day"
                        percentage="3%"
                        icon={<TrendingDownIcon />}
                        footerData={[
                          {
                            value: '$4230',
                            label: 'Total Revenue',
                          },
                          {
                            value: '321',
                            label: 'Today Sales',
                          },
                        ]}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }} display="flex">
                  <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        Course Enrollments
                      </Typography>
                      <RevenueChartCard chartData={RevenueChartCardData} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Recent Activity */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Activity
                    </Typography>
                    <List>
                      {[
                        {
                          icon: '👤',
                          text: 'New user registered: john.doe@example.com',
                          time: '2 hours ago',
                        },
                        {
                          icon: '📚',
                          text: 'New course created: Advanced JavaScript',
                          time: '5 hours ago',
                        },
                        {
                          icon: '💰',
                          text: 'Payment received: $99.99',
                          time: '1 day ago',
                        },
                      ].map((activity, index) => (
                        <ListItem key={index} divider={index < 2} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <Avatar sx={{ width: 40, height: 40 }}>{activity.icon}</Avatar>
                          </ListItemIcon>
                          <ListItemText primary={activity.text} secondary={activity.time} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Box>
          )}

          {/* Users Management */}
          {activeSection === 'users' && (
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h5" fontWeight="bold">
                    User Management
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{
                      background: 'linear-gradient(45deg, #4f46e5 30%, #7c3aed 90%)',
                    }}
                  >
                    Add New User
                  </Button>
                </Box>

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
                      <TableRow>
                        <TableCell>John Doe</TableCell>
                        <TableCell>john@example.com</TableCell>
                        <TableCell>
                          <Chip label="Student" color="primary" size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label="Active" color="success" size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Course Management */}
          {activeSection === 'courses' && (
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h5" fontWeight="bold">
                    Course Management
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{
                      background: 'linear-gradient(45deg, #4f46e5 30%, #7c3aed 90%)',
                    }}
                  >
                    Create Course
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Card
                      sx={{
                        textAlign: 'center',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h2" sx={{ mb: 2 }}>
                          📚
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                          JavaScript Fundamentals
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          89 enrolled students
                        </Typography>
                        <Box mt={2} display="flex" gap={1} justifyContent="center">
                          <Button size="small" startIcon={<Edit />}>
                            Edit
                          </Button>
                          <Button size="small" startIcon={<Visibility />}>
                            View
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Placeholder sections */}
          {['analytics', 'settings'].includes(activeSection) && (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <Construction sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {menuItems.find((item) => item.id === activeSection)?.name}
                </Typography>
                <Typography color="text.secondary" variant="body1">
                  This section is under development...
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};
