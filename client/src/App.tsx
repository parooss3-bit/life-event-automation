import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ContactsPage from './pages/ContactsPage';
import EventsPage from './pages/EventsPage';
import GiftsPage from './pages/GiftsPage';
import SettingsPage from './pages/SettingsPage';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  const { isAuthenticated, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/contacts"
          element={
            <PrivateRoute>
              <Layout>
                <ContactsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <Layout>
                <EventsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/gifts"
          element={
            <PrivateRoute>
              <Layout>
                <GiftsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
