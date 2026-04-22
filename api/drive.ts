declare var process: any;

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
}

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.VITE_FIREBASE_API_KEY || process.env.VITE_GOOGLE_API_KEY;
  const folderId = req.query.folderId || process.env.VITE_DRIVE_FOLDER_ID || '1HmB4SVm7WraN-4ELBxaEm3RcTjZ9t8Vq';

  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const query = `'${folderId}' in parents and trashed=false`;
    const fields = 'files(id,name,mimeType,modifiedTime,size,webViewLink,webContentLink,iconLink,thumbnailLink)';
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&key=${apiKey}&orderBy=folder,name&pageSize=100`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(data.error.code || 500).json({ error: data.error.message });
    }

    return res.status(200).json({ files: data.files || [] });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch files' });
  }
}
