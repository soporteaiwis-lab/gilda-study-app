import { google } from 'googleapis';

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const folderId = req.query.folderId || '1HmB4SVm7WraN-4ELBxaEm3RcTjZ9t8Vq';

  if (!apiKey) {
    return res.status(500).json({ error: 'Falta la API Key de Google/Gemini' });
  }

  try {
    const drive = google.drive({ version: 'v3', auth: apiKey });
    
    // Si la API Key falla, intentaremos dar un mensaje más descriptivo
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, modifiedTime, size, webViewLink, webContentLink, iconLink, thumbnailLink)',
      orderBy: 'folder, name',
      pageSize: 100
    });

    return res.status(200).json({ files: response.data.files || [] });
  } catch (error: any) {
    console.error('Drive API Error:', error);
    
    // Mensaje de error personalizado para el usuario
    if (error.message?.includes('blocked')) {
      return res.status(403).json({ 
        error: 'Acceso a Google Drive bloqueado. Por favor activa la "Google Drive API" en tu consola de Google Cloud.',
        details: error.message 
      });
    }

    return res.status(500).json({ error: 'Error al conectar con Google Drive', details: error.message });
  }
}
