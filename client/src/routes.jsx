import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute, { PublicOnlyRoute } from './components/common/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SpecRecommenderPage from './pages/SpecRecommenderPage';
import NormativeGraphPage from './pages/NormativeGraphPage';
import QCOTrackerPage from './pages/QCOTrackerPage';
import TenderAuditorPage from './pages/TenderAuditorPage';
import ClauseStudioPage from './pages/ClauseStudioPage';
import SettingsPage from './pages/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Guest-only Auth Pages (Redirect to dashboard if already logged in) */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      {/* Protected Authenticated Workspace Pages (Strictly accessible by logged-in users only) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/spec-recommender" element={<SpecRecommenderPage />} />
        <Route path="/normative-graph" element={<NormativeGraphPage />} />
        <Route path="/qco-tracker" element={<QCOTrackerPage />} />
        <Route path="/tender-auditor" element={<TenderAuditorPage />} />
        <Route path="/clause-studio" element={<ClauseStudioPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}