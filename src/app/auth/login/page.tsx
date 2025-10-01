// // src/app/auth/page.tsx
// "use client";

// import { useState } from "react";
// import { supabase } from "@/lib/supabase/client";
// import { useRouter } from "next/navigation";

// export default function AuthPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isSignup, setIsSignup] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//  const handleAuth = async () => {
//   setError(null);

//   if (isSignup) {
//     // SignUp (เหมือนเดิม)
//     const { data, error } = await supabase.auth.signUp({ email, password });
//     if (error) {
//       setError(error.message);
//     } else {
//       const user = data.user;
//       if (user) {
//         await supabase.from("Users").insert([
//           { id: user.id, email: user.email }
//         ]);
//       }
//       alert("Check your email for confirmation link!");
//     }
//   } else {
//     // SignIn
//     const { data, error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) {
//       setError(error.message);
//     } else {
//       // เช็คอีเมล
//       const user = data.user;
//       if (user?.email === "a@example.com") {
//         router.push("/pageA");
//       } else if (user?.email === "b@example.com") {
//         router.push("/pageB");
//       } else {
//         router.push("/dashboard"); // default
//       }
//     }
//   }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-md">
//         <h1 className="text-2xl font-bold mb-4 text-center">
//           {isSignup ? "Sign Up" : "Sign In"}
//         </h1>
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full px-4 py-2 mb-3 border rounded-lg"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full px-4 py-2 mb-3 border rounded-lg"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
//         <button
//           onClick={handleAuth}
//           className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
//         >
//           {isSignup ? "Sign Up" : "Sign In"}
//         </button>
//         <p className="mt-4 text-center text-sm">
//           {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
//           <span
//             onClick={() => setIsSignup(!isSignup)}
//             className="text-blue-600 cursor-pointer"
//           >
//             {isSignup ? "Sign in" : "Sign up"}
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }

// src/app/auth/page.tsx
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        //  เมื่อ Login สำเร็จ → redirect ได้เลย
        const email = session.user.email;

        if (email === "tk.kam23132@gmail.com") {
          router.push("/admin/dashboard");
        } else if (email === "b@example.com") {
          router.push("/pageB");
        } else {
          router.push("/user/dashboard");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div>
      <nav className="border-b border-b-foreground/20 shadow-md w-full sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-white">
              MyApp
            </Link>
            {/* Menu */}
            <div className="flex space-x-6">
              {/* ปุ่ม Login */}
              <Link
                href="/auth/login"
                className=" text-white px-4 py-2 rounded-lg hover:bg-blue-700/30 transition border border-white">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex items-center justify-center min-h-screen bg-gray-950/10 ">
        <div className="max-w-md w-full bg-gray-900/60 p-6 rounded-2xl  shadow-md border-1 border-gray-300/60">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
                variables: {
                default: {
                colors: {
                inputText: "#900",       // บังคับให้ข้อความ input เป็นสีขาว
                
                // inputBackground: "#111827", // (optional) เปลี่ยน bg ของ input
                // inputBorder: "#374151",     // border สีเทาเข้ม
                },
              },
            },
              className: {
                
                button: "bg-green-700 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg",
                input: "border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-400",
                label: "text-sm font-medium text-gray-700",
                message: " bg-bg-gray-950/10 text-red-500 text-sm", // error message
              }, 
            }}
            providers={[]} // ถ้าอยากเพิ่ม Google, GitHub ใส่ ["google", "github"]
          />
        </div>
      </div>
    </div>
  );
}