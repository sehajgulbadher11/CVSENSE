import { useStore } from '../store/useStore';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useStore();
  const location = useLocation();
  
  return (
    <nav className="p-4 bg-black/30 backdrop-blur-md border-b border-white/10 flex justify-between items-center z-50">
      <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">CVSense</Link>
      <div className="flex gap-4">
        {user ? (
          <>
            <Link to="/dashboard" className="px-4 py-2 hover:text-primary transition-colors">Dashboard</Link>
            <button onClick={logout} className="px-4 py-2 hover:text-red-400 transition-colors">Logout</button>
          </>
        ) : (
          location.pathname !== '/login' && <Link to="/login" className="btn-primary px-4 py-2 text-sm">Login</Link>
        )}
      </div>
    </nav>
  );
}
