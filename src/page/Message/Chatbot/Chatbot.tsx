import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
    ChevronDown,
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
    "কোন ক্লাসে কতজন student আছে?",
    "Student ID দিয়ে কাউকে খুঁজে দাও",
    "মোট কতজন student আছে?",
];

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
// duplicate message prevent করে।
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
    const [showScrollBtn, setShowScrollBtn] = useState(false);

    const [sendChatMessage, { isLoading }] = useSendChatMessageMutation();

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const canSend = useMemo(
        () => input.trim().length > 0 && !isLoading,
        [input, isLoading]
    );

    // FIX: শেষ ৫০টা message localStorage-এ রাখো
    useEffect(() => {
        const trimmed = messages.slice(-MAX_STORED_MESSAGES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    }, [messages]);

    // নতুন message আসলে নিচে scroll করো
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length, isLoading]);

    // Textarea auto-resize — content অনুযায়ী height বাড়বে
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }, [input]);

    // ─────────────────────────────────────────────────────────
    // SEND HANDLER
    // FIX: history-তে নতুন user message নেই — duplicate বাদ।
    // overrideMessage দিলে quick prompt সরাসরি send হয়।
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

        // FIX: messages (পুরনো) থেকে history তৈরি করো
        // userMsg এখনো state-এ নেই তাই duplicate হবে না
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

    // Quick prompt — সরাসরি send করো, শুধু input-এ না বসিয়ে
    const handleQuickPrompt = (prompt: string) => {
        void handleSend(prompt);
    };

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

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // ─────────────────────────────────────────────────────────
    // RENDER — Single Chatbox (একটাই box)
    // ─────────────────────────────────────────────────────────
    return (
        <div className="mx-auto flex h-[calc(100vh-8rem)] max-h-[800px] min-h-[500px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border bg-background shadow-xl">

            {/* ══ HEADER ══════════════════════════════════════ */}
            <div className="flex shrink-0 items-center justify-between border-b bg-muted/40 px-5 py-3">

                <div className="flex items-center gap-3">
                    {/* AI Avatar — green dot = online */}
                    <div className="relative">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold leading-none">Educare AI</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {isLoading ? "লিখছে..." : "সক্রিয়"}
                        </p>
                    </div>
                </div>

                {/* Message count + Clear button */}
                <div className="flex items-center gap-3">
                    {messages.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {messages.length} টি message
                        </span>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Clear
                    </Button>
                </div>
            </div>

            {/* ══ QUICK PROMPTS ════════════════════════════════ */}
            <div className="shrink-0 border-b bg-muted/20 px-4 py-2">
                <div className="flex flex-wrap gap-2">
                    {quickPrompts.map((q) => (
                        <button
                            key={q}
                            disabled={isLoading}
                            onClick={() => handleQuickPrompt(q)}
                            className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Sparkles className="h-3 w-3" />
                            {q}
                        </button>
                    ))}
                </div>
            </div>

            {/* ══ MESSAGES AREA ════════════════════════════════ */}
            <div className="relative min-h-0 flex-1">
                <ScrollArea className="h-full px-4 py-4">

                    {/* Empty State — কোনো message না থাকলে */}
                    {messages.length === 0 && !isLoading && (
                        <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8 ring-1 ring-primary/15">
                                <Bot className="h-8 w-8 text-primary/50" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-foreground">কথোপকথন শুরু করো</p>
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
                                    <Avatar className="mt-1 h-7 w-7 shrink-0">
                                        <AvatarFallback className={cn(
                                            "text-xs",
                                            isUser
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        )}>
                                            {isUser
                                                ? <User className="h-3.5 w-3.5" />
                                                : <Bot className="h-3.5 w-3.5" />
                                            }
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Message Bubble */}
                                    <div className={cn(
                                        "group relative max-w-[75%] min-w-0 rounded-2xl px-4 py-2.5 shadow-sm",
                                        isUser
                                            ? "rounded-tr-sm bg-primary text-primary-foreground"
                                            : "rounded-tl-sm bg-muted text-foreground"
                                    )}>
                                        {/* Text */}
                                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                                            {m.content}
                                        </p>

                                        {/* Timestamp + Copy */}
                                        <div className={cn(
                                            "mt-1.5 flex items-center gap-2",
                                            isUser ? "flex-row-reverse" : "flex-row"
                                        )}>
                                            {/* Time */}
                                            <span className={cn(
                                                "text-[10px]",
                                                isUser
                                                    ? "text-primary-foreground/50"
                                                    : "text-muted-foreground/60"
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
                                                    isUser
                                                        ? "text-primary-foreground"
                                                        : "text-muted-foreground"
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

                        {/* Typing Indicator — AI লিখছে */}
                        {isLoading && (
                            <div className="flex items-end gap-2.5">
                                <Avatar className="h-7 w-7 shrink-0">
                                    <AvatarFallback className="bg-muted text-xs">
                                        <Bot className="h-3.5 w-3.5" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 shadow-sm">
                                    <div className="flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Auto scroll anchor */}
                    <div ref={bottomRef} />
                </ScrollArea>

                {/* Scroll to bottom — user উপরে scroll করলে দেখাবে */}
                {showScrollBtn && (
                    <button
                        onClick={scrollToBottom}
                        className="absolute bottom-3 right-4 flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-md transition-all hover:bg-muted"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* ══ ERROR BANNER ═════════════════════════════════ */}
            {error && (
                <div className="shrink-0 border-t bg-red-50 px-4 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
                    ⚠️ {error}
                </div>
            )}

            {/* ══ INPUT AREA ═══════════════════════════════════ */}
            <div className="shrink-0 border-t bg-background px-4 py-3">

                {/* Input Box */}
                <div className="flex items-end gap-2 rounded-xl border bg-muted/30 px-3 py-2 transition-all focus-within:border-primary/50 focus-within:bg-background focus-within:shadow-sm">

                    {/* Auto-resize textarea */}
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

                    {/* Send Button */}
                    <button
                        onClick={() => void handleSend()}
                        disabled={!canSend}
                        className={cn(
                            "mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
                            canSend
                                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-95"
                                : "cursor-not-allowed bg-muted text-muted-foreground"
                        )}
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