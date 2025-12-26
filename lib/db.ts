import { createBrowserClient } from '@supabase/ssr'

// Fungsi ini membuat client Supabase yang otomatis mengurus Cookies
// agar bisa dibaca oleh Middleware/Server.
const createClient = () =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

// Kita export instance-nya langsung agar tidak perlu merubah banyak kode di LoginForm
const supabase = createClient();

export default supabase;