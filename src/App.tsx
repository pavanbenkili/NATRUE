import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppProvider, useApp } from './context/AppContext';
import { theme } from './theme';
import MobileLayout from './components/MobileLayout';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Completion from './screens/Completion';
import Impact from './screens/Impact';
import History from './screens/History';
import Explore from './screens/Explore';
import Profile from './screens/Profile';
import Leaderboard from './screens/Leaderboard';

function OnboardingGate() {
  const { state } = useApp();
  if (state.profile.onboardingComplete) {
    return <Navigate to="/" replace />;
  }
  return <Onboarding />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Routes>
              <Route path="/onboarding" element={<OnboardingGate />} />
              <Route path="/complete" element={<Completion />} />
              <Route element={<MobileLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/impact" element={<Impact />} />
                <Route path="/ranks" element={<Leaderboard />} />
                <Route path="/history" element={<History />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}
