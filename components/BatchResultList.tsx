import React, { useState } from 'react';
import { Download, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { VideoData } from '../types';
import { downloadFile } from '../utils/downloadUtils';

interface BatchResultListProps {
  results: VideoData[];
  isProcessing: boolean;
  totalInput: number;
}

const BatchResultList: React.FC<BatchResultListProps> = ({ results, isProcessing, totalInput }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownloadAll = async () => {
    setDownloading(true);
    setDownloadProgress(0);

    // We must trigger downloads sequentially
    for (let i = 0; i < results.length; i++) {
      const video = results[i];
      const filename = `studyai86_${video.id}.mp4`;
      
      await downloadFile(video.downloads.noWatermark, filename);
      
      setDownloadProgress(i + 1);

      // Wait 1 second before next download to be safe and polite to the browser
      if (i < results.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setTimeout(() => {
        setDownloading(false);
        setDownloadProgress(0);
    }, 1000);
  };

  const handleSingleDownload = async (e: React.MouseEvent, video: VideoData) => {
    e.preventDefault();
    const filename = `studyai86_${video.id}.mp4`;
    await downloadFile(video.downloads.noWatermark, filename);
  };

  if (results.length === 0 && !isProcessing) return null;

  return (
    <div className="w-full max-w-3xl mt-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-600 font-medium">
          {results.length} link TikTok được tìm thấy {isProcessing && `(Đang xử lý ${results.length}/${totalInput}...)`}
        </span>
        
        {results.length > 0 && (
          <button
            onClick={handleDownloadAll}
            disabled={downloading}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold shadow-md transition-all active:scale-95 text-white
                ${downloading ? 'bg-gray-400 cursor-wait' : 'bg-green-500 hover:bg-green-600'}
            `}
          >
            {downloading ? (
                 <>
                    <Loader2 className="animate-spin" size={20} />
                    Đang tải {downloadProgress}/{results.length}...
                 </>
            ) : (
                <>
                    <Download size={20} />
                    Tải về hàng loạt
                </>
            )}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {results.map((video, index) => (
          <div key={`${video.id}-${index}`} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center">
             {/* Thumbnail */}
            <div className="w-16 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
              <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
            </div>

            {/* Content */}
            <div className="flex-grow min-w-0">
              <h4 className="font-bold text-gray-800 text-sm truncate">{video.author}</h4>
              <p className="text-gray-500 text-xs line-clamp-2">{video.title}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                <span>{video.stats.views} views</span>
                <span>•</span>
                <span>{video.stats.likes} likes</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0">
              <a 
                href={video.downloads.noWatermark} 
                onClick={(e) => handleSingleDownload(e, video)}
                className="flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                title="Tải video này"
              >
                <Download size={20} />
              </a>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 animate-pulse">
            Đang tải dữ liệu tiếp theo...
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchResultList;