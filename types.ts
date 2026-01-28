export interface VideoData {
  id: string;
  title: string;
  author: string;
  avatar: string;
  thumbnail: string;
  stats: {
    views: string;
    likes: string;
    comments: string;
  };
  downloads: {
    noWatermark: string;
    watermark: string;
    mp3: string;
  };
}

export enum TabType {
  TIKTOK_NO_LOGO = 'TIKTOK_NO_LOGO',
  MP3 = 'MP3',
  DOUYIN = 'DOUYIN',
  STORY = 'STORY'
}

export interface ApiError {
  message: string;
}