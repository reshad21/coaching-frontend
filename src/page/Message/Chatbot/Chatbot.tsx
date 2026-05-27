import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    type ChatHistoryMessage,
    useSendChatMessageMutation,
} from "@/redux/api/aiChat/aiChatApi";
import {
    Bot,
    Copy,
    Loader2,
    Send,
    Sparkles,
    Trash2,
    User,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
type ChatMessage = {
    id: string;
    role: "user" | "model";
    content: string;
    createdAt: number;
};

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const STORAGE_KEY = "educare-ai-chat-history";
const MAX_STORED_MESSAGES = 50;

const quickPrompts = [
    "সব student-এর তালিকা দাও",
    "এই মাসে কারা payment করেছে?",
    "কোন student-এর payment বাকি আছে?",
    "মোট কতজন student আছে?",
    "Student ID দিয়ে কাউকে খুঁজে দাও",
];

// App-এর brand color — cyan gradient
// সব জায়গায় এই color ব্যবহার করা হয়েছে যাতে consistent থাকে
const BRAND_GRADIENT = "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)";
const BRAND_COLOR_FROM = "#06b6d4"; // cyan-500
// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const createId = () => crypto.randomUUID();

const readStoredMessages = (): ChatMessage[] => {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

// UI → Gemini backend format
// FIX: শুধু আগের messages পাঠানো হয়, নতুন user message বাদ।
const toHistory = (messages: ChatMessage[]): ChatHistoryMessage[] =>
    messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
    }));

