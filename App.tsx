import React, { useState } from 'react';
import { Link, Clipboard, X, Loader2, Download, ListVideo, Facebook, Construction } from 'lucide-react';
import Navbar from './components/Navbar';
import ResultCard from './components/ResultCard';
import InstructionBox from './components/InstructionBox';
import BatchResultList from './components/BatchResultList';
import { VideoData } from './types';
import { fetchVideoData } from './services/tiktokService';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('tiktok');
  const [inputContent, setInputContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Single mode state
  const [singleVideoData, setSingleVideoData] = useState<VideoData | null>(null);
  
  // Batch mode state
  const [batchResults, setBatchResults] = useState<VideoData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleClear = () => {
    setInputContent('');
    setError(null);
    setSingleVideoData(null);
    setBatchResults([]);
  };

  const handleProcess = async () => {
    if (!inputContent.trim()) return;

    setError(null);
    setLoading(true);
    setSingleVideoData(null);
    setBatchResults([]);

    const lines = inputContent.split(/\r?\n/).filter(line => line.trim() !== '');

    // Logic: If only 1 line, treat as single download (show big card).
    // If > 1 line, treat as batch (show list).
    
    if (lines.length === 1) {
       // Single Video Mode
       try {
         const data = await fetchVideoData(lines[0].trim());
         setSingleVideoData(data);
       } catch (err: any) {
         setError(err.message || 'Không thể tải video này.');
       } finally {
         setLoading(false);
       }
    } else {
       // Batch Mode
       try {
         for (let i = 0; i < lines.length; i++) {
            const url = lines[i].trim();
            try {
              const data = await fetchVideoData(url);
              setBatchResults(prev => [...prev, data]);
            } catch (e) {
              console.warn(`Failed to load ${url}`, e);
              // Optionally handle errors for individual items here
            }
            
            // Artificial delay as requested: 1 second between requests
            if (i < lines.length - 1) {
               await new Promise(resolve => setTimeout(resolve, 1000));
            }
         }
       } catch (err: any) {
         setError('Có lỗi xảy ra trong quá trình xử lý hàng loạt.');
       } finally {
         setLoading(false);
       }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputContent(prev => prev ? prev + '\n' + text : text);
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
  };

  const resetState = () => {
    setSingleVideoData(null);
    setBatchResults([]);
    setInputContent('');
    setError(null);
  };

  const isBatchMode = inputContent.split(/\r?\n/).filter(line => line.trim() !== '').length > 1;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
      <Navbar activePage={activePage} onSelectPage={setActivePage} />

      <main className="flex-grow w-full px-4 sm:px-6 py-12">
        {activePage === 'tiktok' ? (
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 text-center mb-4 tracking-tight">
              Tải Video TikTok Không Logo
            </h1>
            <p className="text-gray-500 text-lg mb-10 text-center max-w-2xl">
              Công cụ hỗ trợ tải video TikTok, Douyin hàng loạt, tách nhạc MP3 chất lượng cao, miễn phí và không giới hạn.
            </p>

            {/* Show Instructions if typing multiple lines or results exist */}
            {(isBatchMode || batchResults.length > 0) && <InstructionBox />}

            {/* Input Area - Only show if no Single Video Result is active */}
            {!singleVideoData && (
              <div className="w-full max-w-3xl flex flex-col items-center animate-fade-in">
                
                <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-2 pl-4 flex flex-col gap-2 transition-shadow focus-within:shadow-xl focus-within:border-blue-400 relative">
                  <div className="flex items-start gap-3 pt-2">
                    <Link className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                    <textarea
                      value={inputContent}
                      onChange={(e) => setInputContent(e.target.value)}
                      placeholder={
                        "Dán liên kết TikTok vào đây...\nVí dụ:\nhttps://www.tiktok.com/@user/video/123\nhttps://www.tiktok.com/@user/video/456"
                      }
                      className="flex-grow bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 min-h-[60px] max-h-[200px] resize-y py-1"
                      spellCheck={false}
                    />
                    
                    {inputContent && (
                      <button onClick={handleClear} className="text-gray-400 hover:text-gray-600 p-2">
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex justify-end border-t border-gray-100 pt-2 px-2 pb-1">
                     <button 
                        onClick={handlePaste}
                        className="flex items-center gap-1 text-sm text-blue-500 font-medium px-3 py-1 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                     >
                        <Clipboard size={14} /> Dán Link
                     </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 text-red-500 bg-red-50 px-4 py-2 rounded-lg text-sm font-medium animate-shake w-full text-center">
                    {error}
                  </div>
                )}

                {/* Main CTA Button */}
                <button
                  onClick={handleProcess}
                  disabled={loading || !inputContent.trim()}
                  className={`
                    mt-8 px-12 py-4 rounded-full text-white font-bold text-lg shadow-lg 
                    flex items-center gap-3 transition-all duration-300 transform
                    ${loading || !inputContent.trim()
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : isBatchMode 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/30 hover:-translate-y-1 active:scale-95'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-blue-500/30 hover:-translate-y-1 active:scale-95'
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" /> {isBatchMode ? 'Đang Xử Lý Hàng Loạt...' : 'Đang Xử Lý...'}
                    </>
                  ) : (
                    <>
                       {isBatchMode ? <ListVideo size={24} /> : <Download size={24} />}
                       {isBatchMode ? 'Tải Về Hàng Loạt' : 'Tải Ngay'}
                    </>
                  )}
                </button>

                <p className="mt-8 text-gray-400 text-xs sm:text-sm text-center max-w-lg">
                  Bằng cách sử dụng dịch vụ của chúng tôi, bạn chấp nhận Điều khoản dịch vụ và Chính sách quyền riêng tư của chúng tôi.
                </p>
              </div>
            )}

            {/* Render Single Result */}
            {singleVideoData && (
              <ResultCard data={singleVideoData} reset={resetState} />
            )}

            {/* Render Batch Results */}
            <BatchResultList 
              results={batchResults} 
              isProcessing={loading} 
              totalInput={inputContent.split(/\r?\n/).filter(l => l.trim()).length} 
            />

            {/* SEO Content / Footer Info */}
            <div className="mt-20 text-center max-w-3xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Tải Video TikTok Giữ Nguyên Chất Lượng Gốc - Server Việt Nam
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Giải pháp lấy nguồn video sạch 100% để làm Content Re-up. Không bị nén, không vỡ hạt, tải xong dùng được ngay cho CapCut/Edit. Chúng tôi hỗ trợ tải xuống video TikTok không logo, hình ảnh HD và nhạc MP3 chất lượng cao.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center animate-fade-in">
             <div className="bg-blue-50 p-8 rounded-full mb-6">
                <Construction size={64} className="text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Chức năng đang được phát triển</h2>
            <p className="text-gray-500 max-w-md text-lg">
                Vui lòng quay lại sau.
            </p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-8">
         <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
            <a 
              href="https://www.facebook.com/deshunvn" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
              title="Liên hệ qua Facebook"
            >
                <Facebook size={24} />
            </a>
            <div className="text-center text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} StudyAI86. All rights reserved. Designed for excellence.
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;