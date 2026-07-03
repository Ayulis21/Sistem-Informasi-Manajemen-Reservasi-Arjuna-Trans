import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react"; // Menggunakan Router bawaan Inertia
import {
    Lock,
    User,
    BarChart3,
    ArrowRight,
    Loader2,
    ArrowLeft,
    Bus,
} from "lucide-react";

const Login: React.FC = () => {
    // Menggunakan useForm bawaan Inertia untuk mengirim data langsung ke Backend Laravel
    const { data, setData, post, processing, errors } = useForm({
        username: "",
        password: "",
    });

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();

    //     // Mengirim data login ke route backend Laravel bernama 'login'
    //     post(route("login"), {
    //         onFinish: () => {
    //             // Logika opsional setelah proses pengiriman data selesai
    //         },
    //     });
    // };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Menggunakan window.location.href agar langsung melompat instan ke halaman dashboard admin
        window.location.href = "/dashboard";
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F1F3F6] font-sans px-4">
            <div className="w-full max-w-[340px]">
                <div className="bg-white rounded-[24px] p-6 shadow-[0_15px_45px_-10px_rgba(0,0,0,0.05)] text-center relative">
                    {/* Mengubah href ke route root '/' Laravel */}
                    <div className="flex justify-center mb-5">
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] hover:text-indigo-600 transition-all"
                        >
                            <ArrowLeft size={12} />
                            KEMBALI KE BERANDA
                        </Link>
                    </div>

                    <div className="mb-6">
                        <div className="w-16 h-16 mx-auto relative mb-4">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full"></div>
                            <div className="absolute inset-0 bg-blue-500 rounded-full clip-path-wave"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[6px] bg-white -rotate-[25deg] shadow-sm"></div>
                            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[3px] bg-white -rotate-[25deg] opacity-80"></div>

                            <svg
                                viewBox="0 0 100 100"
                                className="absolute inset-0 w-full h-full shadow-lg rounded-full"
                            >
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="50"
                                    fill="url(#logoGradient)"
                                />
                                <path
                                    d="M0,50 C20,30 80,70 100,50 L100,100 L0,100 Z"
                                    fill="#3B82F6"
                                />
                                <path
                                    d="M0,50 C20,30 80,70 100,50"
                                    stroke="white"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    d="M0,42 C20,22 80,62 100,42"
                                    stroke="white"
                                    strokeWidth="2"
                                    fill="none"
                                    opacity="0.6"
                                />
                                <defs>
                                    <linearGradient
                                        id="logoGradient"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="100%"
                                    >
                                        <stop offset="0%" stopColor="#FB923C" />
                                        <stop
                                            offset="100%"
                                            stopColor="#F97316"
                                        />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        <div className="space-y-0.5">
                            <h1 className="text-[24px] font-bold text-slate-900 tracking-tight leading-tight">
                                Arjuna Trans
                            </h1>
                            <p className="text-[#94A3B8] text-[11px] font-medium italic">
                                Sistem Informasi Penjadwalan Armada
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 text-left"
                    >
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest ml-1">
                                USERNAME
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#5346F1] transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={data.username}
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200/60 rounded-xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-350 font-medium text-slate-700 text-sm shadow-sm"
                                    placeholder="admin_arjuna"
                                />
                            </div>
                            {errors.username && (
                                <span className="text-red-500 text-xs mt-1">
                                    {errors.username}
                                </span>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest ml-1">
                                PASSWORD
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#5346F1] transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200/60 rounded-xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-350 font-medium text-slate-700 text-sm shadow-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <span className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#5346F1] hover:bg-[#4338CA] text-white font-bold py-2.5 rounded-xl shadow-[0_8px_24px_-4px_rgba(83,70,241,0.25)] flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
                        >
                            {processing ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    <span className="uppercase tracking-widest text-[11px] font-bold">
                                        LOGIN DASHBOARD
                                    </span>
                                    <ArrowRight size={16} strokeWidth={2.5} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
