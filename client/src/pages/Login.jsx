import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useStore } from '../store/useStore';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const setUser = useStore(state => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email: formData.email, password: formData.password } : formData;
      
      const { data } = await axios.post(`http://localhost:5001${endpoint}`, payload);
      
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="input-field"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            className="input-field"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            required
          />
          
          <button type="submit" disabled={loading} className="btn-primary mt-2 cursor-pointer">
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="text-center mt-6 text-white/50 text-sm">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-primary hover:text-accent transition-colors font-medium cursor-pointer"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
