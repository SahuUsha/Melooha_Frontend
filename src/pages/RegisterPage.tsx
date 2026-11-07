import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Orbit,
  Stars,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import CosmicAuthBackground from "../components/common/CosmicAuthBackground";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate("/onboarding/birth-details");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (
              err as {
                response?: { data?: { detail?: string } };
              }
            ).response?.data?.detail
          : undefined;

      setError(message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <CosmicAuthBackground>
  <main className="cosmos-page auth-page">

      <Link to="/" className="auth-brand">
        <span className="auth-brand-icon">
          <Sparkles size={23} />
        </span>
        <span>Melooha</span>
      </Link>

      <section className="auth-layout register-layout">
        <div className="auth-intro">
          <div className="hero-tag">
            <Sparkles size={15} />
            <span>YOUR STORY BEGINS HERE</span>
          </div>

          <h1>
            The universe has
            <span className="gold-title"> a place for you.</span>
          </h1>

          <p className="auth-intro-description">
            Create your account and begin exploring the wisdom of Vedic
            astrology through your personalized cosmic experience.
          </p>

          <div className="auth-highlights">
            <div>
              <Orbit size={19} />
              <span>Discover your cosmic blueprint</span>
            </div>
            <div>
              <Stars size={19} />
              <span>Explore personalized AI insights</span>
            </div>
          </div>

          <div className="auth-orbit-art">
            <div className="auth-orbit auth-orbit-one" />
            <div className="auth-orbit auth-orbit-two" />
            <div className="auth-orbit auth-orbit-three" />

            <div className="auth-orbit-planet">
              <Orbit size={57} strokeWidth={1} />
            </div>

            <span className="auth-floating-star auth-star-one">✦</span>
            <span className="auth-floating-star auth-star-two">✧</span>
            <span className="auth-floating-star auth-star-three">✦</span>
          </div>
        </div>

        <div className="auth-card register-card">
          <div className="auth-card-heading">
            <span className="auth-card-eyebrow">BEGIN YOUR JOURNEY</span>
            <h2>Create your account</h2>
            <p>A new chapter of self-discovery starts here.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="register-name">Your name</label>
              <div className="auth-input-wrap">
                <User size={18} />
                <input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  minLength={2}
                  maxLength={100}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">Email address</label>
              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">Create password</label>
              <div className="auth-input-wrap">
                <Lock size={18} />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <span className="auth-field-hint">
                Use at least 8 characters for your password.
              </span>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Creating your account..." : "Create Account"}
              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <div className="auth-divider">
            <span />
            <p>ALREADY A MEMBER?</p>
            <span />
          </div>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in <ArrowRight size={14} /></Link>
          </p>

          <p className="auth-card-footer">
            <Sparkles size={13} />
            Your cosmic journey starts with one step.
          </p>
        </div>
      </section>

      <footer className="auth-footer">
        <span>MELOOHA</span>
        <span>ANCIENT WISDOM · MODERN INTELLIGENCE</span>
      </footer>
    </main>
</CosmicAuthBackground>
  );
}