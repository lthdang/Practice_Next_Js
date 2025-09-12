import { Avatar, Box, Collapse, Typography } from '@mui/material';
import { RoleEnum } from '../../utils/enum/role_emun';
import { UserData } from './interface';

interface UserInfoProps {
  data: UserData;
  sidebarOpen: boolean;
}
export const UserInfo = ({ data, sidebarOpen }: UserInfoProps) => {
  return (
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
          {(data.full_name || data.username).charAt(0).toUpperCase()}
        </Avatar>
        <Collapse in={sidebarOpen} orientation="horizontal">
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {data.full_name || data.username}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {RoleEnum[data.role.role_name] || data.role.role_name}
            </Typography>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};
