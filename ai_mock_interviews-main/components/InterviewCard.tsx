import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getInterviewLogo } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  const detailLink = feedback
    ? `/interviews/${interviewId}`
    : `/interview/${interviewId}`;

  return (
    <Link href={detailLink} className="group block h-full">
      <div className="card-border w-[360px] max-sm:w-full min-h-96 hover:border-primary-500/30 transition-all">
        <div className="card-interview h-full flex flex-col justify-between">
          <div className="relative">
            {/* Type Badge */}
            <div
              className={cn(
                "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg z-10",
                badgeColor
              )}
            >
              <p className="badge-text ">{normalizedType}</p>
            </div>

            {/* Cover Image */}
            <Image
              src={getInterviewLogo(type)}
              alt="cover-image"
              width={90}
              height={90}
              className="rounded-full object-cover size-[90px] border border-white/10 group-hover:border-primary-500/30 transition-all"
            />

            {/* Interview Role */}
            <h3 className="mt-5 capitalize text-white group-hover:text-primary-200 transition-colors">{role} Interview</h3>

            {/* Date & Score */}
            <div className="flex flex-row gap-5 mt-3">
              <div className="flex flex-row gap-2">
                <Image
                  src="/calendar.svg"
                  width={22}
                  height={22}
                  alt="calendar"
                />
                <p className="text-light-500">{formattedDate}</p>
              </div>

              <div className="flex flex-row gap-2 items-center">
                <Image src="/star.svg" width={22} height={22} alt="star" />
                <p className="text-white">{feedback?.totalScore || "---"}/100</p>
              </div>
            </div>

            {/* Feedback or Placeholder Text */}
            <p className="line-clamp-2 mt-5 text-light-500">
              {feedback?.finalAssessment ||
                "You haven't taken this interview yet. Take it now to improve your skills."}
            </p>
          </div>

          <div className="flex flex-row justify-between items-center mt-6">
            <DisplayTechIcons techStack={techstack} />

            <div className="btn-primary rounded-full px-6 py-2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              {feedback ? "Details" : "Start"}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default InterviewCard;
