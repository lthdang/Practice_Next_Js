import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
// MUI Imports
import {
  AppBar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  CssBaseline,
  Drawer,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

// MUI Icons
import {
  Analytics,
  Construction,
  Dashboard,
  People,
  School,
  Settings,
  TrendingUp,
  Group,
  AdminPanelSettings,
} from '@mui/icons-material';
// MUI Theme
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DashboardCard, MenuData, UserData } from './interface';
import _ from 'lodash';
import { AppBarContent } from './app-bar-content';
import { SidebarHeader } from './sidebar/sidebar-header';
import { UserInfo } from './user-info';
import { LeftSidebar } from './sidebar';
import DashboardPage from './dashboard/dashboard-page';
import { UserManagement, CourseManagement, RoleManagement } from './dashboard';

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
  const [user, setUser] = useState<UserData | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

    try {
      const parsedUser = JSON.parse(userData) as UserData;
      // Validate required fields
      if (!parsedUser.user_id || !parsedUser.role_id || !parsedUser.role) {
        console.error('Invalid user data structure');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      // Check for admin role (role_id === 1)
      if (parsedUser.role_id !== 1) {
        router.push('/customer');
        return;
      }

      setUser(parsedUser);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      router.push('/login');
    }
  }, [router]);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
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

  const menuItems: MenuData[] = [
    { id: 'dashboard', name: 'Dashboard', icon: <Dashboard /> },
    {
      id: 'administration',
      name: 'Administration',
      icon: <AdminPanelSettings />,
      children: [
        { id: 'users', name: 'User Management', icon: <Group /> },
        { id: 'roles', name: 'Role Management', icon: <People /> },
      ],
    },
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
          <AppBarContent
            data={menuItems}
            user={user}
            activeSection={activeSection}
            handleDrawerToggle={handleDrawerToggle}
            sidebarOpen={sidebarOpen}
          />
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
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
            },
          }}
        >
          {/* Sidebar Header */}
          <SidebarHeader handleDrawerToggle={handleDrawerToggle} sidebarOpen={sidebarOpen} />
          {/* Navigation */}
          <LeftSidebar
            menuItems={menuItems}
            sidebarOpen={sidebarOpen}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
          {/* User Info */}
          <UserInfo data={user} sidebarOpen={sidebarOpen} />
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
          {activeSection === 'dashboard' && <DashboardPage dashboardCards={dashboardCards} />}
          {/* Users Management */}
          {activeSection === 'users' && <UserManagement />}
          {/* Role Management */}
          {activeSection === 'roles' && <RoleManagement />}
          {/* Course Management */}
          {activeSection === 'courses' && <CourseManagement />}

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
