import React from 'react';
import { Download, Music2, Share2, CheckCircle2 } from 'lucide-react';
import { VideoData } from '../types';
import { downloadFile } from '../utils/downloadUtils';

interface ResultCardProps {
  data: VideoData;
  reset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ data, reset }) => {
  
  const handleDownload = async (e: React.MouseEvent, url: string, type: 'video' | 'mp3') => {
    e.preventDefault();
    const ext = type === 'mp3' ? 'mp3' : 'mp4';
    const filename = `studyai86_${data.id}.${ext}`;
    await downloadFile(url, filename);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">
      <div className="p-8">
        <div className="flex flex-col items-center">
          {/* Thumbnail & Info */}
          <div className="relative group w-48 rounded-xl overflow-hidden shadow-lg mb-6">
            <img 
              src={data.thumbnail} 
              alt="Video Thumbnail" 
              className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
               <Share2 size={10} /> {data.stats.views}
            </div>
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
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Download size={20} />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Server VIP 1</div>
                  <div className="text-xs text-gray-500">1080p • MP4 • Không Logo</div>
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

            {/* Video With Watermark (Optional) */}
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

            {/* Audio */}
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
          </div>

          <button 
            onClick={reset}
            className="mt-8 text-sm text-gray-400 hover:text-gray-600 underline"
          >
            Tải video khác
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;