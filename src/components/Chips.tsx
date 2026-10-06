import type { CategoryId, Difficulty } from '../types';
import { CATEGORY_MAP } from '../data/categories';
import Chip from '@mui/material/Chip';

const difficultyColor: Record<Difficulty, 'success' | 'warning' | 'error'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
};

export function CategoryChip({ category }: { category: CategoryId }) {
  const c = CATEGORY_MAP[category];
  return (
    <Chip
      size="small"
      label={c.name}
      sx={{
        bgcolor: `${c.color}18`,
        color: c.color,
        fontWeight: 600,
        fontSize: 12,
      }}
    />
  );
}

export function DifficultyChip({ difficulty }: { difficulty: Difficulty }) {
  return (
    <Chip
      size="small"
      label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      color={difficultyColor[difficulty]}
      variant="outlined"
      sx={{ fontWeight: 600, fontSize: 12 }}
    />
  );
}
