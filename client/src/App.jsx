import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useStore } from './store/useStore';

// Layout & Pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Results from './pages/Results';

function App() {
  const setSocket = useStore((state) => state.setSocket);
  const user = useStore((state) => state.user);

  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div className="min-h-screen bg-dark-bg text-white selection:bg-primary/50 relative overflow-hidden flex flex-col">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      
      <Navbar />
      
      <main className="flex-grow z-10 relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* Protected Routes placeholder */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/report/:id" element={<Results />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
