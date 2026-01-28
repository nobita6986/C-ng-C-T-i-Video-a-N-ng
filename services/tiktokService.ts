import { VideoData } from '../types';

// Nếu bạn mua key từ tikwm.com, hãy điền vào đây để quét không giới hạn và ổn định hơn.
// Ví dụ: const TIKWM_API_KEY = 'your_api_key_here';
const TIKWM_API_KEY = ''; 

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
    let apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    if (TIKWM_API_KEY) {
        apiUrl += `&key=${TIKWM_API_KEY}`;
    }
    
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

export const fetchChannelVideos = async (channelUrl: string): Promise<string[]> => {
    if (!channelUrl.trim()) {
        throw new Error("Vui lòng nhập liên kết kênh TikTok.");
    }

    // Extract username: match https://www.tiktok.com/@username
    // Updated regex to be more robust
    const match = channelUrl.match(/@([a-zA-Z0-9_.]+)/);
    if (!match || !match[1]) {
        throw new Error("Link kênh không hợp lệ. (Ví dụ: https://www.tiktok.com/@username)");
    }
    
    const unique_id = match[1]; 

    let cursor = 0;
    let hasMore = true;
    let allVideos: string[] = [];
    const MAX_PAGES = 10; // Giới hạn trang cho bản free để tránh timeout
    let page = 0;

    // Giảm số lượng request mỗi lần cho bản free để tránh bị chặn (12 video/lần thay vì 33)
    const BATCH_SIZE = TIKWM_API_KEY ? 33 : 12;

    try {
        while (hasMore && page < MAX_PAGES) {
            // Using TikWM User Posts API
            let apiUrl = `https://www.tikwm.com/api/user/posts?unique_id=${encodeURIComponent(unique_id)}&count=${BATCH_SIZE}&cursor=${cursor}`;
            if (TIKWM_API_KEY) {
                apiUrl += `&key=${TIKWM_API_KEY}`;
            }
            
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Lỗi kết nối API");

            const res = await response.json();

            if (res.code === 0 && res.data && Array.isArray(res.data.videos)) {
                const videos = res.data.videos;
                if (videos.length === 0) {
                    hasMore = false;
                    break;
                }

                // Construct full URLs
                const videoUrls = videos.map((v: any) => `https://www.tiktok.com/@${unique_id}/video/${v.video_id}`);
                allVideos = [...allVideos, ...videoUrls];

                if (res.data.hasMore && res.data.cursor) {
                    cursor = res.data.cursor;
                } else {
                    hasMore = false;
                }
            } else {
                hasMore = false;
                // If it fails on first page, probably private or wrong user
                if (page === 0 && res.msg) {
                    console.error("API Msg:", res.msg);
                    throw new Error("Không thể lấy dữ liệu. Kênh có thể bị ẩn, API quá tải hoặc sai User ID.");
                }
            }
            
            page++;
            // Tăng thời gian nghỉ để tránh rate limit (500ms cho free, 200ms cho paid)
            const delay = TIKWM_API_KEY ? 200 : 500;
            await new Promise(r => setTimeout(r, delay));
        }
    } catch (error: any) {
        console.error("Channel Fetch Error:", error);
        throw new Error(error.message || "Không thể quét video từ kênh này. Vui lòng thử lại sau.");
    }

    if (allVideos.length === 0) {
        throw new Error("Không tìm thấy video nào trong kênh này hoặc kênh trống.");
    }

    return allVideos;
};

const formatNumber = (num: number | undefined): string => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};