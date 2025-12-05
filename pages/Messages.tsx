import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Thread, Message } from '../types';
import { dataService } from '../services/dataService';
import { useUser } from '../context/UserContext';
import { EmptyState } from '../components/EmptyState';
import { Send, Sparkles, MessageSquare } from 'lucide-react';

export const Messages: React.FC = () => {
  const { user } = useUser();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getThreads(user.id).then((data) => {
      setThreads(data);
      if (data.length > 0) setSelectedThread(data[0]);
      setLoading(false);
    });
  }, [user.id]);

  // Simulating message load when thread changes
  useEffect(() => {
    if (selectedThread) {
      dataService.getMessages(selectedThread.id).then(setMessages);
    }
  }, [selectedThread]);

  const handleSend = () => {
    if (!inputText.trim() || !selectedThread) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      thread_id: selectedThread.id,
      sender_id: user.id,
      content: inputText,
      created_at: new Date().toISOString()
    };
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  const handleAISmartReply = () => {
    setInputText("Let's schedule a time to dive deeper into the metrics.");
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Threads List */}
      <GlassCard className="w-1/3 p-0 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <h3 className="font-bold text-white">Inbox</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
             <div className="p-4 flex justify-center">
                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
             </div>
          ) : threads.length > 0 ? (
            threads.map(thread => {
             const otherParticipant = thread.participants.find(p => p.id !== user.id) || thread.participants[0];
             return (
              <div 
                key={thread.id} 
                onClick={() => setSelectedThread(thread)}
                className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${selectedThread?.id === thread.id ? 'bg-white/[0.08]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <img src={otherParticipant.avatar_url} alt="" className="w-10 h-10 rounded-full bg-slate-700" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h4 className="font-semibold text-slate-200 truncate">{otherParticipant.name}</h4>
                      <span className="text-xs text-slate-500">
                          {thread.last_message ? new Date(thread.last_message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{thread.last_message?.content || 'No messages yet'}</p>
                  </div>
                </div>
              </div>
             );
          })) : (
              <div className="p-4">
                  <EmptyState 
                    title="No messages" 
                    description="You haven't started any conversations yet."
                    className="border-none bg-transparent"
                  />
              </div>
          )}
        </div>
      </GlassCard>

      {/* Chat Area */}
      <GlassCard className="flex-1 p-0 flex flex-col relative overflow-hidden">
        {selectedThread ? (
          <>
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
              <h3 className="font-bold text-white">
                {selectedThread.participants.find(p => p.id !== user.id)?.name}
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                  messages.map(msg => {
                    const isMe = msg.sender_id === user.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
              ) : (
                  <div className="h-full flex items-center justify-center">
                      <p className="text-slate-500 text-sm">Start the conversation by sending a message.</p>
                  </div>
              )}
            </div>

            {/* AI Suggestion Chip */}
            <div className="absolute bottom-20 left-4">
              <button 
                onClick={handleAISmartReply}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-blue-400/30 text-xs text-blue-200 hover:bg-blue-500/20 transition-all backdrop-blur-md"
              >
                <Sparkles size={12} />
                AI Suggestion: Schedule a call
              </button>
            </div>

            <div className="p-4 border-t border-white/5 bg-white/[0.02]">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500/50 text-slate-200"
                />
                <button 
                  onClick={handleSend}
                  className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p>Select a thread to start messaging</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};