import { Box, Button, Stack, Typography } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CategoryChip, DifficultyChip } from '../components/Chips';
import { greeting } from '../utils/helpers';
import { buildLeaderboard, genuinePeriodStats, rankSuffix } from '../utils/leaderboard';

export default function Home() {
  const { state, todaysAction, completedToday, skipToday, completeAction } = useApp();
  const navigate = useNavigate();
  const skipped = state.skippedToday && !completedToday;

  const daily = genuinePeriodStats(state.completedActions, 'daily');
  const dailyRank =
    buildLeaderboard(
      {
        name: state.profile.name,
        location: state.profile.location,
        points: daily.points,
        actions: daily.actions,
      },
      'daily'
    ).find((e) => e.isYou)?.rank ?? 0;

  const handleDidIt = () => {
    const entry = completeAction(todaysAction);
    navigate('/complete', { state: { entry, actionId: todaysAction.id } });
  };

  return (
    <div className="screen-pad">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {greeting()}
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.25 }}>
            {state.profile.name || 'Friend'}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: '#FFF3E0',
            px: 1.5,
            py: 0.75,
            borderRadius: 999,
          }}
        >
          <LocalFireDepartmentIcon sx={{ color: '#EF6C00', fontSize: 20 }} />
          <Typography fontWeight={700} fontSize={14} color="#EF6C00">
            {state.streak}
          </Typography>
        </Box>
      </Stack>

      <Typography
        variant="overline"
        sx={{ letterSpacing: 1.5, color: 'primary.main', fontWeight: 700 }}
      >
        Today's Action
      </Typography>

      <div className="grid-main" style={{ marginTop: 12 }}>
        <div>
          {completedToday ? (
            <Box className="action-card" sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                You're done for today!
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Nice work. Come back tomorrow for a new small action —
                or explore more in the meantime.
              </Typography>
              <Stack
                spacing={1}
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="center"
              >
                <Button variant="contained" onClick={() => navigate('/impact')}>
                  See my impact
                </Button>
                <Button variant="text" onClick={() => navigate('/explore')}>
                  Explore more actions
                </Button>
              </Stack>
            </Box>
          ) : skipped ? (
            <Box className="action-card" sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                No worries — rest is fine
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                There's always tomorrow. Your streak freeze can help if you miss one day.
              </Typography>
              <Button variant="outlined" onClick={() => navigate('/explore')}>
                Browse actions anyway
              </Button>
            </Box>
          ) : (
            <Box className="action-card">
              <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" useFlexGap>
                <CategoryChip category={todaysAction.category} />
                <DifficultyChip difficulty={todaysAction.difficulty} />
              </Stack>

              <Typography variant="h5" sx={{ mb: 1.5, lineHeight: 1.3 }}>
                {todaysAction.title}
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                {todaysAction.description}
              </Typography>

              <Box
                sx={{
                  bgcolor: 'var(--green-mist)',
                  borderRadius: 3,
                  p: 2,
                  mb: 3,
                }}
              >
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Potential impact
                </Typography>
                <Typography fontWeight={700} color="primary.main">
                  ~{todaysAction.impactFactor} {todaysAction.impactUnit} ·{' '}
                  {todaysAction.impactLabel}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Estimate · {todaysAction.confidence} confidence
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleDidIt}
                sx={{ py: 1.75, fontSize: 16, mb: 1.5 }}
              >
                I Did It ✓
              </Button>

              <Button
                fullWidth
                color="inherit"
                onClick={skipToday}
                sx={{ color: 'text.secondary' }}
              >
                Not today
              </Button>
            </Box>
          )}
        </div>

        <Stack spacing={1.5}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              bgcolor: 'white',
              borderRadius: 3,
              p: 2,
              border: '1px solid rgba(31,107,69,0.06)',
            }}
          >
            <Box textAlign="center" flex={1}>
              <Typography variant="h6" color="primary.main">
                {state.naturePoints}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Points
              </Typography>
            </Box>
            <Box
              textAlign="center"
              flex={1}
              sx={{ borderLeft: '1px solid #E2EBE4', borderRight: '1px solid #E2EBE4' }}
            >
              <Typography variant="h6" color="primary.main">
                {state.completedActions.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Actions
              </Typography>
            </Box>
            <Box textAlign="center" flex={1}>
              <Typography variant="h6" color="primary.main">
                {state.longestStreak}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Best
              </Typography>
            </Box>
          </Box>

          <Box
            className="hide-phone"
            onClick={() => navigate('/ranks')}
            sx={{
              bgcolor: '#fff',
              borderRadius: 3,
              p: 2,
              border: '1px solid rgba(31,107,69,0.1)',
              cursor: 'pointer',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: 'var(--green-mist)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <EmojiEventsOutlinedIcon color="primary" />
              </Box>
              <Box flex={1} minWidth={0}>
                <Typography fontWeight={700} fontSize={14}>
                  Daily rank · {dailyRank}
                  {rankSuffix(dailyRank)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {daily.points} pts today · Open ranks
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box className="soft-panel hide-phone" sx={{ p: 2.5 }}>
            <Typography fontWeight={700} mb={0.5} color="primary.dark">
              One small action
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Tap once when you're done. Your estimated impact and streak update
              automatically — no guilt, just gentle progress.
            </Typography>
          </Box>
        </Stack>
      </div>
    </div>
  );
}
