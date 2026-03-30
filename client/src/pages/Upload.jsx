import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload as UploadIcon, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useStore } from '../store/useStore';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [progressVal, setProgressVal] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const socket = useStore(state => state.socket);

  useEffect(() => {
    if (socket) {
      socket.on('analysis-progress', (data) => {
        setProgressMsg(data.message);
        setProgressVal(data.progress);
      });
    }
    return () => {
      if (socket) socket.off('analysis-progress');
    };
  }, [socket]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !jobDescription) return;

    setIsAnalyzing(true);
    setProgressMsg('Uploading...');
    setProgressVal(10);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const { data } = await axios.post('http://localhost:5001/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-socket-id': socket?.id,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate(`/report/${data.reportId}`);
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
      alert(error.response?.data?.error || 'Analysis failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 relative overflow-hidden"
      >
        <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Analyze Your Resume
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-2">1. Upload Resume</h3>
            <div 
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/10' : 'border-white/20 hover:border-white/40'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files[0])}
              />
              
              {file ? (
                <>
                  <FileText className="w-12 h-12 text-primary mb-4" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-white/50 mt-1">Click to change file</p>
                </>
              ) : (
                <>
                  <UploadIcon className="w-12 h-12 text-white/50 mb-4" />
                  <p className="font-medium">Drag & drop your resume here</p>
                  <p className="text-sm text-white/50 mt-1">Supports PDF & DOCX (Max 5MB)</p>
                </>
              )}
            </div>
          </div>

          {/* JD Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-2">2. Job Description</h3>
            <textarea
              className="input-field h-full min-h-[200px] resize-none"
              placeholder="Paste the target job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            disabled={!file || !jobDescription || isAnalyzing}
            onClick={handleSubmit}
            className="btn-primary w-full md:w-auto text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
          </button>
        </div>

        {/* Live Progress Overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark-bg/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-2xl"
            >
              <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
              <h3 className="text-2xl font-bold mb-4">{progressMsg}</h3>
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressVal}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="mt-4 text-white/60">{progressVal}% Complete</p>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
