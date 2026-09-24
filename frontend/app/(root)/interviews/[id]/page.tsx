"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { Clock, Star, BrainCircuit, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function InterviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/interviews/${id}`);
        if (res.ok) {
          const data = await res.json();
          setInterview(data.interview);
        }
      } catch (error) {
        console.error("Failed to fetch interview detail", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="inner-container flex flex-col items-center justify-center min-h-[600px]">
        <Loader2 className="size-10 text-primary-200 animate-spin" />
        <p className="mt-4 text-light-500 font-medium">Generating your detailed report...</p>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="inner-container flex flex-col items-center justify-center min-h-[600px] text-center">
        <AlertCircle className="size-16 text-red-500/20 mb-6" />
        <h1 className="text-3xl font-bold text-white mb-2">Report Not Found</h1>
        <p className="text-light-500 mb-8">We couldn't find the interview record you're looking for.</p>
        <Button asChild className="btn-primary rounded-full px-8">
          <Link href="/interviews">Back to History</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="inner-container py-10 pb-20">
      <div className="flex flex-col gap-10">
        {/* Navigation */}
        <Link href="/interviews" className="flex items-center gap-2 text-primary-200 hover:text-primary-100 transition-colors text-sm font-medium w-fit">
          <ArrowLeft className="size-4" />
          Back to History
        </Link>

        {/* Hero Section */}
        <div className="glass-dark rounded-[3rem] p-8 sm:p-12 border border-white/5 relative overflow-hidden">
           {/* Animated Background Blur */}
           <div className="absolute -top-24 -right-24 size-64 bg-primary-500/10 rounded-full blur-[100px]" />
           <div className="absolute -bottom-24 -left-24 size-64 bg-primary-200/5 rounded-full blur-[100px]" />

           <div className="absolute top-0 right-0 p-10 sm:p-12">
              <div className="flex flex-col items-end">
                <span className="text-6xl sm:text-7xl font-black text-white">{interview.score || 0}<span className="text-xl sm:text-2xl text-primary-200/40">/100</span></span>
              </div>
           </div>

           <div className="flex flex-col gap-6 max-w-2xl relative z-10">
              <div className="flex items-center gap-3">
                 <div className="size-10 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                    <BrainCircuit className="size-5 text-primary-200" />
                 </div>
                 <span className="text-xs font-black text-primary-200 uppercase tracking-[0.3em]">{interview.field || "Technical Interview"}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight capitalize leading-tight">
                {interview.jobRole || "Software Engineer"}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-light-500 uppercase tracking-[0.2em] mt-2">
                 <div className="flex items-center gap-2">
                   <Star className="size-4 text-primary-200" />
                   {dayjs(interview.createdAt).format("MMMM DD, YYYY")}
                 </div>
                 <div className="flex items-center gap-2">
                   <Clock className="size-4 text-primary-200" />
                   {Math.round(interview.duration / 60) || 5} Min Session
                 </div>
              </div>
           </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left: Overall Analysis */}
           <div className="lg:col-span-2 flex flex-col gap-8">
              <section className="glass rounded-[2rem] p-8 sm:p-10 border border-white/5 flex flex-col gap-6">
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <CheckCircle2 className="size-6 text-primary-500" />
                    Overall Assessment
                 </h2>
                 <div className="text-light-300 leading-relaxed text-lg opacity-90 p-8 bg-white/[0.02] rounded-3xl border border-white/5 italic font-medium">
                    {interview.overallFeedback || "Awaiting final review."}
                 </div>
              </section>

              {/* Conversation Log */}
              <section className="flex flex-col gap-8">
                 <h2 className="text-2xl font-bold text-white">Interview Transcript</h2>
                  <div className="space-y-12">
                    {interview.answers?.map((ans: any, i: number) => (
                       <div key={i} className="flex flex-col gap-6 p-1 bg-white/[0.02] rounded-[3rem] border border-white/5">
                          <div className="flex flex-col gap-4">
                             <div className="glass-dark p-8 rounded-[2.5rem] border border-white/5 max-w-[95%] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500/40" />
                                <span className="text-[10px] font-black uppercase text-primary-200/40 mb-3 block tracking-widest">Question {i+1}</span>
                                <p className="text-white/90 font-bold text-xl leading-relaxed">{ans.question}</p>
                             </div>
                             
                             <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 max-w-[95%] self-end ml-auto relative overflow-hidden">
                                <span className="text-[10px] font-black uppercase text-light-500/40 mb-3 block tracking-widest text-right">Your Answer</span>
                                <p className="text-light-100 leading-relaxed text-right text-lg font-medium">{ans.answer || "No response recorded."}</p>
                             </div>
                          </div>

                          {/* NEW: Granular Diagnostic Section */}
                          <div className="mx-6 mb-6 p-8 rounded-[2rem] bg-black/40 border border-white/5 flex flex-col gap-6 relative overflow-hidden">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                   <div className={cn(
                                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                      ans.strengths?.toLowerCase() === 'correct' ? "bg-green-500/10 border-green-500/30 text-green-400" :
                                      ans.strengths?.toLowerCase() === 'partially correct' ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" :
                                      "bg-red-500/10 border-red-500/30 text-red-500"
                                   )}>
                                      {ans.strengths || "Evaluated"}
                                   </div>
                                   <span className="text-xs font-bold text-light-500 uppercase tracking-tighter">Point Analysis</span>
                                </div>
                                <span className="text-2xl font-black text-white/50">{ans.score || 0}<span className="text-xs text-white/20 ml-1">pts</span></span>
                             </div>

                             <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-200 opacity-60">Interviewer Explanation</h4>
                                <p className="text-light-300 text-sm leading-relaxed">{ans.weaknesses || "Technical assessment pending."}</p>
                             </div>

                             {ans.betterAnswer && ans.betterAnswer !== "None" && (
                                <div className="p-6 rounded-2xl bg-primary-500/5 border border-primary-500/10 space-y-3">
                                   <div className="flex items-center gap-2">
                                      <BrainCircuit className="size-3.5 text-primary-200" />
                                      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-200">Recommended Model Answer</h4>
                                   </div>
                                   <p className="text-primary-100/80 text-sm leading-relaxed italic">{ans.betterAnswer}</p>
                                </div>
                             )}
                          </div>
                       </div>
                    ))}
                  </div>
              </section>
           </div>

           {/* Right: Insights & Metadata */}
           <div className="flex flex-col gap-6">
              <div className="glass-dark p-10 rounded-[2.5rem] border border-white/5 flex flex-col gap-8 lg:sticky lg:top-24">
                 <div className="flex flex-col gap-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-white">Strengths</h3>
                    <div className="text-green-400 font-medium text-sm leading-relaxed whitespace-pre-wrap">{interview.strengths || "Not specified."}</div>
                 </div>

                 <div className="h-px bg-white/10" />

                 <div className="flex flex-col gap-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-white">Weaknesses</h3>
                    <div className="text-red-400 font-medium text-sm leading-relaxed whitespace-pre-wrap">{interview.weaknesses || "Not specified."}</div>
                 </div>

                 <div className="h-px bg-white/10" />

                 <div className="flex flex-col gap-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-white">Roadmap to Success</h3>
                    <div className="text-primary-200 font-medium text-sm leading-relaxed whitespace-pre-wrap">{interview.areasToImprove || "Not specified."}</div>
                 </div>

                 <Button asChild className="btn-primary w-full mt-6 rounded-2xl h-14 font-black uppercase tracking-widest text-xs">
                    <Link href="/interview">Try Another Mock</Link>
                 </Button>
              </div>
              
              {/* Additional Metadata */}
              <div className="glass rounded-[2rem] p-8 border border-white/5 flex flex-col gap-4">
                 <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 text-white">Session Metadata</h3>
                 <div className="flex flex-col gap-3 text-sm font-medium">
                    <div className="flex justify-between">
                       <span className="text-light-500">Resume Match</span>
                       <span className="text-white">High</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-light-500">AI Model</span>
                       <span className="text-white">GPT-4o</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-light-500">ID</span>
                       <span className="text-white/20 text-[10px] font-mono">{id}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
