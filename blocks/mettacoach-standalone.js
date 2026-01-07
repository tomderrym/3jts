/**
 * MettaCoach Component
 * Props: { amount?: any, activity?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { MessageCircle, Send, Sparkles, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: number;
}

interface MettaCoachProps {
  currentEnergy?: string;
  userProgress?: {[key: string]: number};
  onXPEarned?: (amount: number, activity: string) => void;
  onClose?: () => void;
}

export default function MettaCoach: React.FC<MettaCoachProps> = ({ 
  currentEnergy = 'peace', 
  userProgress = {}, 
  onXPEarned,
  onClose 
}) => {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'coach',
      content: "Welcome, dear one. I am here to guide you on your journey through the PLIBHU energies. How are you feeling today?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (customMessage?: string) => {
    const messageText = customMessage || input;
    if (!messageText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-291c16de/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          message: messageText,
          currentEnergy,
          userProgress
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'coach',
        content: data.reply,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, coachMessage]);
      onXPEarned?.(5, 'Deep Reflection');
    } catch (error) {
      console.error('Error getting AI response:', error);
      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'coach',
        content: "I apologize, but I'm having trouble connecting to the universal wisdom right now. Please try again in a moment.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, coachMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedPrompts = [
    "How do I find inner peace?",
    "I'm struggling with self-love",
    "Help me understand my purpose",
    "I feel disconnected from myself",
  ];

  return createElement('div', {className: 'space-y-4'}, '<Card className="p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/30">
        <div className="flex items-start gap-3">
          createElement('Sparkles', {className: 'w-6 h-6 text-violet-400 flex-shrink-0 mt-1'})
          <div>
            createElement('h3', {className: 'text-lg mb-2'}, 'Your Metta Coach')
            createElement('p', {className: 'text-sm text-slate-300'}, 'I'm here to guide you with compassion and wisdom. Share what's on your heart,
              and I'll offer reflections drawn from ancient wisdom and modern understanding.')
          </div>
        </div>
      </Card>

      <Card className="bg-slate-900/50 border-slate-700/50 overflow-hidden">
        <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'coach'
                    ? 'bg-gradient-to-br from-violet-500 to-purple-500'
                    : 'bg-blue-500'
                }`}>
                  {message.role === 'coach' ? (
                    createElement('Sparkles', {className: 'w-4 h-4 text-white'})
                  ) : (
                    createElement('MessageCircle', {className: 'w-4 h-4 text-white'})
                  )}
                </div>
                
                <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.role === 'coach'
                      ? 'bg-slate-800/50 text-slate-100'
                      : 'bg-blue-500/20 text-blue-100'
                  }`}>
                    createElement('p', {className: 'text-sm leading-relaxed whitespace-pre-wrap'}, '{message.content}')
                  </div>
                  createElement('span', {className: 'text-xs text-slate-500 mt-1 block px-2'}, '{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}')
                </div>'))}
            {isTyping && (
              <div className="flex gap-3 flex-row">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-violet-500 to-purple-500">
                  createElement('Sparkles', {className: 'w-4 h-4 text-white'})
                </div>
                <div className="bg-slate-800/50 text-slate-100 px-4 py-3 rounded-2xl">
                  <div className="flex items-center gap-1">
                    createElement('span', {className: 'w-2 h-2 bg-slate-400 rounded-full animate-bounce', style: {{ animationDelay: '0ms' }})
                    createElement('span', {className: 'w-2 h-2 bg-slate-400 rounded-full animate-bounce', style: {{ animationDelay: '150ms' }})
                    createElement('span', {className: 'w-2 h-2 bg-slate-400 rounded-full animate-bounce', style: {{ animationDelay: '300ms' }})
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-slate-700 p-4 space-y-3">
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map(prompt => (
                createElement('button', null, 'sendMessage(prompt)}
                  disabled={isTyping}
                  className="text-xs px-3 py-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  {prompt}')
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your heart..."
              disabled={isTyping}
              className="flex-1 bg-slate-800 border-slate-700"
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className="bg-violet-500 hover:bg-violet-600"
            >
              {isTyping ? createElement('Loader2', {className: 'w-4 h-4 animate-spin'}) : createElement('Send', {className: 'w-4 h-4'})}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};