'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/db';
import toast from 'react-hot-toast';

// UI Components
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

    // --- 1. VALIDASI INPUT ---
    const validateForm = () => {
        if (!email || !email.includes('@')) {
            const msg = 'Format email tidak valid.';
            setError(msg);
            toast.error(msg);
            return false;
        }
        if (!password || password.length < 6) { // Supabase default min 6
            const msg = 'Password terlalu pendek.';
            setError(msg);
            toast.error(msg);
            return false;
        }
        return true;
    };

    // --- 2. HANDLE LOGIN & CEK ROLE ---
    const handleSubmit = async () => {
        setError('');
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // A. Login ke Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // B. CEK ROLE di tabel user_profiles
                // Kita ambil data role berdasarkan ID user yang baru login
                const { data: profileData, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('role')
                    .eq('id', authData.user.id)
                    .single();

                if (profileError) {
                    // Jika gagal ambil profile (misal koneksi putus)
                    await supabase.auth.signOut(); // Logout paksa
                    throw new Error("Gagal memverifikasi profil pengguna.");
                }

                // C. VALIDASI ROLE ADMIN
                if (profileData?.role !== 'admin') {
                    // Jika role BUKAN admin
                    await supabase.auth.signOut(); // Logout paksa
                    throw new Error("Akses Ditolak: Anda bukan Admin.");
                }

                // D. JIKA SUKSES & ADMIN
                toast.success('Selamat datang, Admin!', {
                    duration: 3000,
                    icon: '🎉',
                });

                // Redirect ke Dashboard
                router.push('/admin/dashboard');
                router.refresh(); // Refresh agar middleware server-side mendeteksi session baru
            }

        } catch (err: any) {
            console.error("Login Error:", err);
            let errorMessage = 'Terjadi kesalahan saat login.';

            if (err.message.includes('Invalid login credentials')) {
                errorMessage = 'Email atau password salah.';
            } else if (err.message.includes('Email not confirmed')) {
                errorMessage = 'Email belum diverifikasi.';
            } else {
                errorMessage = err.message;
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
                        <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isFocused.email ? 'text-orange-500' : 'text-slate-400'}`} />
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setIsFocused({ ...isFocused, email: true })}
                            onBlur={() => setIsFocused({ ...isFocused, email: false })}
                            onKeyPress={handleKeyPress}
                            className="pl-11 h-12 border-slate-200 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300 rounded-xl"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                    <div className="relative group">
                        <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isFocused.password ? 'text-orange-500' : 'text-slate-400'}`} />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setIsFocused({ ...isFocused, password: true })}
                            onBlur={() => setIsFocused({ ...isFocused, password: false })}
                            onKeyPress={handleKeyPress}
                            className="pl-11 pr-11 h-12 border-slate-200 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300 rounded-xl"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Login Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={!email || !password || isLoading}
                    className="w-full h-12 mt-4 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-lg hover:shadow-xl rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Checking Access...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <LogIn className="w-5 h-5" />
                            Sign In as Admin
                        </div>
                    )}
                </Button>
            </div>
        </CardContent>
    );
}