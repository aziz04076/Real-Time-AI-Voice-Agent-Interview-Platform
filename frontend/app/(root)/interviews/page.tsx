"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { Clock, Star, BrainCircuit, ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InterviewHistoryPage() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const res = await fetch(`/api/interviews?page=${page}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setInterviews(data.interviews || []);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch interview history", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [page]);

  return (
    <div className="inner-container py-10">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary-200 hover:text-primary-100 transition-colors text-sm font-medium w-fit">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-white tracking-tight">Interview History</h1>
          <p className="text-light-500 max-w-2xl">
            Review all your past mock interviews, scores, and AI feedback to track your progress over time.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] glass-dark rounded-[3rem] border border-white/5">
            <Loader2 className="size-10 text-primary-200 animate-spin" />
            <p className="mt-4 text-light-500 font-medium">Loading your history...</p>
          </div>
        ) : (
          <>
            {interviews.length === 0 ? (
              <div className="glass-dark p-20 rounded-[3rem] text-center border border-white/5">
                <BrainCircuit className="size-16 text-primary-500/20 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">No Interviews Yet</h2>
                <p className="text-light-500 mb-8 max-w-sm mx-auto">
                  You haven't completed any interviews yet. Start your first session to see your progress here.
                </p>
                <Button asChild className="btn-primary px-8 rounded-full">
                  <Link href="/interview">Start New Interview</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interviews.map((interview) => (
                  <Link 
                    key={interview._id} 
                    href={`/interviews/${interview._id}`}
                    className="glass-dark rounded-[2.5rem] p-8 border border-white/5 hover:border-primary-500/30 hover:bg-white/[0.02] transition-all group relative overflow-hidden flex flex-col h-full"
                  >
                    <div className="absolute top-0 right-0 p-6">
                      <div className="flex flex-col items-end">
                        <span className="text-3xl font-black text-white group-hover:text-primary-200 transition-colors">
                          {interview.score || 0}<span className="text-xs text-light-500 font-medium">/100</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6 flex-1 pr-12">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-200/60">
                           {interview.field || interview.type || "Technical"}
                        </span>
                        <h3 className="text-xl font-bold text-white capitalize line-clamp-1">{interview.jobRole || "General Role"}</h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-light-500 uppercase tracking-widest">
                         <div className="flex items-center gap-1.5">
                           <Star className="size-3" />
                           {dayjs(interview.createdAt).format("MMM DD")}
                         </div>
                         <div className="flex items-center gap-1.5">
                           <Clock className="size-3" />
                           {Math.round(interview.duration / 60) || 5} Min
                         </div>
                      </div>

                      <div className="text-sm text-light-500 leading-relaxed line-clamp-3 opacity-80 mt-auto">
                        {interview.overallFeedback || interview.feedback || "Awaiting final review."}
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between group-hover:border-primary-500/10 transition-colors">
                       <span className="text-xs font-bold text-primary-200 group-hover:translate-x-1 transition-transform">View Details</span>
                       <div className="size-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-black transition-all">
                          <ChevronRight className="size-4" />
                       </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 pb-10">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-full size-12 p-0 border-white/10 bg-white/5"
                >
                  <ChevronLeft className="size-5" />
                </Button>
                <div className="glass-dark px-6 py-3 rounded-full border border-white/10 text-sm font-bold text-white">
                  Page {page} of {pagination.totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="rounded-full size-12 p-0 border-white/10 bg-white/5"
                >
                  <ChevronRight className="size-5" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
