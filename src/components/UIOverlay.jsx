import React, { useState } from 'react';

// Danh sách Layout (Bạn có thể thêm thoải mái vào đây sau này)
const LAYOUTS = [
  { id: 'sphere', label: 'Sphere',    desc: 'Cấu trúc hình cầu', icon: '🌍' },
  { id: 'circle', label: 'Circle',    desc: 'Vòng tròn đơn',     icon: '⭕' },
  { id: 'cone',   label: 'Cone',      desc: 'Hình nón xoắn',     icon: '🍦' },
  { id: 'grid',   label: 'Grid Wall', desc: 'Tường phẳng',       icon: '🧱' },
  { id: 'spiral', label: 'Spiral',    desc: 'Xoắn ốc vô cực',    icon: '🌀' },
  { id: 'random', label: 'Chaos',     desc: 'Ngẫu nhiên',        icon: '🎲' },
];

const UIOverlay = ({ 
  currentLayout, 
  setLayout, 
  imageCount, 
  setImageCount, 
  min = 20, 
  max = 1000, 
  step = 10 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Tìm thông tin layout hiện tại để hiển thị
  const activeLayout = LAYOUTS.find(l => l.id === currentLayout) || LAYOUTS[0];

  const handleAdjustCount = (amount) => {
    const newValue = imageCount + amount;
    if (newValue >= min && newValue <= max) setImageCount(newValue);
  };

  return (
    // Container chính: Góc Trái - Trên
    <div 
      className="absolute top-6 left-6 z-50 w-80 flex flex-col gap-4 text-white"
      onPointerDown={(e) => e.stopPropagation()} // Chặn click xuyên thấu
    >
      
      {/* --- PANEL CHÍNH --- */}
      <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* 1. Header: Tên dự án */}
        <div className="p-5 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
            NEUROMOSAIC
          </h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1">
            Immersive Data Visualizer
          </p>
        </div>

        <div className="p-5 space-y-6">
          
          {/* 2. Layout Selector (Dropdown) */}
          <div className="relative">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 block">
              Layout Mode
            </label>
            
            {/* Nút bấm mở Menu */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{activeLayout.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-200 group-hover:text-white">
                    {activeLayout.label}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {activeLayout.desc}
                  </div>
                </div>
              </div>
              
              {/* Mũi tên xoay */}
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Danh sách thả xuống (Collapsible) */}
            <div 
              className={`
                mt-2 overflow-hidden transition-all duration-300 ease-in-out bg-black/40 rounded-xl border border-white/5
                ${isDropdownOpen ? 'max-h-64 opacity-100 py-1' : 'max-h-0 opacity-0'}
              `}
            >
              <div className="overflow-y-auto max-h-64 custom-scrollbar">
                {LAYOUTS.map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => {
                      setLayout(layout.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors text-sm
                      ${currentLayout === layout.id 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    <span>{layout.icon}</span>
                    <span>{layout.label}</span>
                    {currentLayout === layout.id && (
                      <span className="ml-auto text-cyan-400">●</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Image Counter Control */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                Capacity
              </label>
              <span className="text-xs text-cyan-400 font-mono">
                {min} - {max}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
              {/* Nút Giảm */}
              <button
                onClick={() => handleAdjustCount(-step)}
                disabled={imageCount <= min}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/20 hover:text-red-400 disabled:opacity-30 transition-all active:scale-95"
              >
                <svg width="12" height="2" fill="currentColor"><rect width="12" height="2" rx="1"/></svg>
              </button>

              {/* Số hiển thị */}
              <div className="flex-1 text-center font-mono font-bold text-xl text-white">
                {imageCount}
              </div>

              {/* Nút Tăng */}
              <button
                onClick={() => handleAdjustCount(step)}
                disabled={imageCount >= max}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/20 hover:text-green-400 disabled:opacity-30 transition-all active:scale-95"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M5 5V1a1 1 0 0 1 2 0v4h4a1 1 0 0 1 0 2H7v4a1 1 0 0 1-2 0V7H1a1 1 0 0 1 0-2h4z"/></svg>
              </button>
            </div>
          </div>

        </div>
        
        {/* Footer trang trí */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-50"></div>
      </div>
      
    </div>
  );
};

export default UIOverlay;