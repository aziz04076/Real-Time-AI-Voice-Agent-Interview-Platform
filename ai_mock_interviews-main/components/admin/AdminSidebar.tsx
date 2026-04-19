"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  MessageSquare
} from "lucide-react";
import { signOut } from "@/lib/actions/auth.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminSidebar({ pathname: initialPathname }: { pathname?: string }) {
  const currentPath = usePathname() || initialPathname;
  const router = useRouter();

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Interviews", href: "/admin/interviews", icon: MessageSquare },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Profile Settings", href: "/admin/profile", icon: Settings },
  ];

  const onSignOut = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");

      router.push("/");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-dark-200 border-r border-white/5 h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <img src="/logo.svg" alt="logo" height="32" width="32" />
        <span className="font-bold text-xl tracking-tight text-white drop-shadow-[0_0_15px_rgba(202,197,254,0.5)]">
          PrepWise <span className="text-primary-200 text-sm align-super">PRO</span>
        </span>
      </div>

      <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive 
                  ? "bg-primary-200/10 text-primary-200 font-medium" 
                  : "text-light-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-200 rounded-r-md shadow-[0_0_10px_rgba(202,197,254,0.8)]" />
              )}
              <Icon className={`size-5 ${isActive ? "drop-shadow-[0_0_8px_rgba(202,197,254,0.5)]" : "opacity-70 group-hover:opacity-100 transition-opacity"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={onSignOut}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all font-medium"
        >
          <LogOut className="size-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
