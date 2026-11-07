
import {
    Sparkles,
    Moon,
    Sun,
    Orbit,
    Stars,
    ArrowRight,
    MessageCircle,
    Telescope,
    Compass,
    ChevronDown,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";

const features = [
    {
        icon: Orbit,
        title: "Your Cosmic Blueprint",
        text: "Explore your personalized Vedic birth chart, planetary placements and houses.",
    },
    {
        icon: MessageCircle,
        title: "Conversations with AI",
        text: "Ask meaningful questions and receive personalized, knowledge-grounded guidance.",
    },
    {
        icon: Telescope,
        title: "Discover Your Universe",
        text: "Explore astrological insights through a modern and intelligent experience.",
    },
];

const starsData = Array.from({ length: 85 }, (_, i) => ({
    left: `${(i * 37 + 13) % 100}%`,
    top: `${(i * 61 + 7) % 100}%`,
    delay: `${(i % 9) * 0.45}s`,
    duration: `${2 + (i % 5)}s`,
    size: i % 7 === 0 ? "3px" : "2px",
}));

export default function LandingPage() {
    return (
        <main className="cosmos-page">
            {/* Animated space background */}
            <div className="cosmos-bg">
                <div className="nebula nebula-one" />
                <div className="nebula nebula-two" />

                {starsData.map((star, index) => (
                    <span
                        key={index}
                        className="cosmic-star"
                        style={{
                            left: star.left,
                            top: star.top,
                            width: star.size,
                            height: star.size,
                            animationDelay: star.delay,
                            animationDuration: star.duration,
                        }}
                    />
                ))}

                <span className="shooting-star shooting-one" />
                <span className="shooting-star shooting-two" />
                <span className="shooting-star shooting-three" />
            </div>

            <Navbar />

            {/* Hero section */}
            <section id="home" className="cosmos-hero">
                <div className="hero-content">
                    <div className="hero-tag">
                        <Sparkles size={15} />
                        <span>ANCIENT WISDOM · MODERN INTELLIGENCE</span>
                    </div>

                    <h1>
                        The universe has
                        <br />
                        a story.
                        <span className="gold-title"> Discover yours.</span>
                    </h1>

                    <p className="hero-description">
                        Your stars, your story, your journey. Explore the wisdom of Vedic
                        astrology through your personalized birth chart and an intelligent
                        AI companion.
                    </p>

                    <div className="hero-actions">
                        <a href="/register" className="primary-action">
                            Begin Your Journey
                            <ArrowRight size={19} />
                        </a>

                        <a href="#features" className="secondary-action">
                            Explore the Cosmos
                            <Stars size={18} />
                        </a>
                    </div>

                    <div className="hero-trust">
                        <span><Sparkles size={15} /> Personalized birth chart</span>
                        <span><Moon size={15} /> Vedic astrology</span>
                    </div>
                </div>

                {/* Planet and orbital animation */}
                <div className="cosmic-art">
                    <div className="planet-glow" />

                    <div className="orbit orbit-outer">
                        <span className="orbit-dot dot-gold" />
                    </div>

                    <div className="orbit orbit-middle">
                        <span className="orbit-dot dot-purple" />
                    </div>

                    <div className="orbit orbit-inner" />

                    <div className="planet">
                        <div className="planet-shine" />
                        <div className="planet-crater crater-one" />
                        <div className="planet-crater crater-two" />
                        <div className="planet-crater crater-three" />
                        <div className="planet-center">
                            <Sun size={65} strokeWidth={1} />
                            <span>YOUR COSMOS</span>
                            <small>A JOURNEY WITHIN</small>
                        </div>
                    </div>

                    <div className="floating-symbol symbol-moon">
                        <Moon size={32} />
                    </div>

                    <div className="floating-symbol symbol-sparkle">
                        <Sparkles size={27} />
                    </div>

                    <div className="floating-symbol symbol-orbit">
                        <Orbit size={30} />
                    </div>

                    <div className="floating-symbol symbol-stars">
                        <Stars size={25} />
                    </div>

                    <div className="planet-label label-one">✦ YOUR DESTINY</div>
                    <div className="planet-label label-two">✧ COSMIC ENERGY</div>
                </div>

                <a href="#features" className="scroll-indicator">
                    <span>SCROLL TO EXPLORE</span>
                    <ChevronDown size={18} />
                </a>
            </section>

            {/* Features */}
            <section id="features" className="cosmos-features">
                <div className="section-heading">
                    <span className="section-eyebrow">THE MELooha EXPERIENCE</span>
                    <h2>
                        More than astrology.
                        <span> A journey of discovery.</span>
                    </h2>
                    <p>
                        Ancient Vedic knowledge meets intelligent technology to help you
                        explore your own cosmic blueprint.
                    </p>
                </div>

                <div className="feature-grid">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <article className="cosmos-card" key={feature.title}>
                                <div className="card-top">
                                    <div className="feature-icon">
                                        <Icon size={29} />
                                    </div>
                                    <span>0{index + 1}</span>
                                </div>

                                <h3>{feature.title}</h3>
                                <p>{feature.text}</p>

                                <div className="card-decoration">
                                    <Sparkles size={16} />
                                    <span>DISCOVER MORE</span>
                                    <ArrowRight size={16} />
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            {/* Experience section */}
            <section id="about" className="cosmos-about">
                <div className="about-visual">
                    <div className="about-orbit about-orbit-one" />
                    <div className="about-orbit about-orbit-two" />
                    <div className="about-sun">
                        <Sun size={75} strokeWidth={0.9} />
                    </div>
                    <Sparkles className="about-star" size={28} />
                </div>

                <div className="about-content">
                    <span className="section-eyebrow">A SPACE THAT IS YOURS</span>

                    <h2>
                        Find meaning in
                        <span> your own stars.</span>
                    </h2>

                    <p>
                        Every birth chart tells a unique story. Begin with your birth
                        details, discover your personalized chart, and explore your
                        questions with Melooha.
                    </p>

                    <a href="/register" className="primary-action">
                        Start Exploring <ArrowRight size={18} />
                    </a>
                </div>
            </section>

            {/* Final CTA */}
            <section className="cosmos-cta">
                <div className="cta-box">
                    <Compass size={36} />
                    <span className="section-eyebrow">YOUR COSMIC JOURNEY AWAITS</span>

                    <h2>
                        Ready to discover
                        <span> your universe?</span>
                    </h2>

                    <p>
                        Create your account and begin your personalized astrology
                        experience.
                    </p>

                    <a href="/register" className="primary-action">
                        Create Your Account <ArrowRight size={18} />
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="cosmos-footer">
                <div className="footer-brand">
                    <Sparkles size={22} />
                    <span>Melooha</span>
                </div>

                <p>Explore your cosmic journey.</p>

                <a href="#home">Back to the stars ↑</a>
            </footer>
        </main>
    );
}
