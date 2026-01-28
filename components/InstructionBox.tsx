import React from 'react';
import { Info, Clock, Save, AlertTriangle } from 'lucide-react';

const InstructionBox: React.FC = () => {
  return (
    <div className="w-full max-w-3xl bg-green-50 border border-green-200 rounded-xl p-6 mb-8 animate-fade-in">
      <div className="flex items-start gap-3 mb-2">
        <Info className="text-green-600 mt-1 flex-shrink-0" size={24} />
        <h3 className="font-bold text-green-800 text-lg">Hướng dẫn sử dụng:</h3>
      </div>
      <ul className="space-y-2 text-sm text-green-800 ml-9 list-disc">
        <li>Nhập nhiều link TikTok vào ô bên dưới (mỗi link 1 dòng)</li>
        <li>Click "Tải về hàng loạt" - App tự động xử lý và tải tất cả videos</li>
        <li>Videos được xử lý TUẦN TỰ, nghỉ 1 giây giữa mỗi video</li>
        <li className="flex items-center gap-2">
          <Clock size={16} /> Thời gian: 10 videos ~20s, 50 videos ~100s, 100 videos ~3.5 phút
        </li>
        <li className="flex items-center gap-2 font-semibold">
          <Save size={16} /> Nhớ bấm cho phép Download / Tải về nhiều file nếu trình duyệt hỏi
        </li>
        <li className="flex items-center gap-2 text-orange-700">
          <AlertTriangle size={16} /> Giữ tab mở trong khi xử lý, không tắt hoặc reload trang
        </li>
      </ul>
    </div>
  );
};

export default InstructionBox;