import { Outlet, Navigate, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import SideNav from './SideNav';
import { useApp } from '../context/AppContext';

export default function MobileLayout() {
  const { state } = useApp();
  const location = useLocation();

  if (!state.profile.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="app-frame">
      <SideNav />
      <div className="app-main">
        <div className="phone-scroll">
          <div key={location.pathname} className="page-enter">
            <Outlet />
          </div>
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
