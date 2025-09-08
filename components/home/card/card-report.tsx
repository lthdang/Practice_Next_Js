import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import { DashboardCard } from '../interface/dashboard';

interface CardReportProps {
  data: DashboardCard;
}

export const CardReport = ({ data }: CardReportProps) => {
  return (
    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
      <Card
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 2,
          height: '100%',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Typography color="text.secondary" variant="body2">
              {data.title}
            </Typography>
            <Chip label={data.change} color={data.color} size="small" variant="outlined" />
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h4" fontWeight="bold">
              {data.value}
            </Typography>
            <Box color={`${data.color}.main`}>{data.icon}</Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};
