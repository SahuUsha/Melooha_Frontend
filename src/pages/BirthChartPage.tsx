
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Orbit,
  RotateCcw,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import CosmicAuthBackground from "../components/common/CosmicAuthBackground";
import {
  getBirthChart,
  type BirthChartResponse,
} from "../services/chartService";
import { getChartValue, getPlanetData } from "../utils/chartUtils";

import "../index.css";

const signs = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const houses = [
  { house: 1, x: 150, y: 55 },
  { house: 2, x: 75, y: 55 },
  { house: 3, x: 25, y: 125 },
  { house: 4, x: 25, y: 225 },
  { house: 5, x: 75, y: 295 },
  { house: 6, x: 150, y: 295 },
  { house: 7, x: 225, y: 295 },
  { house: 8, x: 275, y: 225 },
  { house: 9, x: 275, y: 125 },
  { house: 10, x: 225, y: 55 },
  { house: 11, x: 150, y: 125 },
  { house: 12, x: 150, y: 225 },
];

function BirthChartPage() {
  const { user } = useAuth();

  const [chart, setChart] = useState<BirthChartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadChart = async () => {
    if (!user?.id) {
      setError("Please log in to view your birth chart.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await getBirthChart(user.id);
      setChart(data);
    } catch {
      setError("Unable to load your birth chart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadChart();
  }, [user?.id]);

  const planets = chart ? getPlanetData(chart) : [];

  const getPlanetsInHouse = (house: number) =>
    planets.filter((planet) => Number(planet.house) === house);

  const getSignForHouse = (house: number) => {
    const ascendant = Number(getChartValue(chart!, "ascendant.longitude"));
    const ascendantSign = Math.floor(ascendant / 30);
    return signs[(ascendantSign + house - 1) % 12];
  };

  return (
   <CosmicAuthBackground>
  <div className="birth-chart-page">
    <div className="birth-chart-content">
        <header className="birth-chart-header">
          <Link to="/dashboard" className="chart-back-link">
            <ArrowLeft size={18} />
            Dashboard
          </Link>

          <div className="chart-header-label">
            <Sparkles size={17} />
            YOUR COSMIC BLUEPRINT
          </div>

          <button
            className="chart-refresh-button"
            onClick={() => void loadChart()}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        <section className="birth-chart-intro">
          <span className="chart-eyebrow">VEDIC ASTROLOGY</span>
          <h1>Your Birth Chart</h1>
          <p>
            Explore your planetary placements and the cosmic arrangement
            at the time of your birth.
          </p>
        </section>

        {loading && (
          <div className="chart-message">
            <Orbit className="chart-loading-icon" size={30} />
            <p>Aligning your cosmic blueprint...</p>
          </div>
        )}

        {!loading && error && (
          <div className="chart-message chart-error">
            <p>{error}</p>
            <button onClick={() => void loadChart()}>
              <RotateCcw size={16} /> Try again
            </button>
          </div>
        )}

        {!loading && chart && (
          <>
            <section className="chart-birth-info">
              <div>
                <span>DATE & TIME</span>
                <strong>
                  {new Date(chart.birth_datetime).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: chart.timezone_name,
                  })}
                </strong>
              </div>
              <div>
                <span>BIRTH PLACE</span>
                <strong>{chart.birth_place}</strong>
              </div>
              <div>
                <span>ASCENDANT</span>
                <strong>{getChartValue(chart, "ascendant.sign")}</strong>
              </div>
            </section>

            <section className="kundli-section">
              <div className="kundli-heading">
                <div>
                  <span className="chart-eyebrow">NORTH INDIAN STYLE</span>
                  <h2>Rashi Chart · D1</h2>
                </div>
                <span className="chart-system-tag">Lahiri · Whole Sign</span>
              </div>

              <div className="kundli-card">
                <svg
                  viewBox="0 0 300 350"
                  className="kundli-svg"
                  role="img"
                  aria-label="North Indian style birth chart showing planetary placements"
                >
                  <rect
                    x="3"
                    y="3"
                    width="294"
                    height="344"
                    rx="4"
                    className="kundli-border"
                  />
                  <path
                    d="M150 3 L297 175 L150 347 L3 175 Z"
                    className="kundli-line"
                  />
                  <path
                    d="M3 3 L297 347 M297 3 L3 347"
                    className="kundli-line"
                  />
                  <path
                    d="M150 3 L150 347 M3 175 L297 175"
                    className="kundli-line faint"
                  />

                  {houses.map((item) => {
                    const housePlanets = getPlanetsInHouse(item.house);

                    return (
                      <g key={item.house}>
                        <text
                          x={item.x}
                          y={item.y}
                          className="kundli-house-number"
                        >
                          {item.house}
                        </text>
                        <text
                          x={item.x}
                          y={item.y + 17}
                          className="kundli-sign"
                        >
                          {getSignForHouse(item.house)}
                        </text>
                        <text
                          x={item.x}
                          y={item.y + 33}
                          className="kundli-planets"
                        >
                          {housePlanets
                            .map((planet) => planet.name.slice(0, 2))
                            .join(" · ") || "—"}
                        </text>
                      </g>
                    );
                  })}

                  <text x="150" y="169" className="kundli-center">
                    जन्म कुंडली
                  </text>
                  <text x="150" y="187" className="kundli-center-sub">
                    RASHI CHART
                  </text>
                </svg>
              </div>

              <p className="kundli-note">
                Planet abbreviations: Su Sun · Mo Moon · Ma Mars · Me Mercury
                · Ju Jupiter · Ve Venus · Sa Saturn · Ra Rahu · Ke Ketu
              </p>
            </section>

            <section className="chart-planets-section">
              <div className="kundli-heading">
                <div>
                  <span className="chart-eyebrow">PLANETARY DETAILS</span>
                  <h2>Planetary Positions</h2>
                </div>
              </div>

              <div className="chart-planet-grid">
                {planets.map((planet) => (
                  <article className="chart-planet-card" key={planet.name}>
                    <div className="planet-card-top">
                      <span className="planet-symbol">
                        {planet.name.slice(0, 1)}
                      </span>
                      <span className="planet-house">
                        House {planet.house}
                      </span>
                    </div>
                    <h3>{planet.name}</h3>
                    <p>{planet.sign}</p>
                    <div className="planet-degree">
                      {planet.degree}°
                    </div>
                    <span className="planet-motion">
                      {planet.retrograde ? "Retrograde" : "Direct"}
                    </span>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
          </div>
  </div>
</CosmicAuthBackground>
);
  
}

export default BirthChartPage;
