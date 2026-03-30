const fs = require('fs');
const mammoth = require('mammoth');
const SKILLS_DB = require('../data/skills');

// Extract text from file
exports.extractText = async (filePath) => {
  const extension = filePath.split('.').pop().toLowerCase();

  if (extension === 'pdf') {
    return new Promise((resolve, reject) => {
      const PDFParser = require('pdf2json');
      const pdfParser = new PDFParser(this, 1);
      pdfParser.on('pdfParser_dataError', errData => reject(errData.parserError));
      pdfParser.on('pdfParser_dataReady', () => {
        resolve(pdfParser.getRawTextContent().replace(/\r?\n/g, ' '));
      });
      pdfParser.loadPDF(filePath);
    });
  } else if (extension === 'docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else {
    throw new Error('Unsupported file type');
  }
};

// Clean text and extract true skills
const extractSkills = (text) => {
  const cleanText = ' ' + text.toLowerCase().replace(/[^a-z0-9+#]/g, ' ') + ' ';
  
  const extracted = SKILLS_DB.filter(skill => {
    const cleanSkill = skill.toLowerCase().replace(/[^a-z0-9+#]/g, ' ');
    return cleanText.includes(` ${cleanSkill} `);
  });
  
  return [...new Set(extracted)];
};

// Calculate ATS score
exports.analyzeATS = (resumeText, jdText) => {
  const resumeKeywords = extractSkills(resumeText);
  const jdKeywords = extractSkills(jdText);

  // If JD is too short, avoid divide by zero
  if (jdKeywords.length === 0) {
    return { score: 0, matchedSkills: [], missingSkills: jdKeywords, suggestions: 'Job description is too short or empty.' };
  }

  const matchedSkills = jdKeywords.filter(kw => resumeKeywords.includes(kw));
  const missingSkills = jdKeywords.filter(kw => !resumeKeywords.includes(kw));

  const score = Math.round((matchedSkills.length / jdKeywords.length) * 100);

  let suggestions = '';
  if (score < 50) {
    suggestions = 'Your resume is missing many key terms from the job description. Consider adding the missing skills and tailoring your experience.';
  } else if (score < 80) {
    suggestions = 'Good match, but you can improve by including more specific keywords listed in the missing skills section.';
  } else {
    suggestions = 'Excellent match! Your resume is well-tailored for this position.';
  }

  return {
    score,
    matchedSkills,
    missingSkills,
    suggestions
  };
};
