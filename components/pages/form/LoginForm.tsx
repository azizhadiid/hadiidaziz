'use client'

import React, { useState } from 'react';

import { useRouter } from 'next/navigation'; // Import Router
import supabase from '@/lib/db'; // Import Supabase kamu
import toast from 'react-hot-toast'; // Import Toast

// UI Components (Pastikan path import ini sesuai struktur foldermu)
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, Mail, LogIn, AlertCircle } from 'lucide-react';

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isFocused, setIsFocused] = useState({ email: false, password: false });

    // --- LOGIKA BARU: VALIDASI ---
    const validateForm = () => {
        if (!email || !email.includes('@')) {
            const msg = 'Format email tidak valid.';
            setError(msg);
            toast.error(msg);
            return false;
        }
        if (!password || password.length < 8) {
            const msg = 'Password harus minimal 8 karakter.';
            setError(msg);
            toast.error(msg);
            return false;
        }
        return true;
    };

    // --- LOGIKA BARU: HANDLE SUBMIT KE SUPABASE ---
    const handleSubmit = async () => {
        setError('');

        // 1. Cek Validasi
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // 2. Kirim ke Supabase Auth
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (authError) {
                throw authError; // Lempar ke catch jika error
            }

            // 3. Jika Sukses
            if (data.user) {
                toast.success('Login berhasil! Mengalihkan...', {
                    duration: 3000,
                    icon: '🎉',
                });
                // Redirect ke Dashboard Admin
                router.push('/admin/dashboard');
            }

        } catch (err: any) {
            // 4. Handle Error
            console.error("Login Error:", err);
            let errorMessage = 'Terjadi kesalahan saat login.';

            if (err.message.includes('Invalid login credentials')) {
                errorMessage = 'Email atau password salah. Coba lagi.';
            } else if (err.message.includes('Email not confirmed')) {
                errorMessage = 'Email belum diverifikasi.';
            } else {
                errorMessage = err.message; // Error lain dari Supabase
            }

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && email && password) {
            handleSubmit();
        }
    };

    return (
        <CardContent>
            <div className="space-y-5">
                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-300">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
                    <div className="relative group">
                        <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isFocused.email ? 'text-orange-500' : 'text-slate-400'
                            }`} />
                        <Input
                            id="email"
                            type="email"
                            placeholder="Aziz@admin.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setIsFocused({ ...isFocused, email: true })}
                            onBlur={() => setIsFocused({ ...isFocused, email: false })}
                            onKeyPress={handleKeyPress}
                            className="pl-11 h-12 border-slate-200 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                    <div className="relative group">
                        <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isFocused.password ? 'text-orange-500' : 'text-slate-400'
                            }`} />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setIsFocused({ ...isFocused, password: true })}
                            onBlur={() => setIsFocused({ ...isFocused, password: false })}
                            onKeyPress={handleKeyPress}
                            className="pl-11 pr-11 h-12 border-slate-200 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                        />
                        <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
                    </label>
                    <button type="button" onClick={() => alert('Please contact support')} className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                        Forgot password?
                    </button>
                </div>

                {/* Login Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={!email || !password || isLoading}
                    className="w-full h-12 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Signing in...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <LogIn className="w-5 h-5" />
                            Sign In
                        </div>
                    )}
                </Button>
            </div>
        </CardContent>
    );
}