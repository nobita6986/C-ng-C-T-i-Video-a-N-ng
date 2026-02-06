import React from 'react';
import { Download, Music2, Share2, CheckCircle2 } from 'lucide-react';
import { VideoData } from '../types';
import { downloadFile } from '../utils/downloadUtils';

interface ResultCardProps {
  data: VideoData;
  reset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ data, reset }) => {
  
  const generateFilename = (title: string, extension: string) => {
    // Current timestamp YYYYMMDD_HHMMSS
    const now = new Date();
    const timestamp = 
        now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') + '_' +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0');

    // Sanitize title to remove characters invalid for filenames
    // Allow alphanumerics, spaces, dashes, underscores, and some common accents (optional, but safer to strip for cross-platform)
    // Here we strip everything except letters, numbers, spaces, dashes and underscores
    const safeTitle = title
        .replace(/[^a-zA-Z0-9 \-_àáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ]/g, '')
        .trim()
        .substring(0, 60); // Limit length
        
    const finalTitle = safeTitle || 'video_tiktok';
    
    return `${finalTitle}_${timestamp}.${extension}`;
  };

  const handleDownload = async (e: React.MouseEvent, url: string, type: 'video' | 'mp3') => {
    e.preventDefault();
    const ext = type === 'mp3' ? 'mp3' : 'mp4';
    const filename = generateFilename(data.title, ext);
    await downloadFile(url, filename);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">
      <div className="p-8">
        <div className="flex flex-col items-center">
          {/* Thumbnail & Info */}
          <div className="relative group w-48 rounded-xl overflow-hidden shadow-lg mb-6">
            <img 
              src={data.thumbnail || 'https://via.placeholder.com/400x600?text=No+Preview'} 
              alt="Video Thumbnail" 
              className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            {data.stats.views !== 'N/A' && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                <Share2 size={10} /> {data.stats.views}
                </div>
            )}
          </div>

          <h3 className="text-gray-900 font-bold text-lg text-center mb-1">
            {data.author}
          </h3>
          <p className="text-gray-500 text-sm text-center mb-6 max-w-md line-clamp-2 px-4">
            {data.title}
          </p>

          {/* Download Options List */}
          <div className="w-full space-y-3">
            {/* Video No Watermark */}
            {data.downloads.noWatermark && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Download size={20} />
                    </div>
                    <div>
                    <div className="font-semibold text-gray-800">Video chất lượng cao</div>
                    <div className="text-xs text-gray-500">MP4 • Original • No Watermark</div>
                    </div>
                </div>
                <a 
                    href={data.downloads.noWatermark}
                    onClick={(e) => handleDownload(e, data.downloads.noWatermark, 'video')}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 text-center min-w-[120px] cursor-pointer"
                >
                    Tải Video
                </a>
                </div>
            )}

            {/* Video With Watermark (Optional) - Only show if valid and different from noWatermark */}
            {data.downloads.watermark && data.downloads.watermark !== data.downloads.noWatermark && (
             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Server Dự Phòng</div>
                  <div className="text-xs text-gray-500">HD • MP4 • Có Logo</div>
                </div>
              </div>
              <a 
                href={data.downloads.watermark}
                onClick={(e) => handleDownload(e, data.downloads.watermark, 'video')}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 text-center min-w-[120px] cursor-pointer"
              >
                Tải Ngay
              </a>
            </div>
            )}

            {/* Audio - Only show if available */}
            {data.downloads.mp3 && (
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100 hover:border-orange-200 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <Music2 size={20} />
                    </div>
                    <div>
                    <div className="font-semibold text-gray-800">Âm thanh</div>
                    <div className="text-xs text-gray-500">Audio • Original • MP3</div>
                    </div>
                </div>
                <a 
                    href={data.downloads.mp3}
                    onClick={(e) => handleDownload(e, data.downloads.mp3, 'mp3')}
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 text-center min-w-[120px] cursor-pointer"
                >
                    Tải MP3
                </a>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;