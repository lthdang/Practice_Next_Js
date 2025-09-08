import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Card, CardContent, Grid, Typography, useMediaQuery } from '@mui/material';

// third-party
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ==============================|| SALES LINE CARD ||============================== //

interface SalesLineCardProps {
  bgColor?: string;
  chartData?: object;
  footerData?: { label: string; value: string }[];
  icon?: React.ReactNode;
  title?: string;
  percentage?: string;
}

export const SalesLineCard = ({
  bgColor,
  chartData,
  footerData,
  icon,
  title,
  percentage,
}: SalesLineCardProps) => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const matchDownXs = useMediaQuery(theme.breakpoints.down('sm'));
  const chartKey = matchDownXs ? 'xs' : matchDownMd ? 'md' : 'lg';
  let footerHtml;

  if (footerData) {
    footerHtml = footerData.map((item, index) => {
      return (
        <Grid key={index}>
          <Box mt={3} mb={3} p={1}>
            <Grid container direction="column" spacing={1} alignItems="center">
              <Typography variant="h4">{item.value}</Typography>
              <Typography variant="subtitle2" color="secondary">
                {item.label}
              </Typography>
            </Grid>
          </Box>
        </Grid>
      );
    });
  }

  return (
    <Card>
      <CardContent sx={{ padding: 0, paddingBottom: '0 !important' }}>
        <Box bgcolor={bgColor ? bgColor : theme.palette.primary.main} p={3}>
          <Grid container direction={matchDownMd && !matchDownXs ? 'row' : 'column'} spacing={1}>
            <Grid container justifyContent="space-between" alignItems="center">
              {title && (
                <Grid>
                  <Typography variant="subtitle1" color="#fff">
                    {title}
                  </Typography>
                </Grid>
              )}
              <Grid>
                <Grid container alignItems="center">
                  {icon && (
                    <Box component="span" mr={2} color="#fff">
                      {icon}
                    </Box>
                  )}
                  {percentage && (
                    <Typography variant="subtitle1" color="#fff">
                      {percentage}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
            {chartData && (
              <Grid size={{ xs: 12, sm: 7, md: 12 }}>
                <Chart key={chartKey} {...chartData} width="100%" />
              </Grid>
            )}
          </Grid>
        </Box>
        {footerData && (
          <Grid container justifyContent="space-around" alignItems="center">
            {footerHtml}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};
