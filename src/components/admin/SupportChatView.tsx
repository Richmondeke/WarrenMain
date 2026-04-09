"use client";

import { useEffect, useState } from "react";
import { Search, Send, MoreVertical, Phone, Video, Search as SearchIcon, Paperclip, Smile, ShieldCheck, User, CreditCard, Clock, Activity } from "lucide-react";
import { db } from "@/lib/firebase/config";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { AdminHeader } from "./AdminShared";

interface ChatSession {
    id: string;
    name: string;
    lastMsg: string;
    time?: any;
    unread: number;
    online: boolean;
    firm: string;
}

interface ChatMessage {
    id: string;
    text: string;
    sender: 'admin' | 'user';
    timestamp: any;
}

export default function SupportChatView() {
    const [chats, setChats] = useState<ChatSession[]>([]);
    const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "support_chats"), orderBy("lastActivity", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ChatSession[];
            setChats(chatList);
            if (chatList.length > 0 && !activeChat) {
                setActiveChat(chatList[0]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!activeChat) return;

        const q = query(
            collection(db, "support_chats", activeChat.id, "messages"),
            orderBy("timestamp", "asc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ChatMessage[];
            setMessages(msgList);
        });

        return () => unsubscribe();
    }, [activeChat]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || !activeChat) return;

        const text = inputText;
        setInputText("");

        try {
            await addDoc(collection(db, "support_chats", activeChat.id, "messages"), {
                text,
                sender: 'admin',
                timestamp: serverTimestamp()
            });

            await setDoc(doc(db, "support_chats", activeChat.id), {
                lastMsg: text,
                lastActivity: serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-zinc-950 overflow-hidden font-sans border-l border-zinc-900">
            <div className="p-10 pb-0">
                <AdminHeader
                    title="Concierge Support"
                    description="High-fidelity secure links with institutional investors."
                />
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Pane: Chat List */}
                <div className="w-80 lg:w-96 border-r border-zinc-900 flex flex-col bg-zinc-950">
                    <div className="p-6 border-b border-zinc-900">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                            <input
                                type="text"
                                placeholder="Find investor or firm..."
                                className="w-full pl-11 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 text-xs text-white focus:border-zinc-700 focus:ring-0 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setActiveChat(chat)}
                                className={`p-6 border-b border-zinc-900/50 cursor-pointer transition-all hover:bg-zinc-900/50 relative group
                  ${activeChat?.id === chat.id ? 'bg-zinc-900 border-r-2 border-r-white' : ''}`}
                            >
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-serif text-xs">
                                            {chat.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </div>
                                        {chat.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-950"></div>}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-serif font-medium text-white truncate text-sm">{chat.name}</h3>
                                            <span className="text-[9px] font-sans font-bold text-zinc-600 uppercase tracking-widest">
                                                {typeof chat.time === 'string' ? chat.time : 'Just now'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-500 truncate font-sans">{chat.lastMsg}</p>
                                    </div>
                                </div>
                                {chat.unread > 0 && (
                                    <div className="absolute top-6 right-6 w-4 h-4 bg-white text-zinc-950 text-[9px] font-bold rounded-full flex items-center justify-center">
                                        {chat.unread}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle Pane: Active Chat */}
                <div className="flex-grow flex flex-col min-w-0 bg-zinc-950/50">
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-16 border-b border-zinc-900 px-8 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-serif text-xs">
                                        {activeChat.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="font-serif font-medium text-white text-sm tracking-tight leading-none mb-1">{activeChat.name}</h2>
                                        <p className="text-[10px] text-zinc-500 font-sans uppercase tracking-widest flex items-center gap-1.5">
                                            {activeChat.online ? <span className="bg-emerald-500 w-1.5 h-1.5 rounded-full inline-block pulse-subtle"></span> : <span className="bg-zinc-700 w-1.5 h-1.5 rounded-full inline-block"></span>}
                                            {activeChat.online ? 'Real-time' : 'Away'} • {activeChat.firm}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-zinc-900 rounded-none transition-colors text-zinc-500 hover:text-white"><Phone className="w-4 h-4" /></button>
                                    <button className="p-2 hover:bg-zinc-900 rounded-none transition-colors text-zinc-500 hover:text-white"><Video className="w-4 h-4" /></button>
                                    <button className="p-2 hover:bg-zinc-900 rounded-none transition-colors text-zinc-500 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-grow overflow-y-auto p-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 to-transparent">
                                <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                                    <div className="flex justify-center mb-4">
                                        <span className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-zinc-600 px-4 py-1.5 border border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">Secure Institutional Link Established</span>
                                    </div>

                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex items-end gap-3 max-w-[80%] ${msg.sender === 'admin' ? 'self-end' : 'self-start'}`}>
                                            {msg.sender === 'user' && <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 text-[9px] font-serif uppercase">{activeChat.name.split(' ').map(n => n[0]).join('')}</div>}
                                            <div className={`p-5 text-sm leading-relaxed border ${msg.sender === 'admin' ? 'bg-white text-zinc-950 border-white' : 'bg-zinc-900 text-zinc-300 border-zinc-800'}`}>
                                                <p className="font-sans">{msg.text}</p>
                                                <span className={`text-[9px] uppercase tracking-wider font-bold mt-3 block ${msg.sender === 'admin' ? 'text-zinc-500' : 'text-zinc-600'}`}>
                                                    {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                                                </span>
                                            </div>
                                            {msg.sender === 'admin' && <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-950 font-serif font-bold text-[9px]">WI</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Chat Input */}
                            <div className="p-8 bg-zinc-950 border-t border-zinc-900">
                                <div className="max-w-3xl mx-auto flex items-end gap-4">
                                    <div className="flex-grow bg-zinc-900/50 border border-zinc-800 p-4 transition-all focus-within:border-zinc-700">
                                        <textarea
                                            placeholder="Draft institutional response..."
                                            className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none h-10 py-1 placeholder:text-zinc-700 text-white font-sans"
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                        ></textarea>
                                        <div className="flex justify-between items-center pt-3 border-t border-zinc-800 mt-2">
                                            <div className="flex gap-1">
                                                <button className="p-2 hover:bg-zinc-800 text-zinc-600 hover:text-white transition-colors"><Paperclip className="w-3.5 h-3.5" /></button>
                                                <button className="p-2 hover:bg-zinc-800 text-zinc-600 hover:text-white transition-colors"><Smile className="w-3.5 h-3.5" /></button>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-sans font-bold text-zinc-700 uppercase tracking-widest hidden sm:block">Institutional Dispatch</span>
                                                <button
                                                    onClick={handleSendMessage}
                                                    className="bg-white text-zinc-950 px-4 py-2 text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center gap-2"
                                                >
                                                    Send <Send className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                            <Activity className="w-12 h-12 text-zinc-500 mb-4" />
                            <p className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-500">Awaiting Signal Selection</p>
                        </div>
                    )}
                </div>

                {/* Right Pane: User Context */}
                <div className="hidden xl:flex w-80 border-l border-zinc-900 flex-col bg-zinc-950 p-8 overflow-y-auto">
                    {activeChat ? (
                        <>
                            <div className="text-center mb-10">
                                <div className="w-20 h-20 rounded-full bg-zinc-900 mx-auto flex items-center justify-center text-zinc-500 font-serif text-2xl mb-4 border border-zinc-800">
                                    {activeChat.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <h3 className="text-lg font-serif font-medium text-white tracking-tight">{activeChat.name}</h3>
                                <p className="text-xs text-zinc-500 font-sans tracking-wide uppercase mt-1">Principal, {activeChat.firm}</p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <span className="text-[10px] font-sans font-bold text-zinc-400 uppercase tracking-widest">Enterprise Tier</span>
                                    </div>
                                    <span className="text-[9px] font-sans font-bold text-emerald-500 tracking-widest">VERIFIED</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-900/50 p-4 border border-zinc-900">
                                        <p className="text-[9px] font-sans font-bold text-zinc-600 uppercase tracking-widest mb-1.5">LTV</p>
                                        <p className="font-serif font-medium text-white text-sm">$12.4k</p>
                                    </div>
                                    <div className="bg-zinc-900/50 p-4 border border-zinc-900">
                                        <p className="text-[9px] font-sans font-bold text-zinc-600 uppercase tracking-widest mb-1.5">Tickets</p>
                                        <p className="font-serif font-medium text-white text-sm">1 Active</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-zinc-600 mb-6 flex items-center gap-2">
                                        <Activity className="w-3 h-3" /> Recent Intel Usage
                                    </h4>
                                    <div className="space-y-5">
                                        {[
                                            { action: "Viewed Africa Fintech Report", time: "2h ago", icon: Clock },
                                            { action: "Ran Deal Sourcing Query", time: "1d ago", icon: SearchIcon },
                                            { action: "Updated CRM Pipeline", time: "2d ago", icon: User },
                                        ].map((activity, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="p-2 h-fit bg-zinc-900 border border-zinc-800">
                                                    <activity.icon className="w-3 h-3 text-zinc-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-serif text-zinc-400 tracking-tight truncate">{activity.action}</p>
                                                    <p className="text-[9px] text-zinc-600 mt-1 font-sans uppercase tracking-widest">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-zinc-900 border border-zinc-800 text-zinc-500 font-sans font-bold text-[10px] uppercase tracking-widest hover:text-white hover:border-zinc-700 transition-colors">
                                    Full Audit Log
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-zinc-800 font-sans text-[10px] text-center uppercase tracking-widest">
                            Select context for deeper telemetry
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
