import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileBarChart, PlusCircle, ArrowRight, User } from 'lucide-react';
import axios from 'axios';
import { useStore } from '../store/useStore';

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useStore(state => state.user);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/reports', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setReports(data);
      } catch (error) {
        console.error('Failed to fetch reports', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const totalScans = reports.length;
  const avgScore = totalScans ? Math.round(reports.reduce((acc, r) => acc + r.score, 0) / totalScans) : 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
            Welcome, {user?.name || 'User'}
          </h1>
          <p className="text-white/60">Manage your resume analysis reports here.</p>
        </div>
        <Link to="/upload" className="btn-primary">
          <PlusCircle className="w-5 h-5" />
          New Analysis
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 animate-pulse text-white/50">Fetching your data...</div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-card p-6 flex flex-col justify-center">
              <h3 className="text-white/60 mb-1 text-sm font-medium uppercase tracking-wider">Total Resumes Scanned</h3>
              <p className="text-4xl font-bold text-white">{totalScans}</p>
            </div>
            
            <div className="glass-card p-6 flex flex-col justify-center">
              <h3 className="text-white/60 mb-1 text-sm font-medium uppercase tracking-wider">Average Match Score</h3>
              <div className="flex items-end gap-2">
                <p className={`text-4xl font-bold ${avgScore > 75 ? 'text-green-400' : avgScore > 50 ? 'text-accent' : 'text-red-400'}`}>
                  {avgScore}%
                </p>
                <span className="text-white/40 pb-1 text-sm">Aggregate</span>
              </div>
            </div>
          </div>

          {/* Recent Reports List */}
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-primary" />
            Recent Reports
          </h2>

          {reports.length === 0 ? (
            <div className="glass-card p-12 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <FileBarChart className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Reports Yet</h3>
              <p className="text-white/50 mb-6 max-w-md mx-auto">
                Upload your first resume and job description to get a detailed ATS compatibility analysis.
              </p>
              <Link to="/upload" className="text-primary hover:text-accent font-medium inline-flex items-center transition-colors">
                Start Your First Analysis <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={report.id}
                >
                  <Link to={`/report/${report.id}`} className="block glass-card p-6 hover:border-primary/50 transition-colors group cursor-pointer h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="text-sm text-white/50 mb-1">{new Date(report.createdAt).toLocaleDateString()}</p>
                        <h4 className="font-medium truncate pr-4 text-white group-hover:text-primary transition-colors">
                          Report #{report.id}
                        </h4>
                      </div>
                      <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                        report.score >= 80 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                        report.score >= 50 ? 'bg-accent/20 text-accent border border-accent/30' : 
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {report.score}
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="flex justify-between text-xs text-white/40 mb-2">
                        <span>Matched: {report.matchedSkills?.length || 0}</span>
                        <span>Missing: {report.missingSkills?.length || 0}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${report.score >= 80 ? 'bg-green-400' : report.score >= 50 ? 'bg-accent' : 'bg-red-400'}`}
                          style={{ width: `${report.score}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
