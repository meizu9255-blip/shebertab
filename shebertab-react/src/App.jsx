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
import Messages from './pages/Messages';
import ResetPassword from './pages/ResetPassword';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
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
        <Route path="messages" element={<Messages />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
