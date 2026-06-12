import { useState, useRef, useEffect } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

function SessionItem({ session, active }) {
    return (
        <a
            href={`/ai/${session.id}`}
            onClick={(e) => {
                e.preventDefault();
                router.visit(`/ai/${session.id}`);
            }}
            style={{
                display: "block",
                padding: "12px 14px",
                borderRadius: "12px",
                background: active
                    ? "linear-gradient(135deg, #e0f2fe 0%, #e0e7ff 100%)" // Vibrant Sky-Indigo blend
                    : "transparent",
                border: active
                    ? "1px solid #bae6fd"
                    : "1px solid transparent",
                textDecoration: "none",
                marginBottom: "6px",
                cursor: "pointer",
                transition: "all 0.2s ease",
            }}
        >
            <p
                style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: active ? 600 : 500,
                    color: active ? "#1e3a8a" : "#475569", // Dark indigo vs slate gray
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {session.title}
            </p>
            <p
                style={{
                    margin: "4px 0 0",
                    fontSize: "11px",
                    color: active ? "#2563eb" : "#94a3b8",
                    fontWeight: active ? 500 : 400,
                }}
            >
                {new Date(session.created_at).toLocaleDateString()}
            </p>
        </a>
    );
}

function MessageBubble({ message }) {
    const isUser = message.role === "user";
    return (
        <div
            style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                marginBottom: "20px",
            }}
        >
            {!isUser && (
                <div
                    style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", // Rich Indigo bot avatar
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginRight: "12px",
                        boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)",
                    }}
                >
                    <i
                        className="ti ti-robot"
                        style={{
                            fontSize: "18px",
                            color: "#ffffff",
                        }}
                        aria-hidden="true"
                    />
                </div>
            )}
            <div
                style={{
                    maxWidth: "70%",
                    padding: "12px 16px",
                    borderRadius: isUser
                        ? "20px 20px 4px 20px"
                        : "20px 20px 20px 4px",
                    background: isUser
                        ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)" // Sky Blue gradient for User
                        : "#ffffff", // Clean clean white card for Bot
                    border: isUser
                        ? "none"
                        : "1px solid #e2e8f0",
                    boxShadow: isUser 
                        ? "0 4px 12px rgba(3, 105, 161, 0.15)" 
                        : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: isUser ? "#ffffff" : "#1e293b",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                }}
            >
                {message.content}
            </div>
        </div>
    );
}

