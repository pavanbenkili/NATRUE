import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import type { CategoryId } from '../types';

const TIMES = ['07:00', '08:00', '09:00', '10:00', '12:00', '18:00', '20:00'];

const fieldSx = {
  bgcolor: '#fff',
  borderRadius: 2.5,
  '& .MuiFilledInput-root': {
    borderRadius: 2.5,
    bgcolor: '#fff',
    '&:before, &:after': { display: 'none' },
    '&:hover': { bgcolor: '#fff' },
    '&.Mui-focused': { bgcolor: '#fff' },
  },
  '& .MuiInputLabel-root': { color: 'text.secondary' },
  border: '1px solid rgba(31, 107, 69, 0.1)',
  overflow: 'hidden',
};

export default function Onboarding() {
  const { completeOnboarding, state } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [name, setName] = useState(state.profile.name || '');
  const [location, setLocation] = useState(state.profile.location || '');
  const [interests, setInterests] = useState<CategoryId[]>(state.profile.interests || []);
  const [notificationTime, setNotificationTime] = useState(
    state.profile.notificationTime || '09:00'
  );

  const goStep = (next: number) => {
    setStep(next);
    setAnimKey((k) => k + 1);
  };

  const toggleInterest = (id: CategoryId) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const finish = () => {
    completeOnboarding({
      name: name.trim() || 'Friend',
      location: location.trim() || 'Earth',
      interests,
      notificationTime,
    });
    navigate('/', { replace: true });
  };

  return (
    <div className="app-frame">
      <div className="phone-scroll screen-soft">
        <div
          className="screen-pad screen-narrow"
          style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}
        >
          {/* Progress */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={0.75} justifyContent="center" mb={1.5}>
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  className={`progress-dot ${step === i ? 'active' : ''}`}
                  sx={step > i ? { bgcolor: 'primary.light', width: 8 } : undefined}
                />
              ))}
            </Stack>
            <LinearProgress
              variant="determinate"
              value={((step + 1) / 3) * 100}
              sx={{
                height: 3,
                borderRadius: 2,
                bgcolor: 'rgba(31,107,69,0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'primary.light',
                  borderRadius: 2,
                  transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
                },
              }}
            />
          </Box>

          <Box key={animKey} className="step-enter" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {step === 0 && (
              <Stack spacing={3} sx={{ flex: 1, justifyContent: 'center', py: 3 }}>
                <Box className="float-soft" sx={{ textAlign: 'center' }}>
                  <Box
                    className="glow-pulse"
                    sx={{
                      width: 96,
                      height: 96,
                      borderRadius: '50%',
                      background: 'linear-gradient(145deg, #EAF3EC, #d8eadc)',
                      border: '1px solid rgba(31,107,69,0.12)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 44,
                      mb: 2.5,
                    }}
                  >
                    🍃
                  </Box>
                  <Typography variant="h3" color="primary.dark" sx={{ mb: 1 }}>
                    Nature Impact
                  </Typography>
                  <Typography
                    sx={{
                      color: 'primary.main',
                      fontSize: 17,
                      fontWeight: 600,
                      letterSpacing: 0.2,
                    }}
                  >
                    Small actions. Real impact.
                  </Typography>
                </Box>

                <Box className="soft-panel" sx={{ p: 2.5, textAlign: 'center' }}>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7, fontSize: 15 }}>
                    One simple environment-friendly action every day.
                    Build a streak. See your estimated impact grow.
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => goStep(1)}
                  sx={{ py: 1.6, mt: 'auto', fontSize: 16 }}
                >
                  Get Started
                </Button>
              </Stack>
            )}

            {step === 1 && (
              <Stack spacing={2.5} sx={{ py: 1, flex: 1 }}>
                <Box>
                  <Typography variant="h5" color="text.primary" gutterBottom>
                    About you
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A few details help personalise your daily tips.
                  </Typography>
                </Box>

                <TextField
                  label="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  variant="filled"
                  sx={fieldSx}
                />
                <TextField
                  label="Location / region"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  fullWidth
                  variant="filled"
                  placeholder="e.g. Bangalore"
                  sx={fieldSx}
                />
                <TextField
                  select
                  label="Preferred reminder time"
                  value={notificationTime}
                  onChange={(e) => setNotificationTime(e.target.value)}
                  fullWidth
                  variant="filled"
                  sx={fieldSx}
                >
                  {TIMES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>

                <Stack direction="row" spacing={1.5} sx={{ mt: 'auto', pt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => goStep(0)}
                    sx={{ flex: 1, borderColor: 'rgba(31,107,69,0.25)' }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => goStep(2)}
                    sx={{ flex: 2 }}
                  >
                    Continue
                  </Button>
                </Stack>
              </Stack>
            )}

            {step === 2 && (
              <Stack spacing={2.5} sx={{ py: 1, flex: 1 }}>
                <Box>
                  <Typography variant="h5" color="text.primary" gutterBottom>
                    What interests you?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pick a few — we'll tailor today's actions.
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {CATEGORIES.map((c) => {
                    const selected = interests.includes(c.id);
                    return (
                      <Chip
                        key={c.id}
                        label={c.name}
                        onClick={() => toggleInterest(c.id)}
                        sx={{
                          bgcolor: selected ? 'primary.main' : '#fff',
                          color: selected ? '#fff' : 'text.primary',
                          fontWeight: 600,
                          border: selected
                            ? '1px solid transparent'
                            : '1px solid rgba(31,107,69,0.12)',
                          transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
                          '&:hover': {
                            bgcolor: selected ? 'primary.dark' : 'var(--green-mist)',
                          },
                        }}
                      />
                    );
                  })}
                </Box>

                <Stack direction="row" spacing={1.5} sx={{ mt: 'auto', pt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => goStep(1)}
                    sx={{ flex: 1, borderColor: 'rgba(31,107,69,0.25)' }}
                  >
                    Back
                  </Button>
                  <Button variant="contained" onClick={finish} sx={{ flex: 2 }}>
                    Let's go
                  </Button>
                </Stack>
              </Stack>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}
