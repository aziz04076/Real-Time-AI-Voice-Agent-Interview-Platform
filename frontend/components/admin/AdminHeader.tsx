"use client";

import { Bell, Search, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminHeader({ user }: { user: any }) {
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      toast.info("Global search coming in v2.0. Please use the local search on the Users page.");
      (e.target as HTMLInputElement).value = '';
    }
  };

  const handleNotifications = () => {
    toast("No new notifications", {
      description: "You're all caught up!",
    });
  };

  return (
    <header className="h-20 border-b border-white/5 bg-dark-200/50 backdrop-blur-xl sticky top-0 z-40 px-6 md:px-10 flex items-center justify-between">
      <div className="flex items-center gap-4 md:hidden">
        <button className="p-2 text-light-400 hover:text-white">
          <Menu className="size-6" />
        </button>
      </div>

      <div className="hidden md:flex items-center glass rounded-full px-4 py-2 border border-white/10 w-96 max-w-md focus-within:border-primary-200/50 transition-colors">
        <Search className="size-4 text-light-500 mr-3" />
        <input 
          type="text" 
          placeholder="Search users, interviews, metrics... (Press Enter)" 
          onKeyDown={handleSearch}
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-light-600"
        />
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={handleNotifications}
          className="relative p-2 text-light-400 hover:text-white transition-colors group"
        >
          <Bell className="size-5 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
        </button>

        <div className="h-8 w-px bg-white/10 hidden md:block" />

        <Link href="/admin/profile" className="flex items-center gap-4 hover:bg-white/5 p-1.5 pr-4 rounded-full transition-colors border border-transparent hover:border-white/10 group cursor-pointer">
          <div className="relative size-10 rounded-full overflow-hidden border-2 border-primary-200/50 group-hover:border-primary-200 transition-colors shadow-[0_0_15px_rgba(202,197,254,0.15)]">
            <Image 
              src={user.image || "/profile.svg"} 
              alt="Admin Profile" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-bold text-white leading-tight">{user.name}</span>
            <span className="text-xs text-primary-200 uppercase tracking-wider font-semibold opacity-80">{user.role}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
