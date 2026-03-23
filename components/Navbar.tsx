"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Egg, History, Menu, X, Settings } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Dashboard", icon: Egg },
  { href: "/history", label: "History", icon: History },
];

interface NavbarProps {
  onModifyCamera?: () => void;
}

export default function Navbar({ onModifyCamera }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Egg className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                USeP Poultry
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 -mt-1 font-medium tracking-wide uppercase">
                Egg Counter with Tracking System
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            {onModifyCamera && (
              <button
                onClick={onModifyCamera}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-gray-50 transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                Modify Camera
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-gray-50 transition"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 animate-fade-in-up">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mt-1 ${
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-500 hover:text-slate-800 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          {onModifyCamera && (
            <button
              onClick={() => {
                setMobileOpen(false);
                onModifyCamera();
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-gray-50 transition-all mt-1 w-full"
            >
              <Settings className="w-4 h-4" />
              Modify Camera
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
