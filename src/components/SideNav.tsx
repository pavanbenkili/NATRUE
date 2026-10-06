import TodayIcon from '@mui/icons-material/WbSunnyOutlined';
import ImpactIcon from '@mui/icons-material/InsightsOutlined';
import RanksIcon from '@mui/icons-material/EmojiEventsOutlined';
import ExploreIcon from '@mui/icons-material/TravelExploreOutlined';
import ProfileIcon from '@mui/icons-material/PersonOutline';
import HistoryIcon from '@mui/icons-material/HistoryOutlined';
import { useLocation, useNavigate } from 'react-router-dom';

export const NAV_TABS = [
  { label: 'Today', path: '/', icon: TodayIcon },
  { label: 'Impact', path: '/impact', icon: ImpactIcon },
  { label: 'Ranks', path: '/ranks', icon: RanksIcon },
  { label: 'Explore', path: '/explore', icon: ExploreIcon },
  { label: 'History', path: '/history', icon: HistoryIcon },
  { label: 'Profile', path: '/profile', icon: ProfileIcon },
];

/** Bottom nav keeps 5 primary tabs; History lives in side nav + Impact */
export const BOTTOM_TABS = NAV_TABS.filter((t) => t.path !== '/history');

export default function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="side-nav">
      <div className="side-nav-brand">
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: 'linear-gradient(145deg, #EAF3EC, #d8eadc)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}
        >
          🍃
        </span>
        <div>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 15, color: '#154F32' }}>
            Nature Impact
          </div>
          <div style={{ fontSize: 11, color: '#5E6F64' }}>Small actions daily</div>
        </div>
      </div>

      {NAV_TABS.map((t) => {
        const Icon = t.icon;
        const active = location.pathname === t.path;
        return (
          <button
            key={t.path}
            type="button"
            className={`side-nav-item${active ? ' active' : ''}`}
            onClick={() => navigate(t.path)}
          >
            <Icon sx={{ fontSize: 22 }} />
            {t.label}
          </button>
        );
      })}
    </aside>
  );
}
