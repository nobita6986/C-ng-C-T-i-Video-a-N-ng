export const downloadFile = async (url: string, filename: string) => {
  // Helper function to trigger blob download
  const downloadBlob = (blob: Blob, name: string) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      }, 1000);
  };

  // Attempt 1: Direct fetch with no-referrer
  try {
    const response = await fetch(url, {
        referrerPolicy: 'no-referrer' 
    });
    
    if (response.ok) {
        const blob = await response.blob();
        downloadBlob(blob, filename);
        return true;
    }
  } catch (error) {
    console.warn('Direct download failed, attempting proxy...', error);
  }

  // Attempt 2: Use a CORS Proxy to bypass browser restrictions
  // This is often necessary for TikTok/CDN links that don't allow direct client-side downloads
  try {
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (response.ok) {
          const blob = await response.blob();
          downloadBlob(blob, filename);
          return true;
      }
  } catch (proxyError) {
      console.error('Proxy download failed', proxyError);
  }

  // Fallback: If all attempts fail, open in new tab
  // This is the last resort behavior
  console.log('Falling back to direct link open');
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noreferrer';
  // Try to hint browser to download (often ignored for cross-origin but worth adding)
  a.download = filename; 
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  return false;
};