"use client";

import Link from "next/link";
import { Egg, ArrowRight, User, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-20 h-20 bg-primary-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-200">
            <Egg className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            EggSentry
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide uppercase">
            USeP Poultry
          </p>
          <p className="text-slate-500 mt-3 text-sm">
            Egg Counter with Tracking System
          </p>
        </div>

        {/* Login Card */}
        <div className="card animate-fade-in-up stagger-2">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-400 text-center mb-6">
            Sign in to access your egg production dashboard
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1.5">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter username"
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter password"
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="btn-primary w-full text-base py-3 justify-center"
          >
            Login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-300 mt-8">
          © {new Date().getFullYear()} EggSentry — USeP Poultry
        </p>
      </div>
    </div>
  );
}
