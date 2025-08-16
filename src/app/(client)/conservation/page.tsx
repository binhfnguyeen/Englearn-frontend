"use client";
import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { v4 as uuidv4 } from "uuid";
import { Form, Button } from "react-bootstrap";
import {
    KeyboardFill,
    MicFill,
    MicMuteFill,
    Robot,
    Send,
    Trash,
    VolumeMute,
    VolumeUp,
    X,
} from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import cleanOutput from "@/components/CleanOutput";

interface Message {
    sender: "you" | "bot";
    text: string;
}

type SpeechRecType = typeof window extends any
    ? (Window & typeof globalThis) & {
        webkitSpeechRecognition?: any;
        SpeechRecognition?: any;
    }
    : any;

export default function ChatPage() {
    const [conversationId, setConversationId] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sttSupported, setSttSupported] = useState(false);
    const [ttsSupported, setTtsSupported] = useState(false);
    const [micOn, setMicOn] = useState(false);
    const [mute, setMute] = useState(false);
    const [showInput, setShowInput] = useState(false);

    const clientRef = useRef<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const speakingRef = useRef(false);
    const muteRef = useRef(mute);
    const ttsSupportedRef = useRef(ttsSupported);

    useEffect(() => {
        setConversationId(uuidv4());
    }, []);

    useEffect(() => {
        const hasSTT =
            typeof window !== "undefined" &&
            (!!(window as SpeechRecType).webkitSpeechRecognition ||
                !!(window as SpeechRecType).SpeechRecognition);
        const hasTTS =
            typeof window !== "undefined" &&
            "speechSynthesis" in window &&
            "SpeechSynthesisUtterance" in window;

        setSttSupported(hasSTT);
        setTtsSupported(hasTTS);
    }, []);

    useEffect(() => {
        if (!conversationId) return;

        setMessages([{ sender: "bot", text: "👋 Hi! What do you want to learn today?" }]);

        const socket = new SockJS("http://localhost:8080/elearn/ws-chat");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/conversation/${conversationId}`, (message) => {
                    const cleanText = cleanOutput(message.body);
                    setMessages((prev) => [...prev, { sender: "bot", text: cleanText }]);

                    if (!muteRef.current && ttsSupportedRef.current) speak(cleanText);
                });
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

    useEffect(() => { muteRef.current = mute }, [mute]);
    useEffect(() => { ttsSupportedRef.current = ttsSupported }, [ttsSupported]);

    const speak = (text: string) => {
        if (!ttsSupported) return;
        const synth = window.speechSynthesis;
        if (speakingRef.current) synth.cancel();

        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = "en-US";
        utt.rate = 1;
        utt.onstart = () => {
            speakingRef.current = true;
        };
        utt.onend = () => {
            speakingRef.current = false;
        };
        synth.speak(utt);
    };

    const startMic = () => {
        if (!sttSupported || recognitionRef.current) return;

        const SR =
            (window as any).webkitSpeechRecognition ||
            (window as any).SpeechRecognition;
        const rec = new SR();
        rec.lang = "en-US";
        rec.continuous = true;
        rec.interimResults = true;

        let finalTranscript = "";

        rec.onresult = (event: any) => {
            let interim = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interim += transcript;
                }
            }
            setInput(finalTranscript ? finalTranscript : interim);
        };

        rec.onerror = (e: any) => {
            console.error("STT error:", e.error);
        };

        rec.onend = () => {
            recognitionRef.current = null;
            setMicOn(false);

            const text = (input || "").trim();
            if (text) {
                sendMessage(text);
            }
        };

        recognitionRef.current = rec;
        setMicOn(true);
        rec.start();
    };

    const stopMic = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
            setMicOn(false);
        }
    };

    const sendMessage = (textParam?: string) => {
        const content = (textParam ?? input).trim();
        if (!content || !clientRef.current) return;

        setMessages((prev) => [...prev, { sender: "you", text: content }]);

        clientRef.current.publish({
            destination: `/app/chat/${conversationId}`,
            body: JSON.stringify({ message: content }),
        });

        setInput("");
    };

    return (
        <div
            className="d-flex flex-column"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #e3f2fd, #f1f3f6)",
                fontFamily: "'Segoe UI', sans-serif",
            }}
        >
            <div className="d-flex justify-content-between align-items-center p-3 shadow-sm"
                style={{ background: "#1976d2", color: "white", fontWeight: "600" }}
            >
                <span className="d-inline-flex align-items-center gap-2 px-2 py-2 rounded-pill bg-light shadow-sm border border-secondary-subtle">
                    <Robot size={10} className="text-primary" />
                    <span className="fw-semibold text-dark">AI Assistant – {conversationId.slice(0, 6)}</span>
                </span>

                <Button
                    variant={mute ? "outline-light" : "light"}
                    onClick={() => setMute((m) => !m)}
                    size="sm"
                    className="d-flex align-items-center gap-1"
                >
                    {mute ? <VolumeMute /> : <VolumeUp />}
                </Button>
            </div>

            <div className="flex-grow-1 p-4 overflow-auto">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`d-flex mb-3 ${msg.sender === "you" ? "justify-content-end" : "justify-content-start"
                            }`}
                    >
                        <div
                            className={`px-3 py-2 rounded-4 shadow-sm`}
                            style={{
                                maxWidth: "70%",
                                background: msg.sender === "you" ? "#1976d2" : "white",
                                color: msg.sender === "you" ? "white" : "#333",
                                border: msg.sender === "bot" ? "1px solid #ddd" : "none",
                            }}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white border-top">
                <Form
                    className="d-flex align-items-center justify-content-center"
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                    }}
                >
                    {showInput ? (
                        <div className="d-flex align-items-center gap-2 bg-light rounded-pill px-3 py-1 shadow-sm" style={{ maxWidth: "600px", width: "100%" }}>
                            <input
                                type="text"
                                className="form-control border-0 bg-transparent"
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                style={{ boxShadow: "none" }}
                            />
                            <Button type="submit" variant="primary" className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                                <Send size={18} />
                            </Button>
                            <Button
                                variant="outline-danger"
                                onClick={() => {
                                    setShowInput(false);
                                    setInput("");
                                }}
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: "40px", height: "40px" }}
                            >
                                <X size={18} />
                            </Button>
                        </div>
                    ) : !micOn && !input ? (
                        <div className="d-flex gap-4">
                            <div className="d-flex flex-column align-items-center">
                                <Button
                                    variant="light"
                                    className="rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                                    style={{ width: "60px", height: "60px" }}
                                    onClick={() => setShowInput(true)}
                                >
                                    <KeyboardFill size={22} color="#1976d2" />
                                </Button>
                                <small className="text-primary mt-2 fw-semibold">Type</small>
                            </div>
                            <div className="d-flex flex-column align-items-center">
                                <Button
                                    variant="light"
                                    className="rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                                    style={{ width: "70px", height: "70px", backgroundColor: "#1976d2" }}
                                    onClick={startMic}
                                >
                                    <MicFill size={28} color="#fff" />
                                </Button>
                                <small className="text-primary mt-2 fw-semibold">Speak</small>
                            </div>
                        </div>
                    ) : micOn ? (
                        <div className="d-flex flex-column align-items-center">
                            <Button
                                variant="danger"
                                className="rounded-circle shadow-lg d-flex align-items-center justify-content-center pulse"
                                style={{ width: "80px", height: "80px", border: "none" }}
                                onClick={stopMic}
                            >
                                <MicMuteFill size={30} color="#fff" />
                            </Button>
                            <small className="text-danger mt-2 fw-semibold">Recording...</small>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center gap-2 bg-light rounded-pill px-3 py-1 shadow-sm" style={{ maxWidth: "600px", width: "100%" }}>
                            <input
                                type="text"
                                className="form-control border-0 bg-transparent"
                                value={input}
                                readOnly
                                style={{ boxShadow: "none" }}
                            />
                            <Button variant="primary" onClick={() => sendMessage()} className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                                <Send size={18} />
                            </Button>
                            <Button
                                variant="outline-danger"
                                onClick={() => setInput("")}
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: "40px", height: "40px" }}
                            >
                                <Trash size={18} />
                            </Button>
                        </div>
                    )}
                </Form>
            </div>
        </div>
    );
}
