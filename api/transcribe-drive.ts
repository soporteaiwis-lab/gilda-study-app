import { google } from 'googleapis';
import { GoogleGenerativeAI } from '@google/generative-ai';
// @ts-ignore
import pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { fileId } = req.query;
  if (!fileId) return res.status(400).json({ error: 'File ID is required' });

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API Key not configured' });

  try {
    const drive = google.drive({ version: 'v3', auth: apiKey });
    
    // 1. Get metadata to find mimeType
    const metadata = await drive.files.get({ fileId, fields: 'name, mimeType' });
    const { name, mimeType } = metadata.data;

    let textContent = '';

    // 2. Handle Google Docs/Sheets/etc specifically (they must be exported)
    if (mimeType?.includes('google-apps.')) {
      const exportMime = mimeType.includes('spreadsheet') ? 'text/csv' : 'text/plain';
      const exportRes = await drive.files.export({ fileId, mimeType: exportMime });
      textContent = typeof exportRes.data === 'string' ? exportRes.data : JSON.stringify(exportRes.data);
    } else {
      // 3. For binary files (PDF, Images, etc), we need to get the media
      const mediaRes = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(mediaRes.data as ArrayBuffer);

      // FAST PATH: Direct text extraction
      if (mimeType === 'application/pdf') {
        try {
          const data = await pdfParse(buffer);
          textContent = data.text;
        } catch (err) {
          console.warn('Fast PDF parse failed, falling back to Gemini:', err);
        }
      } else if (mimeType?.includes('wordprocessingml') || mimeType?.includes('msword')) {
        try {
          const result = await mammoth.extractRawText({ buffer });
          textContent = result.value;
        } catch (err) {
          console.warn('Fast Word parse failed, falling back to Gemini:', err);
        }
      } else if (mimeType?.startsWith('text/')) {
        textContent = buffer.toString('utf-8');
      }

      // SLOW PATH: If fast path failed or didn't apply (images/audio/video)
      if (!textContent.trim()) {
        const base64 = buffer.toString('base64');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        let prompt = `Digitaliza y transcribe este archivo llamado "${name}" para estudio.`;
        if (mimeType?.startsWith('image/')) prompt = 'Transcribe todo el texto de esta imagen.';
        else if (mimeType?.startsWith('audio/')) prompt = 'Transcribe el audio completamente.';
        
        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64,
              mimeType: mimeType || 'application/octet-stream'
            }
          }
        ]);
        textContent = result.response.text();
      }
    }

    return res.status(200).json({ text: textContent });
  } catch (error: any) {
    console.error('Drive Transcribe Error:', error);
    return res.status(500).json({ error: 'Falla al procesar archivo de Drive', details: error.message });
  }
}
