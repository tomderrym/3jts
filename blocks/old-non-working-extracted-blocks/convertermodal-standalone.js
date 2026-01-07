/**
 * ConverterModal Component

 */

import React, {  useState, useRef  } from 'https://esm.sh/react@18';
import { X, Wand2, FileCode2, ArrowRight, Loader2, Image as ImageIcon, Upload, Trash2, Plus } from 'lucide-react';

interface ConverterModalProps {
  onClose: () => void;
  onConvert: (code: string, instructions: string, images: string[]) => void;
  isLoading: boolean;
}

export default function ConverterModal: React.FC<ConverterModalProps> = ({ onClose, onConvert, isLoading }) => {
  const [code, setCode] = useState('');
  const [instructions, setInstructions] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!code.trim() && images.length === 0) return;
    onConvert(code, instructions, images);
  };

  const processFiles = async (files: FileList | null) => {
    if (!files) return;
    
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    const promises = validFiles.map(file => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    }));

    const results = await Promise.all(promises);
    setImages(prev => [...prev, ...results]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset value so same files can be selected again if needed
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return createElement('div', {className: 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200'}, '<div className="bg-[#111114] border border-white/10 w-full max-w-5xl h-[85vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden scale-in-center relative">
        
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              createElement('Wand2', {className: 'text-indigo-400'})
            </div>
            <div>
              createElement('h2', {className: 'text-lg font-bold text-white tracking-tight'}, 'Convert to React Project')
              createElement('p', {className: 'text-[10px] text-slate-500 uppercase tracking-widest font-black'}, 'Legacy Code & Design Refactoring')
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all">
            createElement('X', null)
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* Left: Inputs */}
          <div className="flex-1 flex flex-col min-w-0 border-b md:border-b-0 md:border-r border-white/5">
            
            {/* Split View: Code & Image */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0">
                {/* Code Input */}
                <div className="flex-1 flex flex-col p-6 border-b md:border-b-0 md:border-r border-white/5 min-h-[200px]">
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                        createElement('FileCode2', null) Paste HTML / Component Code
                    </label>
                    <textarea 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your index.html, legacy script, or single-file component here..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50 resize-none leading-relaxed"
                    />
                </div>

                {/* Image Input */}
                <div className="flex-1 flex flex-col p-6 bg-[#0c0c0e]/50 min-h-[200px]">
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                        createElement('ImageIcon', null) Upload Mockups / Screenshots
                    </label>
                    
                    <div 
                        className={`flex-1 border-2 border-dashed border-white/10 rounded-xl relative overflow-hidden transition-all ${images.length === 0 ? 'flex flex-col items-center justify-center hover:border-indigo-500/50 hover:bg-white/5' : 'bg-black/20 p-2'}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        {images.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 h-full overflow-y-auto content-start">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square group rounded-lg overflow-hidden border border-white/10 bg-black">
                                        createElement('img', {className: 'w-full h-full object-cover'})
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button 
                                                onClick={() => removeImage(idx)}
                                                className="p-1.5 bg-red-500/80 text-white rounded-md hover:bg-red-600 transition-colors"
                                            >
                                                createElement('Trash2', null)
                                            </button>
                                        </div>'))}
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square flex flex-col items-center justify-center border border-white/10 border-dashed rounded-lg hover:bg-white/5 text-slate-500 hover:text-indigo-400 transition-all"
                                >
                                    createElement('Plus', null)
                                    createElement('span', {className: 'text-[10px] font-bold mt-1'}, 'ADD MORE')
                                </button>
                            </div>
                        ) : (
                            <div className="text-center p-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                    createElement('Upload', {className: 'text-slate-500'})
                                </div>
                                createElement('p', {className: 'text-xs font-bold text-slate-400 mb-1'}, 'Click to upload or drag & drop')
                                createElement('p', {className: 'text-[10px] text-slate-600'}, 'PNG, JPG, WEBP up to 5MB')
                            </div>
                        )}
                        createElement('input', {className: 'hidden', type: 'file', accept: 'image/*', onChange: handleImageUpload})
                    </div>
                </div>
            </div>
          </div>

          {/* Right: Configuration */}
          <div className="w-full md:w-80 flex flex-col p-6 bg-[#0c0c0e]">
             <div className="mb-6">
                createElement('h3', {className: 'text-sm font-bold text-white mb-4'}, 'Instructions')
                <div className="space-y-4">
                    <div>
                        createElement('label', {className: 'text-[10px] font-bold text-slate-500 uppercase mb-1 block'}, 'Additional Context')
                        <textarea 
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="e.g. Use dark mode, extract colors from image, create a dashboard layout..."
                            className="w-full h-32 bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50 resize-none"
                        />
                    </div>
                </div>
             </div>

             <div className="mt-auto">
                 <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl mb-4">
                    createElement('h4', {className: 'text-[10px] font-bold text-indigo-400 uppercase mb-2'}, 'Capabilities')
                    <ul className="space-y-2 text-[10px] text-slate-400 list-disc pl-3">
                        <li>createElement('strong', null, 'Vision:') Analyzes screenshots/mockups.</li>
                        <li>createElement('strong', null, 'Refactor:') Modernizes legacy HTML/JS.</li>
                        <li>createElement('strong', null, 'Stack:') React 18, Vite, Tailwind CSS.</li>
                    </ul>
                 </div>

                 <button 
                    onClick={handleSubmit}
                    disabled={(!code.trim() && images.length === 0) || isLoading}
                    className="w-full group relative flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                 >
                    {isLoading ? (
                        <>
                            createElement('Loader2', {className: 'animate-spin'})
                            createElement('span', null, 'Processing...')
                        </>
                    ) : (
                        <>
                            createElement('Wand2', null)
                            createElement('span', null, 'Magic Convert')
                            createElement('ArrowRight', {className: 'group-hover:translate-x-1 transition-transform'})
                        </>
                    )}
                 </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
