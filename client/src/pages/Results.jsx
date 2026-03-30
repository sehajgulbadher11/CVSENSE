import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Download, ChevronLeft, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Results() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5001/api/reports/${id}`);
        setReport(data);
      } catch (error) {
        console.error("Failed to fetch report", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return <div className="min-h-[80vh] flex items-center justify-center text-xl animate-pulse">Loading Report...</div>;
  }

  if (!report) {
    return <div className="text-center mt-20 text-red-400">Report not found</div>;
  }

  const chartData = [
    { name: 'Matched', value: report.score, color: '#06B6D4' },
    { name: 'Missing', value: 100 - report.score, color: '#334155' }
  ];

  const downloadPDF = () => {
    window.print(); // Simple PDF export for now
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl print:bg-white print:text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 print:hidden">
        <Link to="/upload" className="flex items-center text-white/60 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Upload
        </Link>
        <button onClick={downloadPDF} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          Export as PDF
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 gap-8"
      >
        {/* Score Section */}
        <div className="glass-card p-8 flex flex-col items-center justify-center text-center print:border-none print:shadow-none print:bg-transparent">
          <h2 className="text-2xl font-semibold mb-6">ATS Compatibility Score</h2>
          
          <div className="h-64 w-full relative -mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Score Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-6">
              <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                {report.score}%
              </span>
              <span className="text-sm text-white/50 print:text-black/50 tracking-wider uppercase mt-1">Match</span>
            </div>
          </div>
          
          <p className="mt-4 text-white/80 print:text-black/80 max-w-sm">
            Based on the job description, your resume has a <span className="font-bold text-accent">{report.score}%</span> match rate.
          </p>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div className="glass-card p-6 print:border-gray-200 print:shadow-none print:bg-transparent">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              Matched Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {report.matchedSkills.length > 0 ? (
                report.matchedSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-accent/20 border border-accent/40 text-accent rounded-full text-sm">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-white/40 italic">No exact skill matches found.</span>
              )}
            </div>
          </div>

          <div className="glass-card p-6 print:border-gray-200 print:shadow-none print:bg-transparent">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-400" />
              Missing Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {report.missingSkills.length > 0 ? (
                report.missingSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-sm">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-white/40 italic">All skills matched! Excellent job.</span>
              )}
            </div>
          </div>
          
          <div className="glass-card p-6 border-l-4 border-l-primary print:border-l-primary print:border-gray-200 print:shadow-none print:bg-transparent">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-primary" />
              Improvement Suggestions
            </h3>
            <p className="text-white/80 print:text-black/80 leading-relaxed text-sm">
              {report.suggestions}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