const getChatErrorMessage = (err: unknown): string => {
    if (typeof err === "string") return err;
    if (err && typeof err === "object") {
        const e = err as {
            data?: { message?: string; error?: string } | string;
            error?: string;
            message?: string;
        };
        if (typeof e.data === "string") return e.data;
        if (e.data && typeof e.data === "object") {
            return e.data.message || e.data.error || e.message || e.error || "Chat request failed.";
        }
        return e.message || e.error || "Chat request failed.";
    }
    return "Chat request failed.";
};

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
const Chatbot = () => {

    const [messages, setMessages] = useState<ChatMessage[]>(() => readStoredMessages());
    const [input, setInput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [sendChatMessage, { isLoading }] = useSendChatMessageMutation();

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const canSend = useMemo(
        () => input.trim().length > 0 && !isLoading,
        [input, isLoading]
    );

    // শেষ ৫০টা message localStorage-এ রাখো
    useEffect(() => {
        const trimmed = messages.slice(-MAX_STORED_MESSAGES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    }, [messages]);

    // নতুন message আসলে নিচে scroll করো
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length, isLoading]);

    // Textarea auto-resize
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }, [input]);

    // ─────────────────────────────────────────────────────────
    // SEND HANDLER
    // FIX: history-তে নতুন user message নেই — duplicate বাদ।
    // ─────────────────────────────────────────────────────────
    const handleSend = async (overrideMessage?: string) => {
        const message = (overrideMessage ?? input).trim();
        if (!message || isLoading) return;

        setError(null);

        const userMsg: ChatMessage = {
            id: createId(),
            role: "user",
            content: message,
            createdAt: Date.now(),
        };

        const historyToSend = toHistory(messages);

        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        try {
            const response = await sendChatMessage({
                message,
                history: historyToSend,
            }).unwrap();

            const reply =
                response?.data?.reply?.trim() ||
                response?.message?.trim() ||
                "No reply returned.";

            const botMsg: ChatMessage = {
                id: createId(),
                role: "model",
                content: reply,
                createdAt: Date.now(),
            };

            setMessages((prev) => [...prev, botMsg]);

        } catch (err) {
            console.error(err);
            setError(getChatErrorMessage(err));
        }
    };

    const handleQuickPrompt = (prompt: string) => void handleSend(prompt);

    const handleClear = () => {
        setMessages([]);
        setInput("");
        setError(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied!");
        } catch {
            toast.error("Copy failed");
        }
    };

    // ─────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────
    return (
        <div className="mx-auto flex h-[calc(100vh-8rem)] max-h-[800px] min-h-[500px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{ border: `1.5px solid ${BRAND_COLOR_FROM}33` }}
        >

            {/* ══ HEADER — Brand gradient background ══════════ */}
            <div
                className="shrink-0 px-5 py-3.5"
                style={{ background: BRAND_GRADIENT }}
            >
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        {/* AI Avatar */}
                        <div className="relative">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/30">
                                <Bot className="h-5 w-5 text-white" />
                            </div>
                            {/* Online dot */}
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-400" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold leading-none text-white">
                                TalkToAi
                            </p>
                            <p className="mt-0.5 text-xs text-white/70">
                                {isLoading ? "লিখছে..." : "● সক্রিয়"}
                            </p>
                        </div>
                    </div>

                    {/* Message count + Clear */}
                    <div className="flex items-center gap-3">
                        {messages.length > 0 && (
                            <span className="text-xs text-white/60">
                                {messages.length} টি message
                            </span>
                        )}
                        <button
                            onClick={handleClear}
                            className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs text-white/90 transition-all hover:bg-white/25 active:scale-95"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Clear
                        </button>
                    </div>
                </div>

                {/* Quick Prompts — header-এর ভেতরে, gradient-এ */}
                <div className="mt-3 flex flex-wrap gap-2">
                    {quickPrompts.map((q) => (
                        <button
                            key={q}
                            disabled={isLoading}
                            onClick={() => handleQuickPrompt(q)}
                            className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs text-white/90 backdrop-blur-sm transition-all hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Sparkles className="h-3 w-3" />
                            {q}
                        </button>
                    ))}
                </div>
            </div>

            {/* ══ MESSAGES AREA ════════════════════════════════ */}
            <div className="relative min-h-0 flex-1 bg-background">
                <ScrollArea className="h-full px-4 py-5">

                    {/* Empty State */}
                    {messages.length === 0 && !isLoading && (
                        <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-4 py-16 text-center">
                            {/* Gradient icon box */}
                            <div
                                className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
                                style={{ background: BRAND_GRADIENT }}
                            >
                                <Bot className="h-8 w-8 text-white" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-foreground">
                                    কথোপকথন শুরু করো
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    উপরের quick prompts ব্যবহার করো বা নিজে লিখে পাঠাও।
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Message Bubbles */}
                    <div className="space-y-4">
                        {messages.map((m) => {
                            const isUser = m.role === "user";

                            return (
                                <div
                                    key={m.id}
                                    className={cn(
                                        "flex min-w-0 gap-2.5",
                                        isUser ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    {/* Avatar */}
                                    <div
                                        className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                                        style={isUser
                                            ? { background: BRAND_GRADIENT }
                                            : { background: "#f1f5f9" }
                                        }
                                    >
                                        {isUser
                                            ? <User className="h-3.5 w-3.5 text-white" />
                                            : <Bot className="h-3.5 w-3.5 text-cyan-600" />
                                        }
                                    </div>

                                    {/* Bubble */}
                                    <div
                                        className={cn(
                                            "group relative max-w-[75%] min-w-0 rounded-2xl px-4 py-2.5 shadow-sm",
                                            isUser
                                                ? "rounded-tr-sm text-white"
                                                : "rounded-tl-sm bg-slate-100 text-foreground dark:bg-muted"
                                        )}
                                        style={isUser ? { background: BRAND_GRADIENT } : {}}
                                    >
                                        {/* Message text */}
                                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                                            {m.content}
                                        </p>

                                        {/* Timestamp + Copy */}
                                        <div className={cn(
                                            "mt-1.5 flex items-center gap-2",
                                            isUser ? "flex-row-reverse" : "flex-row"
                                        )}>
                                            <span className={cn(
                                                "text-[10px]",
                                                isUser ? "text-white/50" : "text-muted-foreground/60"
                                            )}>
                                                {new Date(m.createdAt).toLocaleTimeString("bn-BD", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>

                                            {/* Copy — hover-এ দেখা যাবে */}
                                            <button
                                                onClick={() => void handleCopy(m.content)}
                                                className={cn(
                                                    "flex items-center gap-1 text-[10px] opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100",
                                                    isUser ? "text-white" : "text-muted-foreground"
                                                )}
                                            >
                                                <Copy className="h-2.5 w-2.5" />
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className="flex items-end gap-2.5">
                                <div
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                                    style={{ background: "#f1f5f9" }}
                                >
                                    <Bot className="h-3.5 w-3.5 text-cyan-600" />
                                </div>
                                <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 shadow-sm dark:bg-muted">
                                    <div className="flex items-center gap-1">
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500 [animation-delay:0ms]" />
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500 [animation-delay:150ms]" />
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500 [animation-delay:300ms]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div ref={bottomRef} />
                </ScrollArea>

            </div>

            {/* ══ ERROR BANNER ═════════════════════════════════ */}
            {error && (
                <div className="shrink-0 border-t bg-red-50 px-4 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
                    ⚠️ {error}
                </div>
            )}

            {/* ══ INPUT AREA ═══════════════════════════════════ */}
            <div className="shrink-0 border-t bg-background px-4 py-3">

                {/* Input box — focus করলে cyan border আসবে */}
                <div
                    className="flex items-end gap-2 rounded-xl border bg-slate-50 px-3 py-2 transition-all focus-within:bg-background focus-within:shadow-md dark:bg-muted/30"
                    style={{ borderColor: "#e2e8f0" }}
                    onFocus={(e) => e.currentTarget.style.borderColor = BRAND_COLOR_FROM}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                >
                    {/* Auto-resize Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={input}
                        rows={1}
                        disabled={isLoading}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                void handleSend();
                            }
                        }}
                        placeholder="কিছু জিজ্ঞেস করো... (Enter = Send)"
                        className="max-h-[120px] min-h-[24px] flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                    />

                    {/* Send Button — brand gradient */}
                    <button
                        onClick={() => void handleSend()}
                        disabled={!canSend}
                        className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                        style={canSend
                            ? { background: BRAND_GRADIENT, color: "white" }
                            : { background: "#e2e8f0", color: "#94a3b8" }
                        }
                    >
                        {isLoading
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Send className="h-4 w-4" />
                        }
                    </button>
                </div>

                <p className="mt-1.5 text-center text-[10px] text-muted-foreground/50">
                    Shift+Enter = নতুন লাইন
                </p>
            </div>
        </div>
    );
};

export default Chatbot;