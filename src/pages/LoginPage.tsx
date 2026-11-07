import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Moon,
  Stars,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import CosmicAuthBackground from "../components/common/CosmicAuthBackground";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      if (!user.birth_datetime || !user.birth_place) {
        navigate("/onboarding/birth-details");
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Invalid email or password. Please try again.");
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

      <section className="auth-layout">
        <div className="auth-intro">
          <div className="hero-tag">
            <Sparkles size={15} />
            <span>YOUR COSMIC JOURNEY CONTINUES</span>
          </div>

          <h1>
            Welcome back
            <span className="gold-title"> to your universe.</span>
          </h1>

          <p className="auth-intro-description">
            Your stars, your story, your journey. Sign in to reconnect
            with your personalized birth chart and cosmic insights.
          </p>

          <div className="auth-highlights">
            <div>
              <Moon size={19} />
              <span>Your personalized Vedic chart</span>
            </div>
            <div>
              <Stars size={19} />
              <span>Meaningful conversations with AI</span>
            </div>
          </div>

          <div className="auth-orbit-art">
            <div className="auth-orbit auth-orbit-one" />
            <div className="auth-orbit auth-orbit-two" />
            <div className="auth-orbit auth-orbit-three" />

            <div className="auth-orbit-planet">
              <Sparkles size={54} strokeWidth={1} />
            </div>

            <span className="auth-floating-star auth-star-one">✦</span>
            <span className="auth-floating-star auth-star-two">✧</span>
            <span className="auth-floating-star auth-star-three">✦</span>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-card-eyebrow">WELCOME BACK</span>
            <h2>Sign in to Melooha</h2>
            <p>Your cosmic journey is waiting for you.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="login-email">Email address</label>
              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  id="login-email"
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
              <label htmlFor="login-password">Password</label>
              <div className="auth-input-wrap">
                <Lock size={18} />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Signing you in..." : "Sign In"}
              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <div className="auth-divider">
            <span />
            <p>NEW TO MELOOHA?</p>
            <span />
          </div>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">Create one <ArrowRight size={14} /></Link>
          </p>

          <p className="auth-card-footer">
            <Sparkles size={13} />
            A universe of possibilities awaits.
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