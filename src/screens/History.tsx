import { useMemo, useState } from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { useApp } from '../context/AppContext';
import { CATEGORY_MAP } from '../data/categories';
import { formatDate } from '../utils/helpers';
import type { CategoryId } from '../types';

const FILTERS: Array<{ id: 'all' | CategoryId; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'transport', label: 'Transport' },
  { id: 'energy', label: 'Energy' },
  { id: 'water', label: 'Water' },
  { id: 'plastic', label: 'Plastic' },
  { id: 'food', label: 'Food' },
  { id: 'waste', label: 'Waste' },
  { id: 'nature', label: 'Nature' },
];

export default function History() {
  const { state } = useApp();
  const [filter, setFilter] = useState<'all' | CategoryId>('all');

  const items = useMemo(() => {
    if (filter === 'all') return state.completedActions;
    return state.completedActions.filter((c) => c.category === filter);
  }, [state.completedActions, filter]);

  return (
    <div className="screen-pad">
      <Typography
        variant="overline"
        sx={{ letterSpacing: 1.5, color: 'primary.main', fontWeight: 700 }}
      >
        My History
      </Typography>
      <Typography variant="h5" mb={2}>
        Previous activities
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1.5, mb: 1 }}>
        {FILTERS.map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            onClick={() => setFilter(f.id)}
            sx={{
              flexShrink: 0,
              bgcolor: filter === f.id ? 'primary.main' : 'white',
              color: filter === f.id ? 'white' : 'text.primary',
              fontWeight: 600,
            }}
          />
        ))}
      </Box>

      {items.length === 0 ? (
        <Box className="action-card" sx={{ textAlign: 'center', py: 5 }}>
          <Typography sx={{ fontSize: 40, mb: 1 }}>🌱</Typography>
          <Typography fontWeight={700} gutterBottom>
            No actions yet
          </Typography>
          <Typography color="text.secondary">
            Complete today's action and it will show up here.
          </Typography>
        </Box>
      ) : (
        <div className="grid-cards">
          {items.map((item) => {
            const cat = CATEGORY_MAP[item.category];
            return (
              <Box
                key={item.id}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 3,
                  p: 2,
                  display: 'flex',
                  gap: 1.5,
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    borderRadius: 2,
                    bgcolor: cat.color,
                    flexShrink: 0,
                  }}
                />
                <Box flex={1}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {formatDate(item.completedAt)} · {cat.name}
                  </Typography>
                  <Typography fontWeight={700} sx={{ my: 0.25 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="primary.main" fontWeight={600}>
                    ~{item.impactValue} {item.impactUnit}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Estimated · +{item.points} pts
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </div>
      )}
    </div>
  );
}
