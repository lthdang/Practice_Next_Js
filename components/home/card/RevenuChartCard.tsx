import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
} from '@mui/material';

// third-party
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ==============================|| REVENUE CHART CARD ||============================== //

interface RevenuChartCardProps {
  chartData?: object;
}

export const RevenueChartCard = ({ chartData }: RevenuChartCardProps) => {
  const theme = useTheme();

  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const matchDownXs = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} direction={matchDownMd && !matchDownXs ? 'row' : 'column'}>
          <Grid size={{ xs: 12, sm: 7, md: 12 }}>
            <Chart {...chartData} />
          </Grid>
          <Grid sx={{ display: { md: 'block', sm: 'none' } }}>
            <Divider />
          </Grid>
          <Grid
            size={{ xs: 12, sm: 5, md: 12 }}
            container
            direction={matchDownMd && !matchDownXs ? 'column' : 'row'}
            justifyContent="space-around"
            alignItems="center"
          >
            <Grid>
              <Grid container direction="column">
                <Typography variant="h6">Youtube</Typography>
                <Typography variant="subtitle1" sx={{ color: theme.palette.primary.main }}>
                  + 16.85%
                </Typography>
              </Grid>
            </Grid>
            <Grid>
              <Grid container direction="column">
                <Typography variant="h6">Facebook</Typography>
                <Box color={theme.palette.success.main}>
                  <Typography variant="subtitle1" color="inherit">
                    +45.36%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid>
              <Grid container direction="column">
                <Typography variant="h6">Twitter</Typography>
                <Typography variant="subtitle1" sx={{ color: theme.palette.warning.main }}>
                  - 50.69%
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
