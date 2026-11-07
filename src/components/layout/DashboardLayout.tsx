
import { Link, NavLink, Outlet, useNavigate  } from "react-router-dom";
import {
    Sparkles,
    LayoutDashboard,
    Orbit,
    MessageCircle,
    History,
    UserRound,
    Settings,
    LogOut,
    Coins,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const navigation = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard", end: true },
    { label: "Birth Chart", icon: Orbit, href: "/dashboard/chart" },
    { label: "Ask Melooha", icon: MessageCircle, href: "/dashboard/ask" },
    { label: "History", icon: History, href: "/dashboard/history" },
    { label: "Question Credits", icon: Coins, href: "/dashboard/credits" },
    { label: "Profile", icon: UserRound, href: "/dashboard/profile" },
];

export default function DashboardLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="cosmos-page dashboard-page">
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
                            <NavLink
                                key={item.label}
                                to={item.href}
                                end={item.end}
                                className={({ isActive }) =>
                                    `dashboard-nav-item ${isActive ? "active" : ""}`
                                }
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="dashboard-sidebar-bottom">
                    <Link to="/dashboard/settings" className="dashboard-nav-item">
                        <Settings size={18} />
                        <span>Settings</span>
                    </Link>

                    <button className="dashboard-nav-item" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Sign out</span>
                    </button>
                </div>
            </aside>

            <div className="dashboard-main">
                <Outlet />
            </div>
        </div>
    );
}
