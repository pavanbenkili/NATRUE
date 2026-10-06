import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { ACTIONS } from '../data/actions';
import { CATEGORIES, CATEGORY_MAP } from '../data/categories';
import { CategoryChip, DifficultyChip } from '../components/Chips';
import { useApp } from '../context/AppContext';
import type { Action, CategoryId } from '../types';

export default function Explore() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const { tryAction, completedToday, completeAction } = useApp();
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ACTIONS.filter((a) => {
      const catOk = category === 'all' || a.category === category;
      const qOk =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        CATEGORY_MAP[a.category].name.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [query, category]);

  const handleTry = (action: Action) => {
    if (completedToday) {
      const entry = completeAction(action);
      navigate('/complete', { state: { entry, actionId: action.id } });
      return;
    }
    tryAction(action);
    navigate('/');
  };

  return (
    <div className="screen-pad">
      <Typography
        variant="overline"
        sx={{ letterSpacing: 1.5, color: 'primary.main', fontWeight: 700 }}
      >
        Explore Actions
      </Typography>
      <Typography variant="h5" mb={2}>
        Action library
      </Typography>

      <TextField
        fullWidth
        size="small"
        placeholder="Search actions…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 1.5,
          bgcolor: 'white',
          borderRadius: 3,
          '& .MuiOutlinedInput-root': { borderRadius: 3 },
        }}
      />

      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1.5, mb: 1 }}>
        <Chip
          label="All"
          onClick={() => setCategory('all')}
          sx={{
            flexShrink: 0,
            bgcolor: category === 'all' ? 'primary.main' : 'white',
            color: category === 'all' ? 'white' : 'text.primary',
            fontWeight: 600,
          }}
        />
        {CATEGORIES.map((c) => (
          <Chip
            key={c.id}
            label={c.name}
            onClick={() => setCategory(c.id)}
            sx={{
              flexShrink: 0,
              bgcolor: category === c.id ? c.color : 'white',
              color: category === c.id ? 'white' : 'text.primary',
              fontWeight: 600,
            }}
          />
        ))}
      </Box>

      <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
        {filtered.length} actions
      </Typography>

      <div className="grid-cards">
        {filtered.map((a) => (
          <Box key={a.id} sx={{ bgcolor: 'white', borderRadius: 3, p: 2, height: '100%' }}>
            <Stack direction="row" spacing={1} mb={1} flexWrap="wrap" useFlexGap>
              <CategoryChip category={a.category} />
              <DifficultyChip difficulty={a.difficulty} />
            </Stack>
            <Typography fontWeight={700} mb={0.5}>
              {a.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              Potential impact: ~{a.impactFactor} {a.impactUnit}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleTry(a)}
              sx={{ borderRadius: 2 }}
            >
              Try this
            </Button>
          </Box>
        ))}
      </div>
    </div>
  );
}
