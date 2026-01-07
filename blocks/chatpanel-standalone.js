/**
 * ChatPanel Component
 * Props: { value?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useRef, useEffect, useState  } from 'https://esm.sh/react@18';
import { MessageSquare, Terminal, Loader2, Send, Globe, Sparkles, Bot, User, PauseCircle, PlayCircle, StopCircle, Calculator, ListTodo, Settings2, Upload, Trash2, Plus, Video, PlusCircle } from 'lucide-react';



interface ChatPanelProps {
  history: ChatMessage[];
  input: string;
  setInput: (value: string) => void;
  onSend: (message: string, images: string[], videos: string[]) => void;
  loading: boolean;
  agentStatus: AgentStatus;
  onPauseAgent: () => void;
  onResumeAgent: () => void;
  estimatedTokens: number | null;
  tasks: TaskWithUsage[];
  taskGroups: TaskGroup[];
  onAddTask: (t: string) => void;
  onDeleteTask: (id: string) => void;
  activeModel: string;
  onSettingsClick: () => void;
  style?: React.CSSProperties;
}

export default function ChatPanel: React.FC<ChatPanelProps> = ({ 
  history, 
  input, 
  setInput, 
  onSend, 
  loading, 
  agentStatus,
  onPauseAgent,
  onResumeAgent,
  estimatedTokens,
  tasks,
  taskGroups,
  onAddTask,
  onDeleteTask,
  activeModel,
  onSettingsClick,
  style
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'plan'>('chat');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, loading, activeTab]);

  const processFiles = async (files: FileList | null) => {
    if (!files) return;

    const imagePromises: Promise<string>[] = [];
    const videoPromises: Promise<string>[] = [];

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        imagePromises.push(new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => { resolve(reader.result as string); };
          reader.readAsDataURL(file);
        }));
      } else if (file.type.startsWith('video/')) {
        videoPromises.push(new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => { resolve(reader.result as string); };
          reader.readAsDataURL(file);
        }));
      }
    });

    const newImages = await Promise.all(imagePromises);
    const newVideos = await Promise.all(videoPromises);
    setUploadedImages(prev => [...prev, ...newImages]);
    setUploadedVideos(prev => [...prev, ...newVideos]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendClick = () => {
    console.log('handleSendClick called', { input: input.trim(), images: uploadedImages.length, videos: uploadedVideos.length, loading, agentStatus });
    
    if (!input.trim() && uploadedImages.length === 0 && uploadedVideos.length === 0) {
      console.log('Empty input, not sending');
      return;
    }
    
    if (loading) {
      console.log('Already loading, not sending');
      return;
    }
    
    console.log('Calling onSend...');
    try {
    onSend(input, uploadedImages, uploadedVideos);
    setInput('');
    setUploadedImages([]);
    setUploadedVideos([]);
    } catch (error) {
      console.error('Error in handleSendClick:', error);
    }
  };

  const totalMediaCount = uploadedImages.length + uploadedVideos.length;

  return createElement('div', {className: 'flex flex-col border-r border-white/5 bg-[#09090b] h-full relative z-20 shadow-2xl', style: {{ width: style?.width || '350px', ...style }}, '{/* Header */}
      <div className="h-14 px-4 border-b border-white/5 flex items-center justify-between bg-[#0c0c0e]/80 backdrop-blur-md shrink-0">
        <div className="flex bg-[#18181b] p-0.5 rounded-lg border border-white/5">
             <button 
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}
             >
                createElement('MessageSquare', null) Chat
             </button>
             <button 
                onClick={() => setActiveTab('plan')}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${activeTab === 'plan' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}
             >
                createElement('ListTodo', null) Plan
                {tasks.filter(t => t.status === 'pending').length > 0 && (
                   createElement('span', {className: 'w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center text-[9px]'}, '{tasks.filter(t => t.status === 'pending').length}')
                )}
             </button>
        </div>
        
        {/* Agent Status Indicator */}
        <div className="flex items-center gap-2">
          {agentStatus === 'working' && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-400">
              createElement('Loader2', {className: 'animate-spin'})')}
          {agentStatus === 'paused' && (
             createElement('div', {className: 'px-2 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-[9px] font-bold text-slate-400'}, 'PAUSED')
          )}
          createElement('div', {className: 'w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}, null)
      </div>

      {/* Content Area */}
      {activeTab === 'chat' ? (
      <>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {history.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-40 select-none">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 rotate-3 border border-white/5">
                createElement('Terminal', {className: 'text-slate-400'})
                </div>
                createElement('p', {className: 'text-xs font-bold uppercase tracking-widest text-slate-500'}, 'Ready to Build')
            </div>
            )}

            {history.map((msg, i) => (
            <div key={i} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className="flex items-center gap-2 opacity-50 px-1 w-full justify-between">
                <div className="flex items-center gap-2">
                    {msg.role === 'user' ? (
                    <>
                        createElement('span', {className: 'text-[10px] font-bold uppercase tracking-wider text-slate-400'}, 'You')
                        createElement('User', null)
                    </>
                    ) : (
                    <>
                        createElement('Bot', null)
                        createElement('span', {className: 'text-[10px] font-bold uppercase tracking-wider text-indigo-400'}, 'Architect')
                    </>
                    )}
                </div>
                </div>

                <div className={`relative max-w-[92%] p-3.5 text-xs leading-relaxed shadow-lg group ${
                    msg.role === 'user' 
                    ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-2xl rounded-tr-sm border border-indigo-400/20' 
                    : 'bg-[#16161a] text-slate-300 rounded-2xl rounded-tl-sm border border-white/5'
                }`}>
                {msg.content}
                
                {msg.tokenUsage && (
                    <div className="absolute -bottom-5 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[9px] text-slate-500 font-mono bg-black/80 px-2 py-0.5 rounded border border-white/10 z-10 whitespace-nowrap">
                    createElement('span', {className: 'text-indigo-400'}, 'IN: {msg.tokenUsage.promptTokens}')
                    createElement('span', {className: 'text-emerald-400'}, 'OUT: {msg.tokenUsage.responseTokens}')
                    createElement('span', {className: 'font-bold text-slate-300'}, 'Σ {msg.tokenUsage.totalTokens}')
                    </div>
                )}
                </div>

                {msg.role === 'assistant' && msg.groundingMetadata?.groundingChunks && (
                <div className="max-w-[90%] flex flex-wrap gap-2 mt-1 pl-1">
                    {msg.groundingMetadata.groundingChunks.map((chunk: any, idx: number) => {
                    if (chunk.web?.uri) {
                        return createElement('a', {className: 'group flex items-center gap-1.5 px-2.5 py-1.5 bg-[#121214] hover:bg-indigo-900/20 border border-white/5 hover:border-indigo-500/30 rounded-md text-[10px] text-slate-400 hover:text-indigo-300 transition-all no-underline', target: '_blank', rel: 'noopener noreferrer'}, 'createElement('Globe', {className: 'group-hover:text-indigo-400 transition-colors'})
                            createElement('span', {className: 'truncate max-w-[180px] font-medium'}, '{chunk.web.title || new URL(chunk.web.uri).hostname}')');
                    }
                    return null;
                    })}
                </div>
                )}
            </div>
            ))}

            {loading && (
            <div className="flex flex-col gap-2 items-start animate-in fade-in duration-300">
                <div className="flex items-center gap-2 opacity-50 px-1">
                    createElement('Bot', null)
                    createElement('span', {className: 'text-[10px] font-bold uppercase tracking-wider text-indigo-400'}, '{agentStatus === 'planning' ? 'Planning Phases...' : 'Executing Phase...'}')
                </div>
                <div className="bg-[#16161a] border border-white/5 rounded-2xl rounded-tl-sm p-3.5 flex items-center gap-3">
                createElement('Loader2', {className: 'text-indigo-400 animate-spin'})
                <div className="flex gap-1">
                    createElement('div', {className: 'w-1.5 h-1.5 bg-indigo-500/50 rounded-full animate-bounce', style: {{ animationDelay: '0ms' }})
                    createElement('div', {className: 'w-1.5 h-1.5 bg-indigo-500/50 rounded-full animate-bounce', style: {{ animationDelay: '150ms' }})
                    createElement('div', {className: 'w-1.5 h-1.5 bg-indigo-500/50 rounded-full animate-bounce', style: {{ animationDelay: '300ms' }}, null)
                </div>
            </div>
            )}
            createElement('div', null, null)

        {/* Input Area */}
        <div className="p-4 bg-[#0c0c0e] border-t border-white/5">
            <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onSettingsClick}
                        className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-0.5 rounded transition-all"
                        title="Change AI Model"
                    >
                        createElement('Settings2', null)
                        createElement('span', {className: 'uppercase'}, '{activeModel.replace('gemini-', '').replace('claude-', '').split('-')[0]}')
                    </button>
                    
                    <div className="flex items-center gap-1 text-[9px] font-mono text-slate-600">
                        createElement('Calculator', null)
                        createElement('span', null, 'EST: {estimatedTokens ? estimatedTokens : '-'} Tok')
                    </div>
                </div>

                {agentStatus !== 'idle' && agentStatus !== 'finished' && (
                    <div className="flex items-center gap-1">
                        {agentStatus === 'working' || agentStatus === 'planning' ? (
                            <button onClick={onPauseAgent} className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-[9px] font-bold hover:bg-amber-500/20 transition-all">
                                createElement('PauseCircle', null) PAUSE
                            </button>
                        ) : (
                            <button onClick={onResumeAgent} className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-bold hover:bg-emerald-500/20 transition-all">
                                createElement('PlayCircle', null) RESUME
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Media Preview Grid */}
            {totalMediaCount > 0 && (
                <div className="mb-3 grid grid-cols-3 gap-2">
                    {uploadedImages.map((img, idx) => (
                        <div key={`img-${idx}`} className="relative aspect-square group rounded-lg overflow-hidden border border-white/10 bg-black">
                            createElement('img', {className: 'w-full h-full object-cover'})
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    onClick={() => removeImage(idx)}
                                    className="p-1.5 bg-red-500/80 text-white rounded-md hover:bg-red-600 transition-colors"
                                >
                                    createElement('Trash2', null)
                                </button>
                            </div>
                        </div>
                    ))}

                    {uploadedVideos.map((vid, idx) => (
                        <div key={`vid-${idx}`} className="relative aspect-square group rounded-lg overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                            createElement('video', {className: 'w-full h-full object-cover', ontrols: false})
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    onClick={() => removeVideo(idx)}
                                    className="p-1.5 bg-red-500/80 text-white rounded-md hover:bg-red-600 transition-colors"
                                >
                                    createElement('Trash2', null)
                                </button>
                            </div>
                            createElement('Video', {className: 'absolute text-white/70 pointer-events-none'})
                        </div>
                    ))}

                    {totalMediaCount < 5 && (
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square flex flex-col items-center justify-center border border-white/10 border-dashed rounded-lg hover:bg-white/5 text-slate-500 hover:text-indigo-400 transition-all"
                        >
                            createElement('Plus', null)
                            createElement('span', {className: 'text-[9px] font-bold mt-1'}, 'MORE')
                        </button>
                    )}
                </div>
            )}

            <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*,video/*" 
                multiple
                className="hidden" 
                onChange={handleImageUpload}
                disabled={loading || totalMediaCount >= 5}
            />

            <div 
                className="relative group flex items-center gap-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || totalMediaCount >= 5}
                className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Upload images/videos"
            >
                createElement('PlusCircle', null)
            </button>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if ((input.trim() || totalMediaCount > 0) && !loading) {
                      handleSendClick();
                    }
                  }
                }}
                placeholder={agentStatus === 'working' ? "Agent is active..." : "Describe your app or changes..."}
                disabled={loading && agentStatus !== 'paused'}
                className="flex-1 bg-[#18181b] text-xs text-slate-200 placeholder:text-slate-600 rounded-xl py-3.5 pl-4 pr-10 border border-white/5 focus:outline-none focus:border-indigo-500/40 focus:bg-[#1a1a1d] transition-all shadow-inner disabled:opacity-50"
            />
            <button 
                onClick={handleSendClick}
                disabled={(!input.trim() && totalMediaCount === 0) || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-0 disabled:scale-75 transition-all shadow-lg shadow-indigo-600/20"
            >
                createElement('Send', {fill: 'currentColor'})
            </button>
            </div>
        </div>
      </>
      ) : (
          createElement('TaskQueue', {onDelete: onDeleteTask, onAdd: onAddTask})
      )}
    </div>
  );
};
