import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { BOTTOM_TABS } from './SideNav';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const value = BOTTOM_TABS.findIndex((t) => t.path === location.pathname);

  return (
    <div className="bottom-nav-wrap">
      <Paper elevation={0} sx={{ flexShrink: 0, bgcolor: 'background.paper' }}>
        <BottomNavigation
          showLabels
          value={value === -1 ? 0 : value}
          onChange={(_, v) => navigate(BOTTOM_TABS[v].path)}
          sx={{
            '& .Mui-selected': { color: 'primary.main' },
            '& .MuiBottomNavigationAction-root': {
              minWidth: 0,
              px: 0.5,
              fontSize: 11,
            },
          }}
        >
          {BOTTOM_TABS.map((t) => {
            const Icon = t.icon;
            return (
              <BottomNavigationAction
                key={t.path}
                label={t.label}
                icon={<Icon />}
              />
            );
          })}
        </BottomNavigation>
      </Paper>
    </div>
  );
}
