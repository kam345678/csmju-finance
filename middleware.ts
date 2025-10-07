import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "./src/lib/utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (!hasEnvVars) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ✅ ใช้ getUser() แทน getClaims()
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  // redirect ถ้า user ไม่ login และไม่อยู่หน้า login/auth
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return response;
}

// optional: กำหนดว่า middleware จะทำงานกับ path ไหนบ้าง
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
