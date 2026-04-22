import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileData, fileType } = req.body; // base64 data

    if (!fileData) {
      return res.status(400).json({ error: 'File data is required' });
    }

    const buffer = Buffer.from(fileData.split(',')[1] || fileData, 'base64');
    let text = '';

    if (fileType === 'application/pdf' || fileType === 'pdf') {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'docx') {
      const data = await mammoth.extractRawText({ buffer });
      text = data.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error('Document Processing Error:', error);
    return res.status(500).json({ error: 'Failed to process document' });
  }
}
