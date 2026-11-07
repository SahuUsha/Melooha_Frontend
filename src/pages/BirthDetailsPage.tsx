import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  CalendarDays,
  Clock3,
  MapPin,
  ArrowRight,
  Moon,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { calculateBirthChart } from "../services/chartService";
import CosmicAuthBackground from "../components/common/CosmicAuthBackground";

export default function BirthDetailsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!user) {
      setError("Please sign in again to continue.");
      return;
    }

    if (!birthDate || !birthPlace.trim()) {
      setError("Please enter your date of birth and birthplace.");
      return;
    }

    if (unknownTime || !birthTime) {
      setError(
        "Your birth time is needed by the current chart calculator. Please enter your known or approximate birth time. We won't assume one for you."
      );
      return;
    }

    setLoading(true);

    try {
      await calculateBirthChart({
        user_id: user.id,
        birth_datetime: `${birthDate}T${birthTime}`,
        birth_place: birthPlace.trim(),
      });

      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (
              err as {
                response?: { data?: { detail?: string } };
              }
            ).response?.data?.detail
          : undefined;

      setError(message || "We couldn't generate your birth chart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <CosmicAuthBackground >
    <main className="cosmos-page birth-page">

      <header className="birth-header">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon">
            <Sparkles size={23} />
          </span>
          <span>Melooha</span>
        </Link>
      </header>

      <section className="birth-content">
        <div className="birth-heading">
          <div className="birth-symbol">
            <Moon size={31} />
            <Sparkles size={13} />
          </div>

          <span className="section-eyebrow">YOUR JOURNEY BEGINS HERE</span>

          <h1>
            Let's discover your
            <span> cosmic blueprint.</span>
          </h1>

          <p>
            Share your birth details to unlock your personalized Vedic birth chart.
          </p>
        </div>

        <form className="birth-card" onSubmit={handleSubmit}>
          <div className="birth-field">
            <label htmlFor="birth-date">
              <CalendarDays size={19} />
              Date of birth
            </label>

            <input
              id="birth-date"
              type="date"
              value={birthDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(event) => setBirthDate(event.target.value)}
              required
            />
          </div>

          <div className="birth-field">
            <label htmlFor="birth-time">
              <Clock3 size={19} />
              Birth time
            </label>

            <div className="birth-time-options">
              <label className="birth-radio-label">
                <input
                  type="radio"
                  name="birth-time-choice"
                  checked={!unknownTime}
                  onChange={() => setUnknownTime(false)}
                />
                <span>I know my birth time</span>
              </label>

              <label className="birth-radio-label">
                <input
                  type="radio"
                  name="birth-time-choice"
                  checked={unknownTime}
                  onChange={() => setUnknownTime(true)}
                />
                <span>I don't know</span>
              </label>
            </div>

            {!unknownTime ? (
              <input
                id="birth-time"
                type="time"
                value={birthTime}
                onChange={(event) => setBirthTime(event.target.value)}
                required
              />
            ) : (
              <p className="birth-time-note">
                Your current chart calculator needs a birth time. You can enter
                an approximate time if you know one.
              </p>
            )}
          </div>

          <div className="birth-field">
            <label htmlFor="birth-place">
              <MapPin size={19} />
              Birthplace
            </label>

            <input
              id="birth-place"
              type="text"
              placeholder="e.g. Nagpur, Maharashtra, India"
              value={birthPlace}
              onChange={(event) => setBirthPlace(event.target.value)}
              minLength={3}
              maxLength={200}
              autoComplete="off"
              required
            />

            <span className="birth-field-hint">
              Enter your city, state and country for accurate timezone detection.
            </span>
          </div>

          {error && (
            <div className="birth-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="birth-submit"
            disabled={loading}
          >
            {loading ? "Calculating your chart..." : "Generate My Birth Chart"}
            {!loading && <ArrowRight size={19} />}
          </button>

          <p className="birth-card-note">
            <Sparkles size={14} />
            You can update your birth details later.
          </p>
        </form>
      </section>
    </main>
     </CosmicAuthBackground>
  );
}