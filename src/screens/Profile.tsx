import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATEGORY_MAP } from '../data/categories';
import { ACTIONS } from '../data/actions';

export default function Profile() {
  const { state, resetApp } = useApp();
  const { profile } = state;
  const navigate = useNavigate();

  return (
    <div className="screen-pad">
      <Typography
        variant="overline"
        sx={{ letterSpacing: 1.5, color: 'primary.main', fontWeight: 700 }}
      >
        Profile
      </Typography>

      <Box className="soft-panel" sx={{ borderRadius: 4, p: 3, mt: 1, mb: 2.5 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: '#fff',
            border: '1px solid rgba(31,107,69,0.12)',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            fontWeight: 700,
            mb: 1.5,
          }}
        >
          {profile.name.charAt(0).toUpperCase() || 'N'}
        </Box>
        <Typography variant="h5" color="primary.dark">
          {profile.name}
        </Typography>
        <Typography color="text.secondary">{profile.location}</Typography>
      </Box>

      <div className="grid-main">
      <Box sx={{ bgcolor: 'white', borderRadius: 3, p: 2 }}>
        <Typography fontWeight={700} mb={1}>
          Interests
        </Typography>
        {profile.interests.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No interests selected
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {profile.interests.map((id) => (
              <Chip
                key={id}
                label={CATEGORY_MAP[id].name}
                size="small"
                sx={{
                  bgcolor: `${CATEGORY_MAP[id].color}18`,
                  color: CATEGORY_MAP[id].color,
                  fontWeight: 600,
                }}
              />
            ))}
          </Box>
        )}
        <Divider sx={{ my: 2 }} />
        <Stack spacing={1}>
          <Row label="Reminder time" value={profile.notificationTime} />
          <Row label="Nature Points" value={String(state.naturePoints)} />
          <Row label="Current streak" value={`${state.streak} days`} />
          <Row label="Actions completed" value={String(state.completedActions.length)} />
          <Row label="Action library" value={`${ACTIONS.length} actions`} />
        </Stack>
      </Box>

      <Stack spacing={1.5}>
        <Box sx={{ bgcolor: 'white', borderRadius: 3, p: 2 }}>
          <Typography fontWeight={700} mb={1}>
            About Nature Impact
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            Don't ask people to completely change their lifestyle. Help them make
            one better choice today. Impact numbers are estimates — not exact
            scientific measurements.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate('/history')}
          sx={{ borderColor: 'rgba(31,107,69,0.25)' }}
        >
          Action history
        </Button>

        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={() => {
            if (confirm('Reset all progress and return to onboarding?')) {
              resetApp();
              window.location.href = '/onboarding';
            }
          }}
        >
          Reset app data
        </Button>
      </Stack>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700}>
        {value}
      </Typography>
    </Stack>
  );
}
