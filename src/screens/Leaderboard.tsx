import { useMemo, useState } from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { useApp } from '../context/AppContext';
import {
  buildLeaderboard,
  genuinePeriodStats,
  periodLabel,
  rankSuffix,
  type LeaderboardPeriod,
  type RankedEntry,
} from '../utils/leaderboard';

const PERIODS: { id: LeaderboardPeriod; label: string }[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

const medalColor = (rank: number) => {
  if (rank === 1) return '#C9A227';
  if (rank === 2) return '#8A9499';
  if (rank === 3) return '#B87333';
  return null;
};

export default function Leaderboard() {
  const { state } = useApp();
  const [period, setPeriod] = useState<LeaderboardPeriod>('daily');

  const stats = useMemo(
    () => genuinePeriodStats(state.completedActions, period),
    [state.completedActions, period]
  );

  const board = useMemo(
    () =>
      buildLeaderboard(
        {
          name: state.profile.name,
          location: state.profile.location,
          points: stats.points,
          actions: stats.actions,
        },
        period
      ),
    [state.profile.name, state.profile.location, stats, period]
  );

  const you = board.find((e) => e.isYou)!;
  const top3 = board.slice(0, 3);

  return (
    <div className="screen-pad">
      <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
        <EmojiEventsOutlinedIcon sx={{ color: 'primary.main' }} />
        <Typography
          variant="overline"
          sx={{ letterSpacing: 1.5, color: 'primary.main', fontWeight: 700 }}
        >
          Leaderboard
        </Typography>
      </Stack>
      <Typography variant="h5" mb={0.5}>
        See your place
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Your rank uses only actions you actually logged — never boosted.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
        {PERIODS.map((p) => (
          <Chip
            key={p.id}
            label={p.label}
            onClick={() => setPeriod(p.id)}
            sx={{
              flex: 1,
              fontWeight: 700,
              bgcolor: period === p.id ? 'primary.main' : '#fff',
              color: period === p.id ? '#fff' : 'text.primary',
              border: period === p.id ? 'none' : '1px solid rgba(31,107,69,0.12)',
              transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
            }}
          />
        ))}
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        textAlign="center"
        mb={2}
      >
        {periodLabel(period)}
      </Typography>

      <div className="grid-rank">
      <div>
      {/* Your place highlight */}
      <Box className="soft-panel" sx={{ p: 2, mb: 2.5, textAlign: 'center' }}>
        <Typography variant="caption" color="primary.main" fontWeight={700}>
          YOUR PLACE
        </Typography>
        <Typography variant="h3" color="primary.dark" sx={{ my: 0.5 }}>
          {you.rank}
          <Typography component="span" variant="h5" color="text.secondary">
            {rankSuffix(you.rank)}
          </Typography>
        </Typography>
        <Typography fontWeight={700}>
          {stats.points} pts · {stats.actions} genuine action
          {stats.actions === 1 ? '' : 's'}
        </Typography>
        {stats.actions === 0 && (
          <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
            Complete today's action to climb the board
          </Typography>
        )}
      </Box>

      {/* Podium */}
      <Stack direction="row" alignItems="flex-end" spacing={1} mb={{ xs: 2.5, md: 0 }} px={0.5}>
        {[top3[1], top3[0], top3[2]].map((entry, i) => {
          if (!entry) return <Box key={i} flex={1} />;
          const heights = [72, 96, 60];
          const order = [2, 1, 3];
          return (
            <Box
              key={entry.id}
              flex={1}
              className="scale-in"
              sx={{
                textAlign: 'center',
                animationDelay: `${i * 0.08}s`,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: entry.isYou ? 'primary.main' : 'var(--green-mist)',
                  color: entry.isYou ? '#fff' : 'primary.dark',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 13,
                  mb: 0.75,
                  border: '1px solid rgba(31,107,69,0.12)',
                }}
              >
                {entry.name.charAt(0)}
              </Box>
              <Typography
                variant="caption"
                fontWeight={700}
                display="block"
                noWrap
                sx={{ px: 0.25 }}
              >
                {entry.isYou ? 'You' : entry.name.split(' ')[0]}
              </Typography>
              <Box
                sx={{
                  mt: 0.75,
                  height: heights[i],
                  borderRadius: '12px 12px 4px 4px',
                  bgcolor: entry.isYou ? 'primary.light' : '#fff',
                  border: '1px solid rgba(31,107,69,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: entry.isYou ? '#fff' : 'text.primary',
                }}
              >
                <Typography fontWeight={800} fontSize={16}>
                  #{order[i]}
                </Typography>
                <Typography variant="caption" fontWeight={600}>
                  {entry.points}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Stack>
      </div>

      {/* Full list */}
      <Stack spacing={1}>
        {board.map((entry, idx) => (
          <RankRow key={entry.id} entry={entry} delay={idx} />
        ))}
      </Stack>
      </div>

      <Box
        sx={{
          mt: 2.5,
          p: 2,
          borderRadius: 3,
          bgcolor: '#fff',
          border: '1px solid rgba(31,107,69,0.08)',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <VerifiedOutlinedIcon sx={{ color: 'primary.main', fontSize: 20, mt: 0.2 }} />
          <Box>
            <Typography fontWeight={700} fontSize={13} mb={0.5}>
              Genuine activity only
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
              Your score comes from actions you tap “I Did It” on. Demo community
              names are placeholders until live multiplayer accounts exist —
              we never fake your points.
            </Typography>
          </Box>
        </Stack>
      </Box>
    </div>
  );
}

function RankRow({ entry, delay }: { entry: RankedEntry; delay: number }) {
  const medal = medalColor(entry.rank);
  return (
    <Box
      className="stagger-1"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        borderRadius: 3,
        bgcolor: entry.isYou ? 'var(--green-mist)' : '#fff',
        border: entry.isYou
          ? '1.5px solid rgba(31,107,69,0.28)'
          : '1px solid rgba(31,107,69,0.06)',
        animationDelay: `${Math.min(delay, 8) * 0.04}s`,
      }}
    >
      <Box
        sx={{
          width: 28,
          textAlign: 'center',
          fontWeight: 800,
          fontSize: 14,
          color: medal || 'text.secondary',
        }}
      >
        {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
      </Box>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: entry.isYou ? 'primary.main' : '#F0F5F1',
          color: entry.isYou ? '#fff' : 'primary.dark',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {entry.name.charAt(0).toUpperCase()}
      </Box>
      <Box flex={1} minWidth={0}>
        <Typography fontWeight={700} noWrap fontSize={14}>
          {entry.isYou ? `${entry.name} (You)` : entry.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {entry.location}
          {entry.isDemo ? ' · community sample' : ' · verified log'}
        </Typography>
      </Box>
      <Box textAlign="right">
        <Typography fontWeight={800} color="primary.main" fontSize={15}>
          {entry.points}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {entry.actions} act.
        </Typography>
      </Box>
    </Box>
  );
}
