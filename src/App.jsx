import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { lazy, Suspense } from 'react';
import Navigation from './components/Navigation';

const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Home = lazy(() => import('../pages/Home'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const SuperAdminDashboard = lazy(() => import('../pages/SuperAdminDashboard'));
const UserFiles = lazy(() => import('../pages/UserFiles'));

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navigation />
      <div className={user ? "pt-16" : ""}>
        <Routes>
          {!user ? (
            <>
              <Route path="/" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Home />
                </Suspense>
              } />
              <Route path="/login" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Login />
                </Suspense>
              } />
              <Route path="/register" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Register />
                </Suspense>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Home />
                </Suspense>
              } />
              <Route path="/dashboard" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Dashboard />
                </Suspense>
              } />
              <Route path="/admin-dashboard" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <AdminDashboard />
                </Suspense>
              } />
              <Route path="/superadmin-dashboard" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <SuperAdminDashboard />
                </Suspense>
              } />
              <Route path="/user-files/:userId" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <UserFiles />
                </Suspense>
              } />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
