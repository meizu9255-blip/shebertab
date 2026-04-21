import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import ServicesPage from './pages/ServicesPage';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import LocalServices from './pages/LocalServices';

function App() {
  return (
    <Routes>
      {/* Dashboard - standalone without Layout */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Local Services Landing Page */}
      <Route path="/local-services" element={<LocalServices />} />
      
      {/* Main site with Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="blog" element={<Blog />} />
        <Route path="contact" element={<Contact />} />
        <Route path="auth" element={<Auth />} />
        <Route path="auth/callback" element={<AuthCallback />} />
        <Route path="reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
