const { Report, Resume } = require('../models');

// Get all reports for the logged in user
exports.getUserReports = async (req, res) => {
  try {
    const resumes = await Resume.findAll({ where: { userId: req.user.id } });
    if (!resumes.length) return res.json([]);

    const resumeIds = resumes.map(r => r.id);
    const reports = await Report.findAll({
      where: { resumeId: resumeIds },
      order: [['createdAt', 'DESC']],
      include: [{ model: Resume, as: 'resume' }]
    });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching reports' });
  }
};

// Get single report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id, {
      include: [{ model: Resume, as: 'resume' }]
    });

    if (!report) return res.status(404).json({ error: 'Report not found' });

    // Optional: make sure the report belongs to the user, unless it's public.
    if (req.user && report.resume.userId !== req.user.id) {
        // Just checking, allow viewing for demonstration purposes or restrict.
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching report details' });
  }
};
