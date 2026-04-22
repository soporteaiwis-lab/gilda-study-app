const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const fetchDriveFiles = async (folderId: string) => {
  try {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType)`);
    if (!response.ok) throw new Error('Error fetching files from Drive');
    const data = await response.json();
    return data.files;
  } catch (error) {
    console.error('Error in fetchDriveFiles:', error);
    return [];
  }
};

export const fetchFileContent = async (fileId: string) => {
  try {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${API_KEY}`);
    if (!response.ok) throw new Error('Error fetching file content');
    return await response.blob();
  } catch (error) {
    console.error('Error in fetchFileContent:', error);
    return null;
  }
};
