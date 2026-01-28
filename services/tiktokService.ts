import { VideoData } from '../types';

export const fetchVideoData = async (url: string): Promise<VideoData> => {
  if (!url.trim()) {
      throw new Error("Vui lòng nhập liên kết TikTok.");
  }
  
  // Basic validation
  if (!url.includes('tiktok.com')) {
    throw new Error("Vui lòng nhập một liên kết TikTok hợp lệ (Ví dụ: https://www.tiktok.com/@user/video/...)");
  }

  try {
    // Using TikWM public API
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
        throw new Error("Lỗi mạng khi kết nối đến máy chủ.");
    }
    
    const res = await response.json();

    if (res.code === 0 && res.data) {
      const video = res.data;
      return {
        id: video.id,
        title: video.title || 'Video TikTok',
        author: video.author?.nickname || video.author?.unique_id || 'Unknown',
        avatar: video.author?.avatar || 'https://via.placeholder.com/100',
        thumbnail: video.cover || 'https://via.placeholder.com/400x600',
        stats: {
          views: formatNumber(video.play_count),
          likes: formatNumber(video.digg_count),
          comments: formatNumber(video.comment_count)
        },
        downloads: {
          // Prioritize HD link if available
          noWatermark: video.hdplay || video.play, 
          watermark: video.wmplay || video.play, 
          mp3: video.music
        }
      };
    } else {
      throw new Error(res.msg || "Không tìm thấy video. Video có thể ở chế độ riêng tư hoặc đã bị xóa.");
    }
  } catch (error: any) {
    console.error("TikTok Service Error:", error);
    throw new Error(error.message || "Đã xảy ra lỗi khi tải thông tin video.");
  }
};

const formatNumber = (num: number | undefined): string => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};