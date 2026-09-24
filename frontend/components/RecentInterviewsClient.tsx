"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Clock, Star, BrainCircuit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getInterviewLogo } from "@/lib/utils";

export default function RecentInterviewsClient() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await fetch("/api/interviews?limit=5");
        if (res.ok) {
          const data = await res.json();
          setInterviews(data.interviews || []);
        }
      } catch (error) {
        console.error("Failed to fetch recent interviews", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, []);

  if (loading) {
    return (
      <div className="glass-dark p-10 rounded-3xl text-center border border-white/5 flex flex-col items-center justify-center min-h-[200px]">
        <div className="size-6 border-2 border-primary-200 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-light-500 text-sm">Loading recent sessions...</p>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="glass-dark p-10 rounded-3xl text-center border border-white/5">
        <p className="text-light-100 mb-2 font-bold">No interviews found</p>
        <p className="text-sm text-light-500">You haven&apos;t taken any mock interviews yet. Time to start practicing!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {interviews.map((interview) => (
        <Link 
          key={interview._id} 
          href={`/interviews/${interview._id}`}
          className="glass rounded-[2rem] p-6 border border-white/5 hover:bg-white/[0.04] hover:border-primary-500/30 transition-all relative overflow-hidden group block"
        >
          <div className="absolute top-0 right-0 p-4">
             <div className="flex flex-col items-end">
                <span className="text-2xl font-black text-white">{interview.score || 0}<span className="text-sm text-light-500 font-medium">/100</span></span>
             </div>
          </div>
          
          <div className="flex items-start gap-4 pr-20">
            <Image 
              src={getInterviewLogo(interview.field || interview.type)} 
              alt="logo" 
              width={48} 
              height={48} 
              className="rounded-full size-12 border border-white/10 group-hover:border-primary-500/30 transition-all object-cover"
            />
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-bold text-white capitalize group-hover:text-primary-200 transition-colors">{interview.jobRole || "General Role"}</h3>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-light-400">
                <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md">
                  <BrainCircuit className="size-3.5 text-primary-200" />
                  <span>{interview.field || interview.type || "Technical"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-light-500">
                  <Star className="size-3.5" />
                  <span>{dayjs(interview.createdAt).format("MMM DD, YYYY")}</span>
                </div>
                <div className="flex items-center gap-1.5 text-light-500">
                  <Clock className="size-3.5" />
                  <span>{Math.round(interview.duration / 60) || 5} mins</span>
                </div>
              </div>

              <div className="mt-2 text-sm text-light-500 leading-relaxed max-w-lg line-clamp-2">
                <span className="font-semibold text-primary-200/80 mr-1">Feedback:</span>
                {interview.overallFeedback || interview.feedback || "Awaiting final review."}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
