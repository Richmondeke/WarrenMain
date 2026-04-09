"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, Sparkles } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface ReportChatProps {
    ticker: string;
    companyName: string;
    filingUrl: string | null;
}

export function ReportChat({ ticker, companyName, filingUrl }: ReportChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: `Hi, I'm the Warrenintel AI. I have the latest SEC 10-K annual report for ${companyName} loaded into my context. What would you like to know about their operations, risks, or financial position?` }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!input.trim() || !filingUrl) return;

        const userMessage = input.trim();
        setInput("");

        const updatedMessages: Message[] = [...messages, { role: "user", content: userMessage }];
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat-report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticker,
                    companyName,
                    filingUrl,
                    messages: updatedMessages
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to fetch response");
            }

            const data = await res.json();

            setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);

        } catch (error: any) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: `❌ Error: ${error.message || "I'm sorry, I couldn't process your request right now. Please try again later."}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!filingUrl) {
        return (
            <div className="w-full h-80 flex flex-col items-center justify-center bg-card/40 backdrop-blur-md rounded-3xl border border-glass-border p-8 text-center shadow-premium">
                <div className="p-4 rounded-2xl bg-secondary/50 border border-glass-border mb-6">
                    <Sparkles className="w-8 h-8 text-muted-foreground opacity-40" />
                </div>
                <h3 className="text-lg font-black tracking-tighter text-foreground mb-2">Intelligence Offline</h3>
                <p className="text-muted-foreground text-sm font-medium opacity-60 max-w-xs">Chat is unavailable because no structured SEC filing was found for {ticker}.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-card/40 backdrop-blur-md rounded-[32px] border border-glass-border shadow-premium overflow-hidden flex flex-col h-[700px]">
            {/* Chat header */}
            <div className="px-8 py-6 border-b border-glass-border bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-black text-foreground tracking-tight text-lg">Analyze {ticker} 10-K</h3>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Strategic Intelligence Bot v2.0</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${msg.role === "user" ? "bg-secondary border-glass-border text-muted-foreground" : "bg-primary border-primary/20 text-primary-foreground"}`}>
                            {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>

                        <div className={`max-w-[85%] rounded-[24px] px-6 py-5 shadow-sm ${msg.role === "user" ? "bg-secondary/40 text-foreground rounded-tr-none border border-glass-border" : "bg-primary/10 text-foreground rounded-tl-none border border-primary/20"}`}>
                            <div className="text-sm leading-relaxed space-y-3 whitespace-pre-wrap font-medium font-sans">
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-5 flex-row">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary border border-primary/20 text-primary-foreground flex items-center justify-center shadow-sm">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="bg-primary/5 backdrop-blur-sm rounded-[24px] px-6 py-5 rounded-tl-none border border-primary/10 flex items-center gap-3 shadow-premium">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span className="text-sm text-muted-foreground font-black uppercase tracking-widest text-[10px]">Processing 10-K Vectors...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-glass-border bg-background/40 backdrop-blur-md">
                <form onSubmit={handleSend} className="relative flex items-end">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Ask a strategic question (e.g. 'Summarize liquidity risks')..."
                        className="w-full bg-background/50 border border-glass-border rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground/50 resize-none min-h-[60px] max-h-[160px] font-medium shadow-inner transition-all"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-3 bottom-3 p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-30 disabled:grayscale transition-all shadow-lg active:scale-95"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
                <div className="mt-4 flex items-center justify-center gap-2 opacity-40">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                        Always verify critical financial data against official filings.
                    </p>
                </div>
            </div>
        </div>
    );
}
