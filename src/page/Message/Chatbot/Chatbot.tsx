import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
    type ChatHistoryMessage,
    useSendChatMessageMutation,
} from "@/redux/api/aiChat/aiChatApi";
import { Bot, Copy, Loader2, RefreshCcw, Send, Sparkles, Trash2, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

type ChatMessage = {
    id: string;
    role: "user" | "model";
    content: string;
    createdAt: number;
};

const STORAGE_KEY = "educare-ai-chat-history";

const quickPrompts = [
    "আজকের unpaid student কারা?",
    "এই মাসের total collection কত?",
    "কোন student-এর payment due আছে?",
    "Latest expense summary দাও",
];

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

// Convert UI → backend format
const toHistory = (messages: ChatMessage[]): ChatHistoryMessage[] =>
    messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
    }));

const Chatbot = () => {
    const [messages, setMessages] = useState<ChatMessage[]>(() => readStoredMessages());
    const [input, setInput] = useState("");
    const [error, setError] = useState<string | null>(null);

    const [sendChatMessage, { isLoading }] = useSendChatMessageMutation();

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const canSend = useMemo(
        () => input.trim().length > 0 && !isLoading,
        [input, isLoading]
    );

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    // Auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length, isLoading]);

    const handleSend = async () => {
        const message = input.trim();
        if (!message || isLoading) return;

        setError(null);

        const userMsg: ChatMessage = {
            id: createId(),
            role: "user",
            content: message,
            createdAt: Date.now(),
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput("");

        try {
            // ✅ FIX: history included (TypeScript requirement)
            const response = await sendChatMessage({
                message,
                history: toHistory(updatedMessages), // 🔥 FIXED HERE
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
            setError("Chat request failed.");
        }
    };

    const handleQuickPrompt = (p: string) => setInput(p);

    const handleClear = () => {
        setMessages([]);
        setInput("");
        setError(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied");
        } catch {
            toast.error("Copy failed");
        }
    };

    return (
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">

            {/* LEFT */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between">
                        <div>
                            <CardTitle>AI Chatbot</CardTitle>
                            <CardDescription>Ask anything about coaching system</CardDescription>
                        </div>

                        <Button variant="outline" size="sm" onClick={handleClear}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Clear
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">

                    <div className="grid sm:grid-cols-2 gap-2">
                        {quickPrompts.map((q) => (
                            <Button
                                key={q}
                                variant="outline"
                                className="justify-start"
                                onClick={() => handleQuickPrompt(q)}
                            >
                                <Sparkles className="h-4 w-4 mr-2" />
                                {q}
                            </Button>
                        ))}
                    </div>

                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask something..."
                        className="min-h-[140px]"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                void handleSend();
                            }
                        }}
                    />

                    <div className="flex gap-3">
                        <Button onClick={() => void handleSend()} disabled={!canSend}>
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Send className="h-4 w-4 mr-2" />
                            )}
                            Send
                        </Button>

                        <Button variant="outline" onClick={() => setInput("")}>
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm border p-2 rounded">
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* RIGHT */}
            <Card>
                <CardHeader>
                    <CardTitle>Conversation</CardTitle>
                </CardHeader>

                <CardContent>
                    <ScrollArea className="h-[560px] pr-3">

                        {messages.map((m) => {
                            const isUser = m.role === "user";

                            return (
                                <div
                                    key={m.id}
                                    className={cn("flex gap-3 mb-3", isUser ? "justify-end" : "justify-start")}
                                >
                                    {!isUser && (
                                        <Avatar>
                                            <AvatarFallback><Bot /></AvatarFallback>
                                        </Avatar>
                                    )}

                                    <div className="max-w-[80%] bg-muted p-3 rounded-xl">
                                        <p className="whitespace-pre-wrap">{m.content}</p>

                                        <button
                                            className="text-xs mt-1 flex items-center gap-1"
                                            onClick={() => void handleCopy(m.content)}
                                        >
                                            <Copy className="h-3 w-3" />
                                            Copy
                                        </button>
                                    </div>

                                    {isUser && (
                                        <Avatar>
                                            <AvatarFallback><User /></AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            );
                        })}

                        {isLoading && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Thinking...
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

export default Chatbot;