import { NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import logo from './octofitapp-small.png';
import './App.css';

const navigationItems = [
  { path: '/', label: 'Users', element: <Users /> },
  { path: '/teams', label: 'Teams', element: <Teams /> },
  { path: '/activities', label: 'Activities', element: <Activities /> },
  { path: '/workouts', label: 'Workouts', element: <Workouts /> },
  { path: '/leaderboard', label: 'Leaderboard', element: <Leaderboard /> },
];

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <img src={logo} alt="OctoFit Tracker logo" className="app-logo" />
        <div>
          <p className="app-eyebrow">OctoFit Tracker</p>
          <h1 className="app-title">Frontend Dashboard</h1>
          <p className="app-subtitle">
            React routes are wired to the Django REST API for users, teams,
            activities, workouts, and leaderboard data.
          </p>
        </div>
      </header>

      <nav className="app-nav" aria-label="Main navigation">
        {navigationItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              isActive ? 'app-nav-link active' : 'app-nav-link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="app-content">
        <Routes>
          {navigationItems.map(item => (
            <Route key={item.path} path={item.path} element={item.element} />
          ))}
        </Routes>
      </main>
    </div>
  );
}

export default App;
