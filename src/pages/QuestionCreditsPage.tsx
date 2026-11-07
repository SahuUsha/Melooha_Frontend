import { useState } from "react";
import {
    Coins,
    Plus,
    RefreshCw,
    CheckCircle2,
    Sparkles,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import CosmicAuthBackground from "../components/common/CosmicAuthBackground";
import { addQuestionCredits } from "../services/questionService";

const creditPackages = [5, 10, 20];

export default function QuestionCreditsPage() {
    const { user, updateUser } = useAuth();

    const [balance, setBalance] = useState(
        Number(user?.question_balance ?? 0)
    );
    const [selectedAmount, setSelectedAmount] = useState(10);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleAddCredits = async () => {
        if (!user?.id) {
            setError("Please sign in to continue.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            setError("");

            const result = await addQuestionCredits(
                user.id,
                selectedAmount
            );

            setBalance(result.remaining_balance);

updateUser({
    question_balance: result.remaining_balance,
});
            setMessage(
                `${result.questions_added} question credits added successfully.`
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to add question credits."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <CosmicAuthBackground>
            <main className="credits-page">
                <header className="credits-header">
                    <span>YOUR MELooHA ACCOUNT</span>
                    <h1>Question Credits</h1>
                    <p>Manage your credits and continue your cosmic conversations.</p>
                </header>

                <section className="credits-balance">
                    <Coins size={25} />
                    <span>Available questions</span>
                    <strong>{balance}</strong>
                </section>

                <section className="credits-package-section">
                    <h2>Add question credits</h2>
                    <p>Select how many questions you want to add.</p>

                    <div className="credits-options">
                        {creditPackages.map((amount) => (
                            <button
                                key={amount}
                                type="button"
                                className={
                                    selectedAmount === amount
                                        ? "credits-option selected"
                                        : "credits-option"
                                }
                                onClick={() => {
                                    setSelectedAmount(amount);
                                    setMessage("");
                                    setError("");
                                }}
                                disabled={loading}
                            >
                                <strong>{amount}</strong>
                                <span>Questions</span>
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="credits-add-button"
                        onClick={handleAddCredits}
                        disabled={loading}
                    >
                        {loading ? (
                            <RefreshCw size={17} className="credits-spinner" />
                        ) : (
                            <Plus size={17} />
                        )}
                        {loading ? "Adding credits..." : "Add demo credits"}
                    </button>

                    {message && (
                        <p className="credits-success">
                            <CheckCircle2 size={16} />
                            {message}
                        </p>
                    )}

                    {error && (
                        <p className="credits-error">{error}</p>
                    )}

                    <p className="credits-note">
                        <Sparkles size={14} />
                        Demo feature — no payment is required.
                    </p>
                </section>
            </main>
        </CosmicAuthBackground>
    );
}