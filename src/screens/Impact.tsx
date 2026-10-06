import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MILESTONES, CATEGORY_MAP } from '../data/categories';
import { categoryContribution, computeImpactTotals, roundImpact } from '../utils/helpers';
import { genuinePeriodStats, rankSuffix, buildLeaderboard } from '../utils/leaderboard';

export default function Impact() {
  const { state } = useApp();
  const navigate = useNavigate();
  const totals = computeImpactTotals(state.completedActions);
  const categories = categoryContribution(state.completedActions);
  const totalActions = state.completedActions.length;
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

  const stats = [
    { label: 'CO₂e avoided', value: `${roundImpact(totals.co2e)} kg`, color: '#2E7D4F' },
    { label: 'Plastic avoided', value: `${Math.round(totals.plastic)} items`, color: '#00897B' },
    { label: 'Water saved', value: `${Math.round(totals.water)} L`, color: '#0288D1' },
    { label: 'Energy saved', value: `${roundImpact(totals.energy)} kWh`, color: '#F9A825' },
  ];

  return (
    <div className="screen-pad">
      <Typography
        variant="overline"
        sx={{ letterSpacing: 1.5, color: 'primary.main', fontWeight: 700 }}
      >
        My Impact
      </Typography>

      <Box
        className="soft-panel"
        sx={{ borderRadius: 4, p: 3, mt: 1, mb: 2, textAlign: 'center' }}
      >
        <Typography
          variant="overline"
          sx={{ letterSpacing: 1.2, color: 'primary.main', fontWeight: 700 }}
        >
          Nature Points
        </Typography>
        <Typography variant="h2" color="primary.dark" sx={{ my: 0.5 }}>
          {state.naturePoints}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 14 }}>
          Points motivate habits — not a scientific eco-score
        </Typography>
      </Box>

      <Box
        onClick={() => navigate('/ranks')}
        sx={{
          bgcolor: '#fff',
          borderRadius: 3,
          p: 2,
          mb: 2,
          border: '1px solid rgba(31,107,69,0.1)',
          cursor: 'pointer',
          transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)',
          '&:active': { transform: 'scale(0.98)' },
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
            }}
          >
            <EmojiEventsOutlinedIcon color="primary" />
          </Box>
          <Box flex={1}>
            <Typography fontWeight={700} fontSize={14}>
              Daily rank · {dailyRank}
              {rankSuffix(dailyRank)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {daily.points} pts today · Daily · Weekly · Monthly
            </Typography>
          </Box>
          <Typography color="primary.main" fontWeight={700} fontSize={13}>
            View
          </Typography>
        </Stack>
      </Box>

      <Box className="grid-stats" sx={{ mb: 2.5 }}>
        {stats.map((s) => (
          <Box key={s.label} className="stat-tile">
            <Typography variant="h6" sx={{ color: s.color }}>
              {s.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {s.label}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="caption" color="text.secondary" display="block" mb={2}>
        All figures are estimates based on typical impact factors.
      </Typography>

      <div className="grid-main">
      <Box sx={{ bgcolor: 'white', borderRadius: 3, p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography fontWeight={700}>Streaks</Typography>
          <LocalFireDepartmentIcon sx={{ color: '#EF6C00' }} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Box flex={1}>
            <Typography variant="h5" color="primary.main">
              {state.streak}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Current streak
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="h5" color="primary.main">
              {state.longestStreak}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Longest streak
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="h5" color="primary.main">
              {totalActions}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total actions
            </Typography>
          </Box>
        </Stack>
        {state.streakFreezeUsed && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Streak freeze used this cycle
          </Typography>
        )}
      </Box>

      {categories.length > 0 ? (
        <Box sx={{ bgcolor: 'white', borderRadius: 3, p: 2 }}>
          <Typography fontWeight={700} mb={1.5}>
            Category contribution
          </Typography>
          <Stack spacing={1.25}>
            {categories.slice(0, 6).map((c) => {
              const cat = CATEGORY_MAP[c.id];
              const pct = Math.round((c.count / totalActions) * 100);
              return (
                <Box key={c.id}>
                  <Stack direction="row" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" fontWeight={600}>
                      {cat.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {c.count} · {pct}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#E8F2EB',
                      '& .MuiLinearProgress-bar': { bgcolor: cat.color, borderRadius: 4 },
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        </Box>
      ) : null}
      </div>

      <Box sx={{ bgcolor: 'white', borderRadius: 3, p: 2, mb: 2, mt: 2 }}>
        <Typography fontWeight={700} mb={1.5}>
          Milestones
        </Typography>
        <Stack spacing={1.5}>
          {MILESTONES.map((m) => {
            const unlocked = totalActions >= m.threshold;
            return (
              <Stack
                key={m.id}
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ opacity: unlocked ? 1 : 0.45 }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: unlocked ? 'var(--green-mist)' : '#F0F0F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}
                >
                  {m.icon}
                </Box>
                <Box flex={1}>
                  <Typography fontWeight={700} fontSize={14}>
                    {m.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {m.description}
                  </Typography>
                </Box>
                {unlocked && (
                  <Typography variant="caption" fontWeight={700} color="primary.main">
                    Done
                  </Typography>
                )}
              </Stack>
            );
          })}
        </Stack>
      </Box>

      <Button
        variant="outlined"
        fullWidth
        startIcon={<HistoryOutlinedIcon />}
        onClick={() => navigate('/history')}
        sx={{ borderColor: 'rgba(31,107,69,0.25)', mb: 1 }}
      >
        View action history
      </Button>
    </div>
  );
}
