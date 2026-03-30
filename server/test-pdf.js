const fs = require('fs');
const PDFDocument = require('pdfkit');
const pdfParse = require('pdf-parse');

async function run() {
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream('test.pdf');
  doc.pipe(writeStream);
  doc.fontSize(25).text('Hello World!', 100, 100);
  doc.end();

  await new Promise(r => writeStream.on('finish', r));

  console.log('--- Testing pdf-parse ---');
  try {
    const dataBuffer = fs.readFileSync('test.pdf');
    const data = await pdfParse(dataBuffer);
    console.log('Result:', data.text.trim());
  } catch (err) {
    console.error('pdf-parse error:', err);
  }

  console.log('\n--- Testing pdf2json ---');
  try {
    const text = await new Promise((resolve, reject) => {
      const PDFParser = require('pdf2json');
      const pdfParser = new PDFParser(this, 1);
      pdfParser.on('pdfParser_dataError', errData => reject(errData.parserError));
      pdfParser.on('pdfParser_dataReady', () => {
        try {
          resolve(pdfParser.getRawTextContent().replace(/\\r\\n/g, ' '));
        } catch (e) {
          reject(e);
        }
      });
      pdfParser.loadPDF('test.pdf');
    });
    console.log('Result:', text);
  } catch (err) {
    console.error('pdf2json error:', err);
  }
}

run();
