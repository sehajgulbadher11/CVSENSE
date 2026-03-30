import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useStore } from './store/useStore';

// Layout & Pages
import Navbar from './components/Navbar';
import PageTransitionWrapper from './components/PageTransitionWrapper';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Results from './pages/Results';

function App() {
  const setSocket = useStore((state) => state.setSocket);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const location = useLocation();

  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token && !user) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await axios.get('http://localhost:5001/auth/me');
          setUser(data.user);
        } catch (error) {
          console.error("Auth session expired", error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
    };
    checkAuth();
  }, [setUser, user]);

  return (
    <div className="min-h-screen bg-dark-bg text-white selection:bg-primary/50 relative overflow-hidden flex flex-col">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      
      <Navbar />
      
      <main className="flex-grow z-10 relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransitionWrapper><Home /></PageTransitionWrapper>} />
            <Route path="/login" element={<PageTransitionWrapper><Login /></PageTransitionWrapper>} />
            {/* Protected Routes placeholder */}
            <Route path="/dashboard" element={<PageTransitionWrapper><Dashboard /></PageTransitionWrapper>} />
            <Route path="/upload" element={<PageTransitionWrapper><Upload /></PageTransitionWrapper>} />
            <Route path="/report/:id" element={<PageTransitionWrapper><Results /></PageTransitionWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
