import { google } from 'googleapis';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, accessToken, folderId, fileData, fileName, mimeType, parentId } = req.body;

    if (!accessToken) {
      return res.status(401).json({ error: 'Unauthorized: No access token provided' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    switch (action) {
      case 'listFiles': {
        const query = folderId 
          ? \`'\${folderId}' in parents and trashed = false\`
          : \`'root' in parents and trashed = false\`;
        
        const response = await drive.files.list({
          q: query,
          fields: 'files(id, name, mimeType, size, modifiedTime, thumbnailLink)',
          orderBy: 'folder,name',
        });
        
        return res.status(200).json({ files: response.data.files || [] });
      }

      case 'createFolder': {
        const fileMetadata = {
          name: fileName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: parentId ? [parentId] : undefined,
        };
        
        const response = await drive.files.create({
          requestBody: fileMetadata,
          fields: 'id, name',
        });
        
        return res.status(200).json(response.data);
      }

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Drive API Error:', error);
    return res.status(500).json({ error: 'Failed to execute Drive operation' });
  }
}
