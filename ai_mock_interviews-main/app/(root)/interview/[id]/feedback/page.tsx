export const dynamic = "force-dynamic";

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import PDFDownloadButton from "@/components/PDFDownloadButton";
import { CheckCircle2, Star, Calendar, ArrowLeft, RotateCcw } from "lucide-react";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <div className="inner-container !mt-0 flex flex-col gap-12">
      <section className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-white">
            Interview <span className="text-gradient">Report</span>
          </h1>
          <div className="flex gap-4 glass p-2 rounded-2xl border-white/5">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-200/10 rounded-xl text-primary-200">
              <Star className="size-5 fill-primary-200" />
              <span className="font-bold text-lg">{feedback?.totalScore}</span>
              <span className="text-xs opacity-60">/100</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <InfoCard icon={<Calendar className="size-5" />} label="Date" value={dayjs(feedback?.createdAt).format("MMM D, YYYY")} />
           <InfoCard icon={<CheckCircle2 className="size-5" />} label="Role" value={interview.role} />
           <InfoCard icon={<Star className="size-5" />} label="Level" value={interview.level} />
        </div>
      </section>

      <section className="glass-dark p-10 rounded-[2.5rem] border border-white/5 flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-primary-200 pl-4">Hiring Manager Assessment</h2>
          <p className="text-light-100/80 leading-relaxed text-lg italic">"{feedback?.finalAssessment}"</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="flex flex-col gap-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="size-2 rounded-full bg-green-400" /> Key Strengths
              </h3>
              <ul className="flex flex-col gap-3">
                {feedback?.strengths?.map((s, i) => (
                  <li key={i} className="flex gap-3 text-light-100/70">
                    <CheckCircle2 className="size-5 text-green-400 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
           </div>
           <div className="flex flex-col gap-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary-200" /> Areas to Improve
              </h3>
              <ul className="flex flex-col gap-3">
                {feedback?.areasForImprovement?.map((a, i) => (
                  <li key={i} className="flex gap-3 text-light-100/70">
                    <span className="text-primary-200 font-bold">•</span> {a}
                  </li>
                ))}
              </ul>
           </div>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-white pl-4">Category Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedback?.categoryScores?.map((cat, i) => (
            <div key={i} className="glass p-8 rounded-3xl border-white/5 flex flex-col gap-4 hover:bg-white/5 transition-colors group">
               <div className="flex justify-between items-center">
                  <p className="font-bold text-primary-100">{cat.name}</p>
                  <p className="text-sm font-bold text-primary-200">{cat.score}%</p>
               </div>
               <div className="w-full h-1.5 bg-dark-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-200 transition-all group-hover:bg-white" style={{ width: `${cat.score}%` }} />
               </div>
               <p className="text-sm text-light-400 leading-relaxed">{cat.comment}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-4 pt-10 border-t border-white/5">
        <PDFDownloadButton feedback={feedback} interview={interview} />

        <Button asChild variant="outline" className="flex-1 h-12 rounded-full border-white/10 hover:bg-white/5">
          <Link href="/dashboard" className="flex items-center justify-center gap-2">
            <ArrowLeft className="size-4" /> Back to dashboard
          </Link>
        </Button>

        <Button asChild className="btn-primary flex-1 h-12">
          <Link href={`/interview/${id}`} className="flex items-center justify-center gap-2">
            <RotateCcw className="size-4" /> Retake Interview
          </Link>
        </Button>
      </div>
    </div>
  );
};

function InfoCard({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="glass p-6 rounded-2xl flex items-center gap-4 border-white/5">
      <div className="size-10 rounded-xl bg-primary-200/10 flex items-center justify-center text-primary-200">
        {icon}
      </div>
      <div>
        <p className="text-xs text-light-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

export default Feedback;
