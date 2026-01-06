/**
 * MessagingScreen Component
 * Props: { currentUserEmail?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState, useEffect, useRef, useCallback  } from 'https://esm.sh/react@18';
import { Send, ArrowLeft, MessageCircle, Inbox } from 'lucide-react';

interface Message {
  id: string;
  senderEmail: string;
  recipientEmail: string;
  text: string;
  timestamp: string;
}

const MessagingScreen = ({
  currentUserEmail,
  onBack,
  messages,
  setMessages,
  currentChatPartnerEmail,
  setCurrentChatPartnerEmail,
  unreadCounts,
  setUnreadCounts
}: {
  currentUserEmail: string;
  onBack: () => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  currentChatPartnerEmail: string | null;
  setCurrentChatPartnerEmail: (email: string | null) => void;
  unreadCounts: Record<string, number>;
  setUnreadCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) => {
  const [newMessageText, setNewMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userRelatedMessages = messages.filter(
    msg => msg.senderEmail === currentUserEmail || msg.recipientEmail === currentUserEmail
  );

  const conversationPartners = Array.from(
    new Set(
      userRelatedMessages.flatMap(msg => [msg.senderEmail, msg.recipientEmail])
    )
  ).filter(email => email !== currentUserEmail);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoading(false), 500);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (currentChatPartnerEmail) {
      setUnreadCounts(prevCounts => {
        if (prevCounts[currentChatPartnerEmail] > 0) {
          return { ...prevCounts, [currentChatPartnerEmail]: 0 };
        }
        return prevCounts;
      });
    }
  }, [currentChatPartnerEmail, setUnreadCounts]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChatPartnerEmail, messages]);

  const handleSendMessage = useCallback(() => {
    if (newMessageText.trim() && currentChatPartnerEmail) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderEmail: currentUserEmail,
        recipientEmail: currentChatPartnerEmail,
        text: newMessageText.trim(),
        timestamp: new Date().toISOString()
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setNewMessageText('');
    }
  }, [newMessageText, currentUserEmail, currentChatPartnerEmail, setMessages]);

  const currentConversation = messages
    .filter(
      msg =>
        (msg.senderEmail === currentUserEmail && msg.recipientEmail === currentChatPartnerEmail) ||
        (msg.senderEmail === currentChatPartnerEmail && msg.recipientEmail === currentUserEmail)
    )
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const renderConversationSkeleton = () => (
    <div className="flex-1 p-4 space-y-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className={`flex ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}
        >
          <Skeleton className="h-16 w-40" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full bg-slate-900 text-white">
      <HeaderBar
        title="Messages"
        leftSlot={(
          <button
            onClick={onBack}
            className="flex items-center justify-center h-[50px] w-[50px] text-indigo-400 hover:text-indigo-300 active:text-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            aria-label="Back"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        sticky
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 bg-slate-800 border-r border-slate-700 overflow-y-auto hidden md:block">
          <div className="p-4 border-b border-slate-700 flex items-center space-x-2">
            <MessageCircle size={18} className="text-slate-300" />
            <h2 className="text-xl font-semibold">Conversations</h2>
          </div>
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} className="h-10 w-full" />
              ))}
            </div>
          ) : conversationPartners.length === 0 ? (
            <div className="p-4 text-slate-400 text-sm flex flex-col items-center text-center space-y-2">
              <Inbox size={20} className="text-slate-500" />
              <p>No active conversations yet.</p>
            </div>
          ) : (
            <div className="space-y-2 p-4 animate-[fadeIn_220ms_ease-out]">
              {conversationPartners.map((partnerEmail) => (
                <button
                  key={partnerEmail}
                  onClick={() => setCurrentChatPartnerEmail(partnerEmail)}
                  className={`relative w-full text-left p-3 rounded-lg transition-colors duration-150 min-h-[50px]
                    ${currentChatPartnerEmail === partnerEmail ? 'bg-indigo-600' : 'bg-slate-700 hover:bg-slate-600 active:bg-slate-500'}
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800
                  `}
                >
                  <p className="font-semibold">{partnerEmail.split('@')[0]}</p>
                  {unreadCounts && unreadCounts[partnerEmail] > 0 && (
                    <span className="absolute top-1 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCounts[partnerEmail]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1">
          {currentChatPartnerEmail ? (
            <>
              <div className="py-3 px-4 bg-slate-800 border-b border-slate-700 flex items-center justify-center relative md:hidden">
                 <button
                   onClick={() => setCurrentChatPartnerEmail(null)}
                   className="absolute left-4 text-indigo-400 hover:text-indigo-300 active:text-indigo-200 h-[44px] w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                   aria-label="Back"
                 >
                   <ArrowLeft size={20} />
                 </button>
                 <h2 className="text-lg font-bold">{currentChatPartnerEmail.split('@')[0]}</h2>
              </div>
              {isLoading ? (
                renderConversationSkeleton()
              ) : (
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900 animate-[fadeIn_220ms_ease-out]">
                  {currentConversation.length === 0 ? (
                    <p className="text-slate-400 text-center">Start a conversation with {currentChatPartnerEmail.split('@')[0]}.</p>
                  ) : (
                    currentConversation.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderEmail === currentUserEmail ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg shadow-md min-h-[44px] transition-transform duration-150 ${
                            msg.senderEmail === currentUserEmail
                              ? 'bg-blue-600 rounded-br-none'
                              : 'bg-slate-700 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm font-semibold mb-1">
                            {msg.senderEmail === currentUserEmail ? 'You' : msg.senderEmail.split('@')[0]}
                          </p>
                          <p className="text-base">{msg.text}</p>
                          <p className="text-xs text-slate-300 mt-1 text-right">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
              <div className="p-4 border-t border-slate-700 bg-slate-800 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 h-12 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                />
                <button
                  onClick={handleSendMessage}
                  className="h-12 w-12 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center p-4">
              {isLoading ? (
                <div className="w-full max-w-sm space-y-2 md:hidden">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                    <MessageCircle size={26} className="text-slate-400" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Select a Conversation</h2>
                  <p className="text-slate-400 mb-6 max-w-sm">Choose a contact from the list or respond to a new message to start chatting.</p>
                </>
              )}
              <div className="w-full max-w-sm space-y-2 md:hidden">
                {!isLoading && conversationPartners.length === 0 && (
                  <p className="text-slate-400 text-sm flex flex-col items-center space-y-2">
                    <Inbox size={18} className="text-slate-500" />
                    <span>No active conversations yet.</span>
                  </p>
                )}
                {!isLoading && conversationPartners.length > 0 && conversationPartners.map((partnerEmail) => (
                  <button
                    key={partnerEmail}
                    onClick={() => setCurrentChatPartnerEmail(partnerEmail)}
                    className="relative w-full text-left p-3 rounded-lg bg-slate-700 hover:bg-slate-600 active:bg-slate-500 transition-colors duration-150 min-h-[50px] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  >
                    <p className="font-semibold">{partnerEmail.split('@')[0]}</p>
                    {unreadCounts && unreadCounts[partnerEmail] > 0 && (
                      <span className="absolute top-1 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCounts[partnerEmail]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingScreen;
