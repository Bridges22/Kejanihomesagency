import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"
import { createServerClient } from "@supabase/ssr"

export default async function middleware(req: NextRequest) {
  // 1. Update Supabase session
  let supabaseResponse = await updateSession(req);
  
  // 2. Create a client solely for the purpose of checking the user
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request: req,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Protect /host routes
  if (req.nextUrl.pathname.startsWith("/host")) {
    if (req.nextUrl.pathname.startsWith("/host/login")) {
      return supabaseResponse;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL("/host/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/host",
    "/host/:path*",
    "/api/listings",
    "/api/unlocks",
    "/api/bookings"
  ]
}
