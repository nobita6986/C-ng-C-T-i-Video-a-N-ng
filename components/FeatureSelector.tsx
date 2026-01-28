import React from 'react';
import { PlayCircle, Music, Video, Smile } from 'lucide-react';
import { TabType } from '../types';

interface FeatureSelectorProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const FeatureSelector: React.FC<FeatureSelectorProps> = ({ activeTab, setActiveTab }) => {
  const features = [
    {
      id: TabType.TIKTOK_NO_LOGO,
      label: 'Tải TikTok Không Logo',
      icon: <PlayCircle size={24} />,
      color: 'text-cyan-500',
    },
    {
      id: TabType.MP3,
      label: 'Tách Nhạc MP3 Gốc',
      icon: <Music size={24} />,
      color: 'text-pink-500',
    },
    {
      id: TabType.DOUYIN,
      label: 'Tải Douyin Không Logo',
      icon: <Video size={24} />,
      color: 'text-blue-500',
    },
    {
      id: TabType.STORY,
      label: 'Tải Story TikTok',
      icon: <Smile size={24} />,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 w-full max-w-5xl mx-auto">
      {features.map((feature) => {
        const isActive = activeTab === feature.id;
        return (
          <button
            key={feature.id}
            onClick={() => setActiveTab(feature.id)}
            className={`
              relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300
              border-2 bg-white
              ${isActive 
                ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)] scale-105 z-10' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
            `}
          >
            <div className={`mb-3 p-3 rounded-full bg-gray-50 ${feature.color}`}>
              {feature.icon}
            </div>
            <span className={`text-sm font-bold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
              {feature.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FeatureSelector;