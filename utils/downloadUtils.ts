export const downloadFile = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = filename; // This now works because the URL is local (blob:)
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Blob download failed, falling back to direct link', error);
    // Fallback: Open in new tab if CORS blocks fetch
    // Adding query param sometimes forces re-evaluation by browser, but mostly we just hope the user saves it manually
    window.open(url, '_blank');
    return false;
  }
};