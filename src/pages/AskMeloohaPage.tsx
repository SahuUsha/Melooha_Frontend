import { useEffect, useRef, useState } from "react";
import {
    Sparkles,
    Send,
    MessageCircle,
    UserRound,
    RefreshCw,
    Coins,
    Plus,
    Orbit,
    LoaderCircle,
    RotateCcw,
    BookOpen,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import CosmicAuthBackground from "../components/common/CosmicAuthBackground";

import {
    askQuestionStream,
    getQuestionBalance,
    type QuestionDoneResponse,
    type Citation,
} from "../services/questionService";

interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
    citations?: Citation[];
    chartCitations?: Citation[];
    provider?: string;
}

const suggestions = [
    {
        icon: Orbit,
        title: "Career & Purpose",
        question: "Which planets influence my career according to Vedic astrology?",
    },
    {
        icon: Sparkles,
        title: "Planetary Strengths",
        question: "What are my strongest planetary placements?",
    },
    {
        icon: UserRound,
        title: "Personality",
        question: "What does my ascendant say about my personality?",
    },
];

const formatCitation = (citation: Citation): string => {
    return `${citation.source}${citation.page_number != null
        ? ` · Page ${citation.page_number}`
        : ""
        }`;
};

export default function AskMeloohaPage() {
    const { user, updateUser } = useAuth();

    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [balance, setBalance] = useState(user?.question_balance ?? 0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [streamingId, setStreamingId] = useState<number | null>(null);
    const [lastFailedQuestion, setLastFailedQuestion] = useState("");

    const abortControllerRef = useRef<AbortController | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Keep the latest message visible while the answer streams.
    useEffect(() => {
    if (!user?.id) return;

    let isActive = true;

    const fetchBalance = async () => {
        try {
            const result = await getQuestionBalance(user.id);

            if (isActive) {
                setBalance(result.question_balance);

                updateUser({
                    question_balance: result.question_balance,
                });
            }
        } catch (err) {
            console.error("Failed to fetch question balance:", err);
        }
    };

    fetchBalance();

    return () => {
        isActive = false;
    };
}, [user?.id, updateUser]);
    useEffect(() => {
    setBalance(user?.question_balance ?? 0);
}, [user?.question_balance]);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages]);

    const stopGeneration = () => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;

        setMessages((previous) =>
            previous.map((message) =>
                message.id === streamingId
                    ? {
                        ...message,
                        content: message.content
                            ? `${message.content}\n\n(Response stopped.)`
                            : "Response stopped.",
                    }
                    : message
            )
        );

        setLoading(false);
        setStreamingId(null);
    };

    const sendQuestion = async (selectedQuestion?: string) => {
        const text = (selectedQuestion ?? question).trim();

        if (!text || loading) return;

        if (!user?.id) {
            setError("Please sign in to ask a question.");
            return;
        }

        if (balance <= 0) {
            setError("You have no questions remaining. Please add more credits.");
            return;
        }

        const userMessage: Message = {
            id: Date.now(),
            role: "user",
            content: text,
        };

        const assistantId = Date.now() + 1;

        setMessages((previous) => [
            ...previous,
            userMessage,
            {
                id: assistantId,
                role: "assistant",
                content: "",
            },
        ]);

        setQuestion("");
        setError("");
        setLastFailedQuestion("");
        setLoading(true);
        setStreamingId(assistantId);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            await askQuestionStream(
                {
                    user_id: user.id,
                    question: text,
                },
                {
                    onToken: (token: string) => {
                        setMessages((previous) =>
                            previous.map((message) =>
                                message.id === assistantId
                                    ? {
                                        ...message,
                                        content: message.content + token,
                                    }
                                    : message
                            )
                        );
                    },

                    onReset: () => {
                        setMessages((previous) =>
                            previous.map((message) =>
                                message.id === assistantId
                                    ? { ...message, content: "" }
                                    : message
                            )
                        );
                    },

                    onDone: (data: QuestionDoneResponse) => {
    setBalance(data.remaining_balance);

    updateUser({
        question_balance: data.remaining_balance,
    });

    setLastFailedQuestion("");

                        setMessages((previous) =>
                            previous.map((message) =>
                                message.id === assistantId
                                    ? {
                                        ...message,
                                        content: data.answer,
                                        citations: data.citations,
                                        chartCitations: data.chart_citations,
                                        provider: data.provider,
                                    }
                                    : message
                            )
                        );
                    },

                    onError: (message: string) => {
                        setError(message);
                        setLastFailedQuestion(text);

                        setMessages((previous) =>
                            previous.filter(
                                (item) => item.id !== assistantId
                            )
                        );
                    },
                },
                controller.signal
            );
        } catch (err) {
            if (err instanceof Error && err.name === "AbortError") {
                return;
            }

            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again.";

            setError(errorMessage);
            setLastFailedQuestion(text);

            setMessages((previous) =>
                previous.filter((item) => item.id !== assistantId)
            );
        } finally {
            abortControllerRef.current = null;
            setLoading(false);
            setStreamingId(null);
        }
    };

    return (
        <CosmicAuthBackground>
            <div className="ask-page">

                {/* Page Header */}
                <header className="ask-header">
                    <div className="ask-heading-content">
                        <div className="ask-eyebrow">
                            <Sparkles size={15} />
                            YOUR COSMIC GUIDE
                        </div>

                        <h1>Ask Melooha</h1>

                        <p>
                            Your birth chart holds a universe of insights.
                            Ask a question and explore what the stars reveal.
                        </p>
                    </div>

                    <div className="ask-balance">
                        <div className="ask-balance-icon">
                            <Coins size={19} />
                        </div>

                        <div className="ask-balance-info">
                            <span className="ask-balance-number">
                                {balance}
                            </span>
                            <span className="ask-balance-label">
                                Questions remaining
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setError("The add-questions flow is coming soon.")
                            }
                            title="Add questions"
                            aria-label="Add questions"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </header>

                {/* Chat Area */}
                <main className="ask-chat-container">

                    {messages.length === 0 ? (
    <section className="ask-welcome">
        <h2>Try asking</h2>

        <div className="ask-suggestions">
            {suggestions.map((item) => (
                <button
                    key={item.title}
                    type="button"
                    disabled={loading || balance <= 0}
                    onClick={() => sendQuestion(item.question)}
                >
                    {item.question}
                </button>
            ))}
        </div>
    </section>
) : (
                        /* Conversation */
                        <section className="ask-messages">
                            {messages.map((message) => {
                                const isStreaming =
                                    message.role === "assistant" &&
                                    streamingId === message.id &&
                                    loading;

                                const isThinking =
                                    isStreaming && !message.content;

                                return (
                                    <article
                                        key={message.id}
                                        className={`ask-message ${message.role === "user"
                                            ? "ask-user-message"
                                            : "ask-assistant-message"
                                            }`}
                                    >
                                        <div className="ask-avatar">
                                            {message.role === "user" ? (
                                                <UserRound size={18} />
                                            ) : (
                                                <Sparkles size={18} />
                                            )}
                                        </div>

                                        <div className="ask-message-content">

                                            <div className="ask-message-top">
                                                <div className="ask-message-label">
                                                    {message.role === "user"
                                                        ? "You"
                                                        : "Melooha"}
                                                </div>

                                                {isStreaming && (
                                                    <span className="ask-live-indicator">
                                                        <span />
                                                        {isThinking
                                                            ? "Thinking"
                                                            : "Responding"}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="ask-message-text">

                                                {isThinking ? (
                                                    <div className="ask-thinking">
                                                        <div className="ask-thinking-icon">
                                                            <LoaderCircle
                                                                size={17}
                                                            />
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                Melooha is thinking...
                                                            </strong>
                                                            <span>
                                                                Exploring your
                                                                cosmic insights
                                                            </span>
                                                        </div>

                                                        <div className="ask-typing">
                                                            <span />
                                                            <span />
                                                            <span />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {message.content}

                                                        {isStreaming && (
                                                            <span
                                                                className="ask-stream-cursor"
                                                                aria-label="Response is streaming"
                                                            />
                                                        )}

                                                        {message.role ===
                                                            "assistant" &&
                                                            !message.content &&
                                                            !isStreaming && (
                                                                <span>
                                                                    No response
                                                                    was returned.
                                                                </span>
                                                            )}
                                                    </>
                                                )}
                                            </div>

                                            {message.provider && (
                                                <div className="ask-provider">
                                                    <Sparkles size={12} />
                                                    Generated using{" "}
                                                    {message.provider}
                                                </div>
                                            )}

                                            {(
                                                (message.citations?.length ?? 0) > 0 ||
                                                (message.chartCitations?.length ?? 0) > 0
                                            ) && (
                                                    <details className="ask-citations">
                                                        <summary>
                                                            <BookOpen size={15} />
                                                            Sources &amp; Chart References
                                                        </summary>

                                                        {message.chartCitations &&
                                                            message.chartCitations.length > 0 && (
                                                                <div className="ask-citation-group">
                                                                    <strong>
                                                                        Birth Chart
                                                                    </strong>

                                                                    {message.chartCitations.map(
                                                                        (citation, index) => (
                                                                            <p key={`chart-${index}`}>
                                                                                {formatCitation(citation)}
                                                                            </p>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}

                                                        {message.citations &&
                                                            message.citations.length > 0 && (
                                                                <div className="ask-citation-group">
                                                                    <strong>
                                                                        Knowledge Sources
                                                                    </strong>

                                                                    {message.citations.map(
                                                                        (citation, index) => (
                                                                            <p key={`source-${index}`}>
                                                                                {formatCitation(citation)}
                                                                            </p>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                    </details>
                                                )}
                                        </div>
                                    </article>
                                );
                            })}

                            <div ref={messagesEndRef} />
                        </section>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="ask-error">
                            <div className="ask-error-content">
                                <span className="ask-error-icon">!</span>

                                <div>
                                    <strong>Something went wrong</strong>
                                    <p>{error}</p>
                                </div>
                            </div>

                            <div className="ask-error-actions">
                                {lastFailedQuestion && !loading && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            sendQuestion(lastFailedQuestion)
                                        }
                                    >
                                        <RotateCcw size={14} />
                                        Retry
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setError("")}
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Question Input */}
                    <div className="ask-composer-wrapper">
                        {balance <= 0 && !loading && (
                            <p className="ask-no-balance">
                                You have no questions remaining.
                                Add more credits to continue.
                            </p>
                        )}

                        <form
                            className="ask-input-area"
                            onSubmit={(event) => {
                                event.preventDefault();
                                sendQuestion();
                            }}
                        >
                            <input
                                type="text"
                                value={question}
                                onChange={(event) =>
                                    setQuestion(event.target.value)
                                }
                                placeholder="Ask anything about your birth chart..."
                                disabled={loading || balance <= 0}
                                aria-label="Your question"
                            />

                            {loading ? (
                                <button
                                    type="button"
                                    className="ask-stop-button"
                                    onClick={stopGeneration}
                                >
                                    <span className="ask-stop-icon" />
                                    Stop
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={!question.trim() || balance <= 0}
                                    title="Send question"
                                    aria-label="Send question"
                                >
                                    <Send size={19} />
                                </button>
                            )}
                        </form>

                        <p className="ask-disclaimer">
                            <RefreshCw size={12} />
                            Astrological insights are for guidance and
                            self-reflection.
                        </p>
                    </div>
                </main>
            </div>
        </CosmicAuthBackground>
    );
}