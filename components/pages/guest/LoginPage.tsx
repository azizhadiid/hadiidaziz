'use client'

import { Card } from '@/components/ui/card';
import { LoginBackground } from '../components/auth/LoginBackground';
import { LoginHeader } from '../components/auth/LoginHeader';
import { LoginForm } from '../form/LoginForm';
import { LoginFooter } from '../components/auth/LoginFooter';
export default function AdminLoginPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-slate-50 via-orange-50 to-slate-100 relative overflow-hidden">

            {/* 1. Animated Background */}
            <LoginBackground />

            {/* Main Container */}
            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

                <Card className="backdrop-blur-sm bg-white/90 shadow-2xl border-0">
                    {/* 2. Header (Icon & Title) */}
                    <LoginHeader />

                    {/* 3. The Logic (Form) */}
                    <LoginForm />
                </Card>

                {/* 4. Footer */}
                <LoginFooter />

            </div>
        </div>
    );
}