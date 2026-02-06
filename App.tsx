import React, { useState, useEffect } from 'react';
import { Link, Clipboard, X, Loader2, Download, ListVideo, Facebook, Construction, ScanSearch, Sparkles } from 'lucide-react';
import Navbar from './components/Navbar';
import ResultCard from './components/ResultCard';
import InstructionBox from './components/InstructionBox';
import BatchResultList from './components/BatchResultList';
import { VideoData } from './types';
import { fetchVideoData, fetchChannelVideos } from './services/tiktokService';
import { fetchSoraVideo } from './services/soraService';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('tiktok');
  const [inputContent, setInputContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  
  // Single mode state
  const [singleVideoData, setSingleVideoData] = useState<VideoData | null>(null);
  
  // Batch mode state
  const [batchResults, setBatchResults] = useState<VideoData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Auto-switch tab based on input
  useEffect(() => {
     if (inputContent.includes('sora.chatgpt.com') && activePage !== 'sora') {
         setActivePage('sora');
     } else if (inputContent.includes('tiktok.com') && activePage !== 'tiktok') {
         setActivePage('tiktok');
     }
  }, [inputContent]);

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
    setLoadingText('');

    const lines = inputContent.split(/\r?\n/).filter(line => line.trim() !== '');

    // SORA LOGIC
    if (activePage === 'sora' || inputContent.includes('sora.chatgpt.com')) {
        setLoadingText('Đang xử lý video Sora...');
        try {
            const data = await fetchSoraVideo(lines[0]);
            setSingleVideoData(data);
        } catch (err: any) {
            setError(err.message || 'Không thể lấy video Sora.');
        } finally {
            setLoading(false);
        }
        return;
    }

    // TIKTOK LOGIC
    if (lines.length === 1) {
       const line = lines[0].trim();
       
       // Detect Channel URL
       const isChannel = line.includes('tiktok.com/@') && !line.includes('/video/') && !line.includes('/photo/');

       if (isChannel) {
           setLoadingText('Đang quét toàn bộ video của kênh...');
           try {
               const videoUrls = await fetchChannelVideos(line);
               setInputContent(videoUrls.join('\n'));
               setLoading(false);
               setLoadingText('');
               // We assume the user sees the list and will click "Download Batch" next
               return;
           } catch (err: any) {
               setError(err.message || 'Không thể lấy danh sách video từ kênh này.');
               setLoading(false);
               setLoadingText('');
               return;
           }
       }

       // Single Video Mode
       try {
         const data = await fetchVideoData(line);
         setSingleVideoData(data);
       } catch (err: any) {
         setError(err.message || 'Không thể tải video này.');
       } finally {
         setLoading(false);
       }
    } else {
       // Batch Mode (TikTok Only for now)
       setLoadingText('Đang xử lý hàng loạt...');
       try {
         for (let i = 0; i < lines.length; i++) {
            const url = lines[i].trim();
            try {
              const data = await fetchVideoData(url);
              setBatchResults(prev => [...prev, data]);
            } catch (e) {
              console.warn(`Failed to load ${url}`, e);
            }
            
            // Artificial delay
            if (i < lines.length - 1) {
               await new Promise(resolve => setTimeout(resolve, 1000));
            }
         }
       } catch (err: any) {
         setError('Có lỗi xảy ra trong quá trình xử lý hàng loạt.');
       } finally {
         setLoading(false);
         setLoadingText('');
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

  // Detect if current input is likely a channel for button UI
  const isSingleChannelInput = activePage === 'tiktok' && !isBatchMode && inputContent.includes('tiktok.com/@') && !inputContent.includes('/video/') && inputContent.trim().length > 0;

  // Dynamic UI Content based on Page
  const getPageContent = () => {
      switch(activePage) {
          case 'sora':
              return {
                  title: 'Tải Video Sora AI (OpenAI)',
                  desc: 'Hỗ trợ tải video từ Sora AI với chất lượng cao nhất, đầy đủ prompt mô tả.',
                  placeholder: 'Dán liên kết Sora vào đây...\nVí dụ: https://sora.chatgpt.com/p/s_697a618...',
                  colorFrom: 'from-orange-500',
                  colorTo: 'to-red-600'
              };
          default: // tiktok
              return {
                  title: 'Tải Video TikTok Không Logo',
                  desc: 'Công cụ hỗ trợ tải video TikTok, Douyin hàng loạt, tách nhạc MP3 chất lượng cao.',
                  placeholder: 'Dán liên kết TikTok vào đây...\nVí dụ Video: https://www.tiktok.com/@user/video/123\nVí dụ Kênh: https://www.tiktok.com/@user',
                  colorFrom: 'from-blue-500',
                  colorTo: 'to-indigo-600'
              };
      }
  };

  const ui = getPageContent();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
      <Navbar activePage={activePage} onSelectPage={setActivePage} />

      <main className="flex-grow w-full px-4 sm:px-6 py-12">
        {activePage === 'tiktok' || activePage === 'sora' ? (
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 text-center mb-4 tracking-tight">
              {ui.title}
            </h1>
            <p className="text-gray-500 text-lg mb-10 text-center max-w-2xl">
              {ui.desc}
            </p>

            {/* Show Instructions if typing multiple lines or results exist (Only TikTok) */}
            {activePage === 'tiktok' && (isBatchMode || batchResults.length > 0) && <InstructionBox />}

            {/* Input Area - Always visible now */}
            <div className="w-full max-w-3xl flex flex-col items-center animate-fade-in mb-10">
              
              <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-2 pl-4 flex flex-col gap-2 transition-shadow focus-within:shadow-xl focus-within:border-blue-400 relative">
                <div className="flex items-start gap-3 pt-2">
                  <Link className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                  <textarea
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    placeholder={ui.placeholder}
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
                  bg-gradient-to-r ${ui.colorFrom} ${ui.colorTo}
                  hover:shadow-blue-500/30 hover:-translate-y-1 active:scale-95
                  ${(loading || !inputContent.trim()) ? 'bg-gray-300 cursor-not-allowed opacity-70' : ''}
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> {loadingText || (isBatchMode ? 'Đang Xử Lý Hàng Loạt...' : 'Đang Xử Lý...')}
                  </>
                ) : (
                  <>
                     {activePage === 'sora' ? <Sparkles size={24} /> : (isSingleChannelInput ? <ScanSearch size={24} /> : (isBatchMode ? <ListVideo size={24} /> : <Download size={24} />))}
                     {activePage === 'sora' ? 'Tải Video Sora' : (isSingleChannelInput ? 'Quét Video Kênh' : (isBatchMode ? 'Tải Về Hàng Loạt' : 'Tải Ngay'))}
                  </>
                )}
              </button>

              {!singleVideoData && batchResults.length === 0 && (
                <p className="mt-8 text-gray-400 text-xs sm:text-sm text-center max-w-lg">
                  Bằng cách sử dụng dịch vụ của chúng tôi, bạn chấp nhận Điều khoản dịch vụ và Chính sách quyền riêng tư của chúng tôi.
                </p>
              )}
            </div>

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
                 StudyAI86 - Công Cụ Tải Video Đa Nền Tảng
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi cung cấp giải pháp tải video từ TikTok, Douyin và mới nhất là Sora AI (OpenAI). 
                Tất cả đều miễn phí, tốc độ cao và giữ nguyên chất lượng gốc.
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
                &copy; {new Date().getFullYear()} StudyAI86. All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;