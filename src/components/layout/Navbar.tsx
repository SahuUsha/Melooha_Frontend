
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#101827]/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                <a href="/" className="flex items-center gap-2">
                    <Sparkles className="text-[#C9A45C]" size={27} />
                    <span className="font-serif text-2xl font-bold tracking-wide text-[#F5F0E6]">
                        Melooha
                    </span>
                </a>

                <div className="hidden items-center gap-9 md:flex">
                    <a href="#home" className="text-sm text-[#F5F0E6]/80 hover:text-[#C9A45C]">Home</a>
                    <a href="#features" className="text-sm text-[#F5F0E6]/80 hover:text-[#C9A45C]">Features</a>
                    <a href="#about" className="text-sm text-[#F5F0E6]/80 hover:text-[#C9A45C]">About</a>
                </div>

                <div className="hidden items-center gap-5 md:flex">
                    <a href="/login" className="text-sm text-[#F5F0E6] hover:text-[#C9A45C]">
                        Login
                    </a>
                    <a href="/register" className="rounded-lg bg-[#C9A45C] px-5 py-2.5 text-sm font-semibold text-[#101827] transition hover:bg-[#E8D8B9]">
                        Get Started
                    </a>
                </div>

                <button
                    className="text-[#F5F0E6] md:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    {menuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {menuOpen && (
                <div className="flex flex-col gap-5 border-t border-white/10 bg-[#101827] px-6 py-6 md:hidden">
                    <a href="#home" onClick={() => setMenuOpen(false)} className="text-[#F5F0E6]">Home</a>
                    <a href="#features" onClick={() => setMenuOpen(false)} className="text-[#F5F0E6]">Features</a>
                    <a href="#about" onClick={() => setMenuOpen(false)} className="text-[#F5F0E6]">About</a>
                    <a href="/login" className="text-[#F5F0E6]">Login</a>
                    <a href="/register" className="text-[#C9A45C]">Get Started</a>
                </div>
            )}
        </nav>
    );
}
