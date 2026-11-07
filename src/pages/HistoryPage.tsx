
import { useEffect, useMemo, useState } from "react";
import {
    History,
    Search,
    MessageCircle,
    Sparkles,
    RefreshCw,
    ChevronRight,
    ArrowLeft,
    Clock,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import CosmicAuthBackground from "../components/common/CosmicAuthBackground";

import {
    getQuestionHistory,
    type HistoryItem,
} from "../services/questionService";

export default function HistoryPage() {
    const { user } = useAuth();

    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [search, setSearch] = useState("");
    const [selectedQuestion, setSelectedQuestion] =
        useState<HistoryItem | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user?.id) {
            setLoading(false);
            setError("Please sign in to view your question history.");
            return;
        }

        let active = true;

        const loadHistory = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getQuestionHistory(user.id);

                if (active) {
                    setHistory(data.history ?? []);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load your history."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadHistory();

        return () => {
            active = false;
        };
    }, [user?.id]);

    const filteredHistory = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) return history;

        return history.filter(
            (item) =>
                item.question.toLowerCase().includes(value) ||
                item.answer.toLowerCase().includes(value)
        );
    }, [history, search]);

    const formatDate = (date: string) => {
        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    return (
        <CosmicAuthBackground>
            <main className="history-page">

                <header className="history-header">
                    <div>
                        <div className="history-eyebrow">
                            <Sparkles size={14} />
                            YOUR COSMIC JOURNEY
                        </div>

                        <h1>Question History</h1>

                        <p>
                            Revisit your previous conversations with Melooha.
                        </p>
                    </div>

                    <div className="history-count">
                        <History size={17} />
                        {history.length} questions
                    </div>
                </header>

                <section className="history-container">

                    {selectedQuestion ? (
                        <div className="history-detail">
                            <button
                                className="history-back"
                                type="button"
                                onClick={() => setSelectedQuestion(null)}
                            >
                                <ArrowLeft size={16} />
                                Back to history
                            </button>

                            <div className="history-detail-date">
                                <Clock size={13} />
                                {formatDate(selectedQuestion.created_at)}
                            </div>

                            <div className="history-detail-question">
                                <span>You</span>
                                <p>{selectedQuestion.question}</p>
                            </div>

                            <div className="history-detail-answer">
                                <div className="history-answer-heading">
                                    <Sparkles size={17} />
                                    Melooha
                                </div>

                                <div className="history-answer-text">
                                    {selectedQuestion.answer ||
                                        "No answer is available for this question."}
                                </div>

                                {selectedQuestion.provider && (
                                    <div className="history-provider">
                                        Generated using {selectedQuestion.provider}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="history-toolbar">
                                <h2>Previous questions</h2>

                                <div className="history-search">
                                    <Search size={17} />
                                    <input
                                        type="text"
                                        placeholder="Search questions..."
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {loading ? (
                                <div className="history-state">
                                    <RefreshCw
                                        size={23}
                                        className="history-loader"
                                    />
                                    <p>Loading your question history...</p>
                                </div>
                            ) : error ? (
                                <div className="history-state">
                                    <p>{error}</p>

                                    <button
                                        type="button"
                                        onClick={() => window.location.reload()}
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : filteredHistory.length === 0 ? (
                                <div className="history-state">
                                    <MessageCircle size={28} />
                                    <h3>
                                        {search
                                            ? "No matching questions"
                                            : "No questions yet"}
                                    </h3>
                                    <p>
                                        {search
                                            ? "Try another search term."
                                            : "Your conversations with Melooha will appear here."}
                                    </p>
                                </div>
                            ) : (
                                <div className="history-list">
                                    {filteredHistory.map((item) => (
                                        <button
                                            type="button"
                                            key={item.question_id}
                                            className="history-item"
                                            onClick={() =>
                                                setSelectedQuestion(item)
                                            }
                                        >
                                            <div className="history-item-icon">
                                                <MessageCircle size={17} />
                                            </div>

                                            <div className="history-item-content">
                                                <strong>{item.question}</strong>

                                                <p>
                                                    {item.answer ||
                                                        "No answer available."}
                                                </p>

                                                <span>
                                                    <Clock size={12} />
                                                    {formatDate(item.created_at)}
                                                </span>
                                            </div>

                                            <ChevronRight
                                                size={18}
                                                className="history-item-arrow"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>
        </CosmicAuthBackground>
    );
}
