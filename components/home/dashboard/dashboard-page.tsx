import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { CardReport, RevenueChartCard, SalesLineCard } from '../card';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SalesLineCardData from '../card/sale-chart-1';
import RevenueChartCardData from '../card/revenue-chart';
import _ from 'lodash';
import { DashboardCard } from '../interface';

interface DashboardProps {
  dashboardCards: DashboardCard[];
}

export default function DashboardPage({ dashboardCards }: DashboardProps) {
  return (
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
  );
}
