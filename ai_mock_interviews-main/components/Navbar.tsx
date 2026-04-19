"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth.action";

const Navbar = ({ user }: { user: any }) => {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/sign-in";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5">
      <div className="max-w-7xl mx-auto px-16 max-sm:px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="PrepWise Logo" width="32" height="32" />
          <h2 className="text-primary-100 text-xl font-bold tracking-tight">PrepWise</h2>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="nav-link">Features</Link>
          <Link href="/#pricing" className="nav-link">Pricing</Link>
          {user && (
            <>
              <Link href="/dashboard" className={`nav-link ${pathname === "/dashboard" ? "text-primary-200" : ""}`}>
                Dashboard
              </Link>
              {(user.role === "admin" || user.isAdmin) && (
                <Link href="/admin" className={`nav-link text-primary-200 font-semibold ${pathname.startsWith("/admin") ? "border-b-2 border-primary-200" : ""}`}>
                  Admin Panel
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-light-100 hidden sm:block">Hi, {user.name?.split(" ")[0]}</span>
              <Button asChild variant="ghost" className="rounded-full w-10 h-10 p-0 overflow-hidden border border-white/10">
                <Link href="/profile">
                  <Image src={user.image || "/profile.svg"} alt="Profile" width={40} height={40} className="object-cover" />
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="text-light-100 hover:text-red-500 transition-colors"
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" className="nav-link hidden sm:flex">
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button asChild className="btn-primary">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
