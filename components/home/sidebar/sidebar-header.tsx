import { Box, Collapse, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface SidebarHeaderProps {
  handleDrawerToggle: () => void;
  sidebarOpen: boolean;
}

export const SidebarHeader = ({ handleDrawerToggle, sidebarOpen }: SidebarHeaderProps) => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  return (
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
  );
};
