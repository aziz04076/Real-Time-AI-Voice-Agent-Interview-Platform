export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import RecentInterviewsClient from "@/components/RecentInterviewsClient";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <div className="inner-container">
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-white">Your Career Starts Here</h2>
          <p className="text-lg text-primary-100/80">
            Practice real-world interview scenarios with our advanced AI Voice Agent and get detailed, actionable feedback.
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start New Interview</Link>
          </Button>
        </div>

        <img
          src="/robot.png"
          alt="AI Assistant"
          width="350"
          height="350"
          className="max-sm:hidden animate-pulse-slow"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Interviews</h2>
            <Link href="/interviews" className="text-sm text-primary-200 hover:underline">View All</Link>
          </div>

          <RecentInterviewsClient />
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold">Recommended for You</h2>

          <div className="flex flex-col gap-4">
            {hasUpcomingInterviews ? (
              allInterview?.slice(0, 3).map((interview: Interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.jobRole || interview.role}
                  type={interview.field || interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))
            ) : (
              <div className="glass-dark p-10 rounded-3xl text-center border border-white/5">
                <p className="text-light-100">Stay tuned for new recommended interview paths!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
