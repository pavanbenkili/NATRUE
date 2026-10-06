import { Box, Button, Stack, Typography } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarsIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { CompletedAction } from '../types';
import { ACTIONS_MAP } from '../data/actions';

interface CompleteState {
  entry?: CompletedAction;
  actionId?: string;
}

export default function Completion() {
  const { state } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const locState = location.state as CompleteState | null;

  const entry = locState?.entry ?? state.completedActions[0];
  const action =
    (locState?.actionId && ACTIONS_MAP[locState.actionId]) ||
    (entry && ACTIONS_MAP[entry.actionId]) ||
    null;

  if (!entry || !action) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app-frame">
      <div className="phone-scroll screen-soft-celebrate">
        <div
          className="screen-pad screen-narrow fade-in"
          style={{
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box textAlign="center" mb={3} className="scale-in">
            <Box
              className="glow-pulse"
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'var(--green-mist)',
                border: '1px solid rgba(31,107,69,0.12)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <CheckCircleRoundedIcon sx={{ fontSize: 44, color: 'primary.main' }} />
            </Box>
            <Typography variant="h3" color="primary.dark" sx={{ mb: 1 }}>
              Nice!
            </Typography>
            <Typography color="text.secondary" sx={{ px: 1, lineHeight: 1.5 }}>
              You completed: <strong style={{ color: 'var(--ink)' }}>{action.title}</strong>
            </Typography>
          </Box>

          <Box className="soft-panel stagger-1" sx={{ p: 3, mb: 2, textAlign: 'center' }}>
            <Typography
              variant="overline"
              sx={{ letterSpacing: 1.2, color: 'primary.main', fontWeight: 700 }}
            >
              Estimated impact
            </Typography>
            <Typography variant="h4" color="primary.dark" sx={{ my: 1 }}>
              ~{entry.impactValue} {entry.impactUnit}
            </Typography>
            <Typography color="text.secondary" fontSize={14}>
              {entry.impactLabel}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} mb={3.5} className="stagger-2">
            <Box
              sx={{
                flex: 1,
                bgcolor: '#fff',
                borderRadius: 3,
                p: 2,
                textAlign: 'center',
                border: '1px solid rgba(31,107,69,0.08)',
              }}
            >
              <StarsIcon sx={{ mb: 0.5, color: 'primary.main', fontSize: 22 }} />
              <Typography fontWeight={700} color="text.primary">
                +{entry.points}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Nature Points
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                bgcolor: '#fff',
                borderRadius: 3,
                p: 2,
                textAlign: 'center',
                border: '1px solid rgba(31,107,69,0.08)',
              }}
            >
              <LocalFireDepartmentIcon sx={{ mb: 0.5, color: '#E67E22', fontSize: 22 }} />
              <Typography fontWeight={700} color="text.primary">
                {state.streak} day
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Streak
              </Typography>
            </Box>
          </Stack>

          <Button
            className="stagger-3"
            variant="contained"
            size="large"
            fullWidth
            onClick={() => navigate('/', { replace: true })}
            sx={{ py: 1.75, fontSize: 16 }}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
