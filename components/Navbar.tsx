import React from 'react';
import { Menu, X, Zap, History } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  onSelectPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, onSelectPage }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { id: 'tiktok', name: 'Video Tiktok' },
    { id: 'sora', name: 'Video Sora AI' },
    { id: 'douyin', name: 'Video Douyin' },
    { id: 'library', name: 'Thư viện', icon: <History size={16} className="inline mr-1" /> },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onSelectPage('tiktok')}>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg">
                <Zap size={24} className="text-white fill-current" />
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
                  StudyAI
                </span>
                <span className="text-2xl font-black text-orange-500 tracking-tight">86</span>
              </div>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onSelectPage(link.id)}
                className={`text-sm font-medium transition-all duration-200 outline-none flex items-center px-4 py-2 rounded-full ${
                  activePage === link.id
                    ? 'text-blue-700 font-bold bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {link.icon && link.icon}
                {link.name}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onSelectPage(link.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium flex items-center ${
                    activePage === link.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-500 hover:bg-gray-50'
                }`}
              >
                 {link.icon && <span className="mr-2">{link.icon}</span>}
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;