import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export function LoginHeader() {
    return (
        <CardHeader className="space-y-3 text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl bg-linear-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                Admin Portal
            </CardTitle>
            <CardDescription className="text-base text-slate-600">
                Welcome back, Aziz! Please sign in to continue.
            </CardDescription>
        </CardHeader>
    );
}