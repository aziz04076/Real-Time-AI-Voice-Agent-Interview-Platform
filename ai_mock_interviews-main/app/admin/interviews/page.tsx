import { Metadata } from "next";
import { MessageSquare, CalendarClock } from "lucide-react";

export const metadata: Metadata = {
  title: "Interviews Log - Admin",
};

export default function AdminInterviewsPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Interview Logs</h1>
        <p className="text-light-400">Review transcripts and scorings for all candidate interviews.</p>
      </div>

      <div className="glass-dark rounded-3xl border border-white/5 p-12 text-center flex flex-col items-center justify-center mt-4">
        <div className="size-20 rounded-full bg-primary-200/10 border border-primary-200/20 flex items-center justify-center mb-6">
          <MessageSquare className="size-10 text-primary-200" />
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">Interview Logs Coming Soon</h3>
        <p className="text-light-500 mt-2 max-w-md mx-auto">
          The deep-dive interview transcript grid is under active development. Check back later to view per-session recording logs.
        </p>
        
        <div className="mt-8 flex items-center gap-2 text-primary-200 font-medium bg-primary-200/10 px-4 py-2 rounded-full border border-primary-200/20">
          <CalendarClock className="size-4" />
          Scheduled for v2.1
        </div>
      </div>
    </div>
  );
}
