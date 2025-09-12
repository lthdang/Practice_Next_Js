import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import React, { useState } from 'react';
import { MenuData } from '../interface';

interface LeftSidebarProps {
  menuItems: MenuData[];
  sidebarOpen: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
}
export const LeftSidebar = ({
  menuItems,
  sidebarOpen,
  activeSection,
  setActiveSection,
}: LeftSidebarProps) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>('administration');

  const handleExpandClick = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  return (
    <List sx={{ flexGrow: 1, py: 2 }}>
      {menuItems.map((item) => (
        <React.Fragment key={item.id}>
          <Tooltip title={!sidebarOpen ? item.name : ''} placement="right">
            <ListItem disablePadding>
              <ListItemButton
                onClick={() =>
                  item.children ? handleExpandClick(item.id) : setActiveSection(item.id)
                }
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
                selected={
                  item.children
                    ? item.children.some((child) => child.id === activeSection)
                    : activeSection === item.id
                }
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <Collapse in={sidebarOpen} orientation="horizontal">
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <ListItemText primary={item.name} sx={{ color: 'white' }} />
                    {item.children && (expandedMenu === item.id ? <ExpandLess /> : <ExpandMore />)}
                  </Box>
                </Collapse>
              </ListItemButton>
            </ListItem>
          </Tooltip>

          {/* Nested Menu Items */}
          {item.children && (
            <Collapse in={expandedMenu === item.id && sidebarOpen} timeout="auto">
              <List component="div" disablePadding>
                {item.children.map((child) => (
                  <Tooltip key={child.id} title={!sidebarOpen ? child.name : ''} placement="right">
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={activeSection === child.id}
                        onClick={() => setActiveSection(child.id)}
                        sx={{
                          pl: 4,
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
                        <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                          {child.icon}
                        </ListItemIcon>
                        <Collapse in={sidebarOpen} orientation="horizontal">
                          <ListItemText primary={child.name} sx={{ color: 'white' }} />
                        </Collapse>
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                ))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      ))}
    </List>
  );
};
