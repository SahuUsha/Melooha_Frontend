
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  LayoutDashboard,
  Orbit,
  MessageCircle,
  History,
  UserRound,
  Settings,
  ArrowRight,
  Moon,
  Sun,
  Stars,
  LogOut,
  MapPin,
  CalendarDays,
  Clock3,
  RefreshCw,
  Coins,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import CosmicAuthBackground from "../components/common/CosmicAuthBackground";
import {
  getBirthChart,
  type BirthChartResponse,
} from "../services/chartService";
import { getChartValue, getPlanetData } from "../utils/chartUtils";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard", active: true },
  { label: "Birth Chart", icon: Orbit, href: "/dashboard/chart", active: false },
  { label: "Ask Melooha", icon: MessageCircle, href: "/dashboard/ask", active: false },
  { label: "History", icon: History, href: "/dashboard/history", active: false },
  { label: "Question Credits", icon: Coins, href: "/dashboard/credits", active: false },
  // { label: "Profile", icon: UserRound, href: "/dashboard/profile", active: false },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [chart, setChart] = useState<BirthChartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setError("Please sign in to view your birth chart.");
      return;
    }

    let cancelled = false;

    const fetchChart = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBirthChart(user.id);

        if (!cancelled) {
          setChart(data);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load your birth chart. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchChart();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const planets = chart ? getPlanetData(chart) : [];
  const ascendant = chart
    ? getChartValue(chart, "ascendant.sign")
    : "—";

  const ascendantDegree = chart
    ? getChartValue(chart, "ascendant.degree")
    : "—";

  const formattedBirthDate = chart
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: chart.timezone_name,
      }).format(new Date(chart.birth_datetime))
    : "—";

  return (
    <main className="cosmos-page dashboard-page">
      <CosmicAuthBackground />

      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-brand">
          <span className="dashboard-brand-icon">
            <Sparkles size={22} />
          </span>
          <span>Melooha</span>
        </Link>

        <p className="dashboard-nav-label">MENU</p>

        <nav className="dashboard-navigation">
  {navigation.map((item) => {
    const Icon = item.icon;

    return (
      <Link
        key={item.label}
        to={item.href}
        className={`dashboard-nav-item ${item.active ? "active" : ""}`}
      >
        <Icon size={18} />
        <span>{item.label}</span>
      </Link>
    );
  })}

  <button
    type="button"
    className="dashboard-nav-item"
    onClick={handleLogout}
  >
    <LogOut size={18} />
    <span>Sign out</span>
  </button>
</nav>

        {/* <div className="dashboard-sidebar-bottom">
  <button
    type="button"
    className="dashboard-nav-item"
    onClick={handleLogout}
  >
    <LogOut size={18} />
    <span>Sign out</span>
  </button>
</div> */}
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <span className="dashboard-topbar-label">
              YOUR PERSONAL SPACE
            </span>
            <p>Welcome back, {user?.name || "Explorer"}</p>
          </div>

          <div className="dashboard-avatar">
            <UserRound size={19} />
          </div>
        </header>

        <div className="dashboard-content">
          <section className="dashboard-welcome">
            <div>
              <span className="section-eyebrow">
                <Stars size={14} /> YOUR COSMIC JOURNEY
              </span>

              <h1>
                Discover what the
                <span> stars have written.</span>
              </h1>

              <p>
                Explore your birth chart, understand planetary influences
                and find guidance through meaningful conversations.
              </p>
            </div>

            <div className="dashboard-moon-art">
              <Moon size={88} strokeWidth={0.8} />
              <span className="moon-orbit orbit-one" />
              <span className="moon-orbit orbit-two" />
              <Sparkles className="moon-sparkle" size={19} />
            </div>
          </section>

          {/* Birth chart overview */}
          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div>
                <span className="section-eyebrow">
                  YOUR BIRTH DETAILS
                </span>
                <h2>Your cosmic identity</h2>
              </div>
            </div>

            {loading ? (
              <div className="chart-status-card">
                <RefreshCw
                  size={22}
                  className="chart-loading-icon"
                />
                <p>Discovering your cosmic blueprint...</p>
              </div>
            ) : error ? (
              <div className="chart-status-card chart-error-card">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>
                  Try again <RefreshCw size={15} />
                </button>
              </div>
            ) : chart ? (
              <>
                <div className="birth-summary-grid">
                  <article className="birth-summary-card">
                    <div className="summary-card-icon">
                      <MapPin size={19} />
                    </div>
                    <span>Birthplace</span>
                    <strong>{chart.birth_place}</strong>
                  </article>

                  <article className="birth-summary-card">
                    <div className="summary-card-icon">
                      <CalendarDays size={19} />
                    </div>
                    <span>Date and time</span>
                    <strong>{formattedBirthDate}</strong>
                  </article>

                  <article className="birth-summary-card">
                    <div className="summary-card-icon">
                      <Clock3 size={19} />
                    </div>
                    <span>Timezone</span>
                    <strong>{chart.timezone_name}</strong>
                  </article>
                </div>

                <div className="ascendant-card">
                  <div className="ascendant-icon">
                    <Orbit size={29} />
                  </div>

                  <div>
                    <span>YOUR ASCENDANT (LAGNA)</span>
                    <h3>{ascendant}</h3>
                    <p>{ascendantDegree}° · Vedic Sidereal</p>
                  </div>

                  <Stars
                    className="ascendant-decoration"
                    size={34}
                  />
                </div>

                {/* Planetary placements */}
                <div className="planet-section">
                  <div className="dashboard-section-heading">
                    <div>
                      <span className="section-eyebrow">
                        PLANETARY POSITIONS
                      </span>
                      <h2>Your planetary placements</h2>
                    </div>
                  </div>

                  <div className="planet-table-wrapper">
                    <table className="planet-table">
                      <thead>
                        <tr>
                          <th>Planet</th>
                          <th>Zodiac sign</th>
                          <th>Degree</th>
                          <th>House</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {planets.map((planet) => (
                          <tr key={planet.name}>
                            <td className="planet-name">
                              {planet.name}
                            </td>
                            <td>{planet.sign}</td>
                            <td>{planet.degree}°</td>
                            <td>{planet.house}</td>
                            <td>
                              <span
                                className={
                                  planet.retrograde
                                    ? "planet-retrograde"
                                    : "planet-direct"
                                }
                              >
                                {planet.retrograde
                                  ? "Retrograde"
                                  : "Direct"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : null}
          </section>

          {/* Cosmic tools */}
          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div>
                <span className="section-eyebrow">GET STARTED</span>
                <h2>Your cosmic tools</h2>
              </div>
            </div>

            <div className="dashboard-tool-grid">
              <article className="dashboard-tool-card">
                <div className="dashboard-tool-icon">
                  <Orbit size={23} />
                </div>
                <h3>Your Birth Chart</h3>
                <p>
                  Explore your planetary placements, houses and personalized
                  chart insights.
                </p>
                <Link to="/dashboard/chart">
                  Explore chart <ArrowRight size={16} />
                </Link>
              </article>

              <article className="dashboard-tool-card featured">
                <div className="dashboard-tool-icon">
                  <Sparkles size={23} />
                </div>
                <h3>Ask Melooha</h3>
                <p>
                  Ask questions and discover personalized insights grounded
                  in your birth chart.
                </p>
                <Link to="/dashboard/ask">
                  Start a conversation <ArrowRight size={16} />
                </Link>
              </article>

              <article className="dashboard-tool-card">
                <div className="dashboard-tool-icon">
                  <History size={23} />
                </div>
                <h3>Your History</h3>
                <p>
                  Revisit your previous questions and explore your conversations.
                </p>
                <Link to="/dashboard/history">
                  View history <ArrowRight size={16} />
                </Link>
              </article>
            </div>
          </section>

          <section className="dashboard-bottom-card">
            <div className="dashboard-bottom-icon">
              <Sun size={25} />
            </div>

            <div>
              <h3>Your journey is just beginning</h3>
              <p>
                Your personalized cosmic insights are waiting to be explored.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