export default function Show({ session, messages: initialMessages, sessions }) {
    const { props } = usePage();
    const [messages, setMessages] = useState(initialMessages ?? []);
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef(null);
    const textareaRef = useRef(null);

    const { data, setData, reset } = useForm({ message: "" });

    useEffect(() => {
        if (props.messages) {
            setMessages(props.messages);
        }
    }, [props.messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleInput = (e) => {
        setData("message", e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
    };

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (!data.message.trim() || isLoading) return;

        const optimistic = {
            id: Date.now(),
            role: "user",
            content: data.message,
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimistic]);
        setIsLoading(true);
        reset("message");
        if (textareaRef.current) textareaRef.current.style.height = "auto";

        router.post(
            `/ai/${session.id}/send`,
            { message: optimistic.content },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    if (page.props.messages) {
                        setMessages(page.props.messages);
                    }
                    setIsLoading(false);
                },
                onError: () => {
                    setMessages((prev) =>
                        prev.filter((m) => m.id !== optimistic.id)
                    );
                    setIsLoading(false);
                },
            }
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const createNewSession = () => {
        router.post("/ai/sessions");
    };

    return (
        <div
            style={{
                display: "flex",
                height: "calc(100vh - 65px)", // Forces full workspace height beneath main wrapper navbar
                background: "#f8fafc", // Cool Slate fallback background
                fontFamily: "Inter, system-ui, sans-serif",
                overflow: "hidden",
            }}
        >
            {/* Sidebar Component */}
            <aside
                style={{
                    width: "280px",
                    flexShrink: 0,
                    borderRight: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    background: "#ffffff", 
                    overflow: "hidden",
                }}
            >
                {/* Sidebar header */}
                <div
                    style={{
                        padding: "18px 16px",
                        borderBottom: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "linear-gradient(to bottom, #ffffff, #f8fafc)"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ background: "#e0f2fe", padding: "6px", borderRadius: "8px" }}>
                            <i
                                className="ti ti-brain"
                                style={{
                                    fontSize: "18px",
                                    color: "#0284c7", // Sky Blue Accent
                                }}
                                aria-hidden="true"
                            />
                        </div>
                        <span
                            style={{
                                fontSize: "15px",
                                fontWeight: 600,
                                color: "#0f172a",
                            }}
                        >
                            AI Architect
                        </span>
                    </div>
                    <button
                        onClick={createNewSession}
                        title="New conversation"
                        style={{
                            background: "#ffffff",
                            border: "1px solid #cbd5e1",
                            borderRadius: "10px",
                            width: "32px",
                            height: "32px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#475569",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            transition: "all 0.15s ease"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#6366f1"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#475569"; }}
                    >
                        <i className="ti ti-plus" style={{ fontSize: "15px" }} aria-hidden="true" />
                    </button>
                </div>

                {/* Sessions list */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "14px 12px",
                    }}
                >
                    {sessions.length === 0 && (
                        <p
                            style={{
                                fontSize: "13px",
                                color: "#94a3b8",
                                textAlign: "center",
                                marginTop: "2rem",
                            }}
                        >
                            No conversations yet
                        </p>
                    )}
                    {sessions.map((s) => (
                        <SessionItem
                            key={s.id}
                            session={s}
                            active={s.id === session.id}
                        />
                    ))}
                </div>
            </aside>

            {/* Main chat area */}
            <main
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    background: "#f1f5f9", // Muted light slate backdrop
                }}
            >
                {/* Chat header */}
                <div
                    style={{
                        padding: "16px 28px",
                        borderBottom: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        flexShrink: 0,
                        background: "#ffffff",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.02)",
                    }}
                >
                    <i
                        className="ti ti-message-2"
                        style={{
                            fontSize: "20px",
                            color: "#6366f1", // Indigo Accent
                        }}
                        aria-hidden="true"
                    />
                    <h1
                        style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#0f172a",
                        }}
                    >
                        {session.title}
                    </h1>
                </div>

                {/* Messages Container */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "28px 36px",
                    }}
                >
                    {messages.length === 0 && !isLoading && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                gap: "16px",
                                color: "#64748b",
                            }}
                        >
                            <div style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #e0e7ff 100%)", padding: "20px", borderRadius: "24px" }}>
                                <i
                                    className="ti ti-brain"
                                    style={{ fontSize: "44px", color: "#4f46e5" }}
                                    aria-hidden="true"
                                />
                            </div>
                            <p style={{ margin: 0, fontSize: "15px", fontWeight: 500, textAlign: "center", maxWidth: "400px", lineHeight: "1.5" }}>
                                Ask me anything about your project architecture, features, or cost estimation.
                            </p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}

                    {isLoading && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                marginBottom: "20px",
                                gap: "12px",
                            }}
                        >
                            <div
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <i
                                    className="ti ti-robot"
                                    style={{ fontSize: "18px", color: "#ffffff" }}
                                    aria-hidden="true"
                                />
                            </div>
                            <div
                                style={{
                                    padding: "12px 18px",
                                    borderRadius: "20px 20px 20px 4px",
                                    background: "#ffffff",
                                    border: "1px solid #e2e8f0",
                                    display: "flex",
                                    gap: "6px",
                                    alignItems: "center",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                                }}
                            >
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        style={{
                                            width: "7px",
                                            height: "7px",
                                            borderRadius: "50%",
                                            background: "#818cf8",
                                            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Input Area Layout */}
                <div
                    style={{
                        padding: "18px 36px 24px",
                        background: "#ffffff",
                        borderTop: "1px solid #e2e8f0",
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "flex-end",
                            background: "#f8fafc",
                            border: "1px solid #cbd5e1",
                            borderRadius: "16px",
                            padding: "12px 16px",
                            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)"
                        }}
                    >
                        <textarea
                            ref={textareaRef}
                            value={data.message}
                            onInput={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message or project scope requirement..."
                            rows={1}
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                background: "none",
                                border: "none",
                                outline: "none",
                                resize: "none",
                                fontSize: "14px",
                                lineHeight: "1.6",
                                color: "#0f172a",
                                padding: 0,
                                minHeight: "24px",
                                maxHeight: "160px",
                            }}
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={!data.message.trim() || isLoading}
                            title="Send (Enter)"
                            style={{
                                background: data.message.trim() && !isLoading
                                    ? "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)" // Beautiful deep Indigo button
                                    : "#e2e8f0",
                                border: "none",
                                borderRadius: "12px",
                                width: "38px",
                                height: "38px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: data.message.trim() && !isLoading ? "pointer" : "not-allowed",
                                flexShrink: 0,
                                boxShadow: data.message.trim() && !isLoading ? "0 4px 12px rgba(79, 70, 229, 0.25)" : "none",
                                transition: "all 0.15s ease",
                            }}
                        >
                            <i
                                className="ti ti-send"
                                style={{
                                    fontSize: "16px",
                                    color: data.message.trim() && !isLoading ? "#ffffff" : "#94a3b8",
                                }}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                    <p
                        style={{
                            margin: "8px 0 0",
                            fontSize: "12px",
                            color: "#94a3b8",
                            textAlign: "center",
                        }}
                    >
                        Press <strong style={{ color: "#64748b" }}>Enter</strong> to send · <strong style={{ color: "#64748b" }}>Shift + Enter</strong> for a new line
                    </p>
                </div>
            </main>

            <style>{`
                @keyframes bounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-6px); }
                }
            `}</style>
        </div>
    );
}

Show.layout = (page) => (
    <AuthenticatedLayout>
        {page}
    </AuthenticatedLayout>
);