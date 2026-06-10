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
                padding: "10px 14px",
                borderRadius: "var(--border-radius-md)",
                background: active
                    ? "var(--color-background-secondary)"
                    : "transparent",
                border: active
                    ? "0.5px solid var(--color-border-secondary)"
                    : "0.5px solid transparent",
                textDecoration: "none",
                marginBottom: "4px",
                cursor: "pointer",
            }}
        >
            <p
                style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: active ? 500 : 400,
                    color: "var(--color-text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {session.title}
            </p>
            <p
                style={{
                    margin: "2px 0 0",
                    fontSize: "11px",
                    color: "var(--color-text-tertiary)",
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
                marginBottom: "16px",
            }}
        >
            {!isUser && (
                <div
                    style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "var(--color-background-info)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginRight: "10px",
                        marginTop: "2px",
                    }}
                >
                    <i
                        className="ti ti-robot"
                        style={{
                            fontSize: "15px",
                            color: "var(--color-text-info)",
                        }}
                        aria-hidden="true"
                    />
                </div>
            )}
            <div
                style={{
                    maxWidth: "72%",
                    padding: "10px 14px",
                    borderRadius: isUser
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    background: isUser
                        ? "var(--color-background-info)"
                        : "var(--color-background-secondary)",
                    border: isUser
                        ? "0.5px solid var(--color-border-info)"
                        : "0.5px solid var(--color-border-tertiary)",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: isUser
                        ? "var(--color-text-info)"
                        : "var(--color-text-primary)",
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

    // Sync messages from Inertia flash / shared props
    useEffect(() => {
        if (props.messages) {
            setMessages(props.messages);
        }
    }, [props.messages]);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // Auto-resize textarea
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
                height: "100vh",
                background: "var(--color-background-primary)",
                fontFamily: "var(--font-sans)",
                overflow: "hidden",
            }}
        >
            {/* Sidebar */}
            <aside
                style={{
                    width: "260px",
                    flexShrink: 0,
                    borderRight: "0.5px solid var(--color-border-tertiary)",
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--color-background-secondary)",
                    overflow: "hidden",
                }}
            >
                {/* Sidebar header */}
                <div
                    style={{
                        padding: "16px 14px 12px",
                        borderBottom:
                            "0.5px solid var(--color-border-tertiary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <i
                            className="ti ti-brain"
                            style={{
                                fontSize: "18px",
                                color: "var(--color-text-info)",
                            }}
                            aria-hidden="true"
                        />
                        <span
                            style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "var(--color-text-primary)",
                            }}
                        >
                            AI Assistant
                        </span>
                    </div>
                    <button
                        onClick={createNewSession}
                        title="New conversation"
                        style={{
                            background: "none",
                            border: "0.5px solid var(--color-border-secondary)",
                            borderRadius: "var(--border-radius-md)",
                            width: "30px",
                            height: "30px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "var(--color-text-secondary)",
                        }}
                    >
                        <i className="ti ti-plus" style={{ fontSize: "15px" }} aria-hidden="true" />
                    </button>
                </div>

                {/* Sessions list */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "10px 10px",
                    }}
                >
                    {sessions.length === 0 && (
                        <p
                            style={{
                                fontSize: "12px",
                                color: "var(--color-text-tertiary)",
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
                    background: "var(--color-background-primary)",
                }}
            >
                {/* Chat header */}
                <div
                    style={{
                        padding: "14px 24px",
                        borderBottom:
                            "0.5px solid var(--color-border-tertiary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexShrink: 0,
                    }}
                >
                    <i
                        className="ti ti-message-2"
                        style={{
                            fontSize: "18px",
                            color: "var(--color-text-secondary)",
                        }}
                        aria-hidden="true"
                    />
                    <h1
                        style={{
                            margin: 0,
                            fontSize: "15px",
                            fontWeight: 500,
                            color: "var(--color-text-primary)",
                        }}
                    >
                        {session.title}
                    </h1>
                </div>

                {/* Messages */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "24px 32px",
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
                                gap: "12px",
                                color: "var(--color-text-tertiary)",
                            }}
                        >
                            <i
                                className="ti ti-brain"
                                style={{ fontSize: "40px" }}
                                aria-hidden="true"
                            />
                            <p style={{ margin: 0, fontSize: "14px" }}>
                                Ask me about your project — costs, features, architecture.
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
                                marginBottom: "16px",
                                gap: "10px",
                            }}
                        >
                            <div
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50%",
                                    background: "var(--color-background-info)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <i
                                    className="ti ti-robot"
                                    style={{
                                        fontSize: "15px",
                                        color: "var(--color-text-info)",
                                    }}
                                    aria-hidden="true"
                                />
                            </div>
                            <div
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: "18px 18px 18px 4px",
                                    background:
                                        "var(--color-background-secondary)",
                                    border: "0.5px solid var(--color-border-tertiary)",
                                    display: "flex",
                                    gap: "5px",
                                    alignItems: "center",
                                }}
                            >
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        style={{
                                            width: "6px",
                                            height: "6px",
                                            borderRadius: "50%",
                                            background:
                                                "var(--color-text-tertiary)",
                                            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Input area */}
                <div
                    style={{
                        padding: "16px 24px 20px",
                        borderTop: "0.5px solid var(--color-border-tertiary)",
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "flex-end",
                            background: "var(--color-background-secondary)",
                            border: "0.5px solid var(--color-border-secondary)",
                            borderRadius: "var(--border-radius-lg)",
                            padding: "10px 14px",
                        }}
                    >
                        <textarea
                            ref={textareaRef}
                            value={data.message}
                            onInput={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about project scope, cost estimates, features..."
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
                                color: "var(--color-text-primary)",
                                fontFamily: "var(--font-sans)",
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
                                    ? "var(--color-background-info)"
                                    : "var(--color-background-secondary)",
                                border: "0.5px solid var(--color-border-secondary)",
                                borderRadius: "var(--border-radius-md)",
                                width: "34px",
                                height: "34px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: data.message.trim() && !isLoading
                                    ? "pointer"
                                    : "not-allowed",
                                flexShrink: 0,
                                transition: "background 0.15s",
                            }}
                        >
                            <i
                                className="ti ti-send"
                                style={{
                                    fontSize: "16px",
                                    color: data.message.trim() && !isLoading
                                        ? "var(--color-text-info)"
                                        : "var(--color-text-tertiary)",
                                }}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                    <p
                        style={{
                            margin: "6px 0 0",
                            fontSize: "11px",
                            color: "var(--color-text-tertiary)",
                            textAlign: "center",
                        }}
                    >
                        Enter to send · Shift+Enter for new line
                    </p>
                </div>
            </main>

            <style>{`
                @keyframes bounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-5px); }
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
