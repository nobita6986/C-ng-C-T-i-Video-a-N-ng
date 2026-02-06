import React from 'react';
import { Trash2, Download, ExternalLink, History, Calendar } from 'lucide-react';
import { VideoData } from '../types';
import { downloadFile } from '../utils/downloadUtils';

interface LibraryProps {
  history: VideoData[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

const Library: React.FC<LibraryProps> = ({ history, onRemove, onClearAll }) => {
  
  const handleDownload = async (video: VideoData) => {
    // Current timestamp YYYYMMDD_HHMMSS
    const now = new Date();
    const timestamp = 
        now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') + '_' +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0');

    // Sanitize title but keep Vietnamese characters
    const safeTitle = video.title
        .replace(/[^a-zA-Z0-9 \-_àáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ]/g, '')
        .trim()
        .substring(0, 60);

    const finalTitle = safeTitle || 'video';
    const filename = `${finalTitle}_${timestamp}.mp4`;
    
    await downloadFile(video.downloads.noWatermark, filename);
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <History size={48} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">Thư viện trống</h3>
        <p className="text-gray-500 max-w-sm">
          Các video bạn tải sẽ tự động xuất hiện ở đây để bạn có thể xem lại hoặc tải lại sau này.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <History className="text-blue-600" /> 
          Thư viện đã tải ({history.length})
        </h2>
        <button
          onClick={() => {
            if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử không?')) {
              onClearAll();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
        >
          <Trash2 size={16} /> Xóa tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((video) => (
          <div 
            key={video.id} 
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex gap-4 group"
          >
            {/* Thumbnail */}
            <div className="w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                    // Fallback if cached link expires
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Expired';
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Content */}
            <div className="flex-grow min-w-0 flex flex-col justify-between py-1">
              <div>
                <h4 className="font-bold text-gray-800 text-sm line-clamp-1" title={video.author}>{video.author}</h4>
                <p className="text-gray-600 text-xs line-clamp-2 mt-1" title={video.title}>
                  {video.title || 'Không có tiêu đề'}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <div className="flex gap-2">
                   <button
                    onClick={() => handleDownload(video)}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                    title="Tải lại video này"
                   >
                     <Download size={14} /> Tải Lại
                   </button>
                   <a 
                     href={video.downloads.noWatermark}
                     target="_blank"
                     rel="noreferrer"
                     className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                     title="Mở link gốc"
                   >
                     <ExternalLink size={14} />
                   </a>
                </div>

                <button
                  onClick={() => onRemove(video.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                  title="Xóa khỏi thư viện"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;