'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, Mail, LogIn, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isFocused, setIsFocused] = useState({ email: false, password: false });

    const handleSubmit = () => {
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            if (email === 'azizalhadiid88@admin.com' && password === 'admin123') {
                alert('Login berhasil! 🎉');
            } else {
                setError('Email atau password salah. Coba lagi.');
            }
            setIsLoading(false);
        }, 1500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && email && password) {
            handleSubmit();
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-slate-50 via-orange-50 to-slate-100 relative overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDuration: '7s' }} />
                <div className="absolute top-40 right-10 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDuration: '9s', animationDelay: '2s' }} />
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Card className="backdrop-blur-sm bg-white/90 shadow-2xl border-0">
                    <CardHeader className="space-y-3 text-center pb-6">
                        <div className="mx-auto w-16 h-16 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-bold bg-linear-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                            Admin Portal
                        </CardTitle>
                        <CardDescription className="text-base text-slate-600">
                            Welcome back, Aziz! Please sign in to continue.
                        </CardDescription>
                    </CardHeader>

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
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                    Email Address
                                </Label>
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
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                    Password
                                </Label>
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
                                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">
                                        Remember me
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => alert('Please contact support to reset your password')}
                                    className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                                >
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

                            {/* Demo Credentials */}
                            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-xs text-slate-500 font-medium mb-2">Demo Credentials:</p>
                                <p className="text-xs text-slate-600">Email: Aziz@admin.com</p>
                                <p className="text-xs text-slate-600">Password: admin123</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-slate-600">
                    <p>© 2025 EasyFolio by Aziz. All rights reserved.</p>
                </div>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: fade-in 0.7s ease-out;
        }
      `}</style>
        </div>
    );
}