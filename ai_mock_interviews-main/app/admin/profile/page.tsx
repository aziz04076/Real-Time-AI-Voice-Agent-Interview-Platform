import { Metadata } from "next";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Image from "next/image";
import { ShieldCheck, Mail, Calendar, KeyRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Profile - PrepWise",
};

export default async function AdminProfilePage() {
  const user = await getCurrentUser();

  if (!user) return null;

  return (
    <div className="flex flex-col gap-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Administrator Profile</h1>
        <p className="text-light-400">Manage your administrative credentials and platform settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="col-span-1 md:col-span-1">
          <div className="glass-dark rounded-3xl p-8 border border-white/5 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-200/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative size-32 rounded-full overflow-hidden border-4 border-dark-200 shadow-[0_0_30px_rgba(202,197,254,0.3)] mb-6 z-10">
              <Image 
                src={(user as any).image || "/profile.svg"} 
                alt="Profile" 
                fill 

                className="object-cover"
              />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 relative z-10">{user.name}</h2>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-200/10 border border-primary-200/20 text-primary-200 text-xs font-bold uppercase tracking-widest relative z-10">
              <ShieldCheck className="size-4" />
              {user.role}
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="col-span-1 md:col-span-2">
          <div className="glass-dark rounded-3xl border border-white/5 flex flex-col overflow-hidden h-full">
            <div className="p-6 border-b border-white/5 bg-white/5">
              <h3 className="text-lg font-bold text-white">Account Details</h3>
            </div>
            
            <div className="p-6 flex flex-col gap-6">
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="p-3 rounded-lg bg-dark-200 text-primary-200">
                  <Mail className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-light-500 font-medium">Email Address</p>
                  <p className="text-white text-lg">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="p-3 rounded-lg bg-dark-200 text-blue-400">
                  <KeyRound className="size-5" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-light-500 font-medium">Password</p>
                    <p className="text-white text-lg">••••••••</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/5 text-sm font-medium hover:bg-white/10 transition-colors">
                    Change Password
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="p-3 rounded-lg bg-dark-200 text-green-400">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-light-500 font-medium">Role Status</p>
                  <p className="text-white text-lg flex items-center gap-2">
                    Active
                    <span className="size-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
