import { Add, Edit, Visibility } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';

export const CourseManagement = () => {
  return (
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
  );
};
