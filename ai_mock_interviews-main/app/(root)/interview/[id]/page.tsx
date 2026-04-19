export const dynamic = "force-dynamic";

import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import VoiceInterviewer from "@/components/VoiceInterviewer";
import { getInterviewLogo } from "@/lib/utils";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <div className="inner-container !my-0">
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getInterviewLogo(interview.type)}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize text-white">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <p className="glass px-4 py-2 rounded-lg h-fit text-sm font-bold text-primary-200 uppercase tracking-widest">
          {interview.type}
        </p>
      </div>

      <VoiceInterviewer
        userName={user?.name!}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
        role={interview.role}
        techstack={interview.techstack}
      />
    </div>
  );
};

export default InterviewDetails;
