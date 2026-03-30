const { Resume, Report } = require('../models');
const atsParser = require('../services/atsParser');
const fs = require('fs');

exports.uploadAndAnalyze = async (req, res) => {
  const io = req.app.get('io');
  const socketId = req.headers['x-socket-id'];
  
  const notify = (msg, progress) => {
    if (socketId && io) {
      io.to(socketId).emit('analysis-progress', { message: msg, progress });
    }
  };

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a resume file (PDF/DOCX).' });
    }
    
    const { jobDescription } = req.body;
    if (!jobDescription) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Job description is required.' });
    }

    notify('Extracting text from resume...', 20);
    
    let resumeText = '';
    try {
      resumeText = await atsParser.extractText(req.file.path);
    } catch (err) {
      console.error('Extraction Error:', err);
      try {
        fs.writeFileSync(req.file.path + '.err.txt', JSON.stringify({ message: err ? err.message : 'Unknown', stack: err ? err.stack : '', details: err })); 
      } catch(e) {}
      // fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Failed to extract text from file. Please try again so I can debug.' });
    }

    notify('Analyzing resume against job description...', 60);
    
    const analysisResult = atsParser.analyzeATS(resumeText, jobDescription);

    notify('Saving report...', 90);
    
    const newResume = await Resume.create({
      userId: req.user ? req.user.id : null, 
      filePath: req.file.path,
      extractedText: resumeText
    });

    const newReport = await Report.create({
      resumeId: newResume.id,
      score: analysisResult.score,
      matchedSkills: analysisResult.matchedSkills,
      missingSkills: analysisResult.missingSkills,
      suggestions: analysisResult.suggestions
    });

    notify('Analysis complete!', 100);

    res.json({
      message: 'Analysis successful',
      reportId: newReport.id
    });

  } catch (error) {
    console.error(error);
    notify('An error occurred during analysis.', 0);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Server error during analysis' });
  }
};
