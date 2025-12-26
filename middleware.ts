import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // LOG KE TERMINAL VS CODE
    console.log(`[Middleware] Mengakses: ${request.nextUrl.pathname}`);

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                    })
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // Ambil User
    const { data: { user } } = await supabase.auth.getUser()

    // LOG STATUS USER
    console.log(`[Middleware] User ID: ${user ? user.id : 'Belum Login'}`);

    // Proteksi Route /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // A. Belum Login
        if (!user) {
            console.log("[Middleware] 🔴 Ditolak: Belum login, redirect ke login.");
            return NextResponse.redirect(new URL('/login', request.url)) // Pastikan '/login' sesuai url loginmu
        }

        // B. Cek Role di DB
        const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        // LOG ROLE
        console.log(`[Middleware] Role User: ${profile?.role}`);
        if (error) console.error(`[Middleware] ❌ Error Fetch Profile: ${error.message}`);

        // C. Bukan Admin
        if (profile?.role !== 'admin') {
            console.log("[Middleware] ⛔ Ditolak: Role bukan admin, redirect ke Home.");
            return NextResponse.redirect(new URL('/', request.url))
        }

        console.log("[Middleware] 🟢 Akses Diterima: Admin.");
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}