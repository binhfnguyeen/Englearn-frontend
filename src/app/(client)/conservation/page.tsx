"use client";
import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { v4 as uuidv4 } from "uuid";
import { Card, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import cleanOutput from "@/components/CleanOutput";

interface Message {
    sender: "you" | "bot";
    text: string;
}

export default function ChatPage() {
    const [conversationId, setConversationId] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const clientRef = useRef<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setConversationId(uuidv4());
    }, []);

    useEffect(() => {
        if (!conversationId) return;

        setMessages([{ sender: "bot", text: "Hi! What do you want to learn today?" }]);

        const socket = new SockJS("http://localhost:8080/elearn/ws-chat");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected to WebSocket");
                client.subscribe(`/topic/conversation/${conversationId}`, (message) => {
                    const cleanText = cleanOutput(message.body);
                    setMessages((prev) => [...prev, { sender: "bot", text: cleanText }]);
                });
            },
            onDisconnect: () => {
                console.log("Disconnected from WebSocket");
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
            clientRef.current = null;
        };
    }, [conversationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !clientRef.current) return;

        setMessages((prev) => [...prev, { sender: "you", text: input.trim() }]);

        clientRef.current.publish({
            destination: `/app/chat/${conversationId}`,
            body: JSON.stringify({ message: input.trim() }),
        });

        setInput("");
    };

    return (
        <div className="d-flex flex-column h-100">
            <Card className="flex-grow-1 shadow-sm">
                <Card.Header className="bg-primary text-white fw-bold">
                    Hội thoại: {conversationId}
                </Card.Header>

                <Card.Body className="overflow-auto" style={{ flex: 1 }}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`d-flex mb-2 ${msg.sender === "you" ? "justify-content-end" : "justify-content-start"}`}
                        >
                            <div
                                className={`p-2 rounded text-white shadow-sm ${msg.sender === "you" ? "bg-primary" : "bg-success"
                                    }`}
                                style={{ maxWidth: "75%" }}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </Card.Body>

                <Card.Footer>
                    <Form
                        className="d-flex"
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage();
                        }}
                    >
                        <Form.Control
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            className="ms-2"
                        >
                            Gửi
                        </Button>
                    </Form>
                </Card.Footer>
            </Card>
        </div>
    );
}
