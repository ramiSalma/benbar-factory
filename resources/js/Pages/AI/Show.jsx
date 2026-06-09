import { useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";

export default function Show({ session }) {

    const { data, setData, post, processing, reset } = useForm({
        message: "",
    });

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [session.messages]);

    const sendMessage = (e) => {
        e.preventDefault();

        post(route("ai.send", session.id), {
            onSuccess: () => reset("message"),
        });
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">

            {/* HEADER */}
            <div className="p-4 bg-white border-b">
                <h1 className="font-bold">
                    {session.title}
                </h1>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">

                {session.messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${
                            msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg max-w-md ${
                                msg.role === "user"
                                    ? "bg-blue-500 text-white"
                                    : "bg-white border"
                            }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}

                <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <form
                onSubmit={sendMessage}
                className="p-4 bg-white border-t flex gap-2"
            >
                <input
                    className="flex-1 border rounded px-3 py-2"
                    value={data.message}
                    onChange={(e) =>
                        setData("message", e.target.value)
                    }
                    placeholder="Type your message..."
                />

                <button
                    disabled={processing}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
