"use client";

import React, { useState, useEffect } from "react";
import VoiceInterviewer from "@/components/VoiceInterviewer";
import { Button } from "@/components/ui/button";
import { BRANCHES, ROLES_BY_BRANCH, COMPANIES_BY_BRANCH } from "@/constants";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { getQuestionsForRole } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [role, setRole] = useState(ROLES_BY_BRANCH[BRANCHES[0]][0]);
  const [company, setCompany] = useState(COMPANIES_BY_BRANCH[BRANCHES[0]][0]);
  const [resume, setResume] = useState<File | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  // Update role when branch changes
  useEffect(() => {
    setRole(ROLES_BY_BRANCH[branch][0]);
    setCompany(COMPANIES_BY_BRANCH[branch][0]);
  }, [branch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    const generated = await getQuestionsForRole(branch, role, company);
    
    // Customize first question with resume if uploaded
    if (resume && generated.length > 0) {
      generated[0] = `Welcome! I've reviewed your resume, ${resume.name}. It's impressive. Why do you think you're a good fit for this ${role} role at ${company}?`;
    }

    setQuestions(generated);
    setStarted(true);
    setLoading(false);
  };

  if (started) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center bg-dark-200/50 p-6 rounded-3xl border border-border/40 shadow-xl">
          <div>
            <h3 className="text-2xl font-bold text-primary-100">
              {company} Interview: {role}
            </h3>
            <p className="text-light-400 text-sm">
              Path: {branch} • {resume ? `Resume: ${resume.name}` : "No resume uploaded"}
            </p>
          </div>
          <Button
            onClick={() => setStarted(false)}
            variant="outline"
            className="rounded-full px-8 border-primary-200/30 hover:bg-primary-200/10"
          >
            Reset Config
          </Button>
        </div>

        <VoiceInterviewer
          userName={currentUser?.name || "Candidate"} 
          userId={currentUser?.id || "anonymous"} 
          interviewId={`interview_${Date.now()}`}
          role={role}
          techstack={[branch, company]}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto py-12 px-8 bg-dark-200/50 rounded-[40px] border border-border/50 shadow-2xl backdrop-blur-md">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-black tracking-tight text-white bg-clip-text">
          Prepare for <span className="text-primary-200 italic font-serif">Impact</span>
        </h1>
        <p className="text-light-400 text-lg max-w-md mx-auto">
          Tailor your AI mock interview with your specific background and resume.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Branch Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-primary-200/70 ml-1">
            Academic Branch
          </label>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full p-4 bg-dark-300 rounded-2xl border border-border/50 focus:border-primary-200 outline-none cursor-pointer transition-all hover:border-primary-100/30 text-white font-medium"
          >
            {BRANCHES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-primary-200/70 ml-1">
            Target Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-4 bg-dark-300 rounded-2xl border border-border/50 focus:border-primary-200 outline-none cursor-pointer transition-all hover:border-primary-100/30 text-white font-medium"
          >
            {ROLES_BY_BRANCH[branch].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Company Selection */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-widest text-primary-200/70 ml-1">
            Target Company
          </label>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full p-4 bg-dark-300 rounded-2xl border border-border/50 focus:border-primary-200 outline-none cursor-pointer transition-all hover:border-primary-100/30 text-white font-medium"
          >
            {COMPANIES_BY_BRANCH[branch].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Resume Upload Area */}
        <div className="md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-widest text-primary-200/70 ml-1 mb-2 block">
            Resume / CV (Optional)
          </label>
          <label className={`
            flex flex-col items-center justify-center w-full min-h-[140px] 
            border-2 border-dashed rounded-3xl cursor-pointer transition-all gap-4
            ${resume 
              ? "border-primary-200/50 bg-primary-200/5" 
              : "border-border/50 bg-dark-300 hover:bg-dark-300/80 hover:border-primary-100/20"
            }
          `}>
            {resume ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="text-primary-200 size-10 animate-in zoom-in duration-300" />
                <span className="text-white font-semibold">{resume.name}</span>
                <span className="text-light-400 text-xs italic">Resume successfully attached</span>
              </div>
            ) : (
              <>
                <Upload className="text-light-500 size-8" />
                <div className="text-center">
                  <span className="text-white font-semibold">Click to upload your resume</span>
                  <p className="text-light-500 text-xs">PDF, DOCX accepted (Max 5MB)</p>
                </div>
              </>
            )}
            <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
          </label>
        </div>
      </div>

      <Button
        onClick={handleStart}
        disabled={loading}
        className="w-full py-10 text-2xl font-black rounded-3xl bg-primary-200 hover:bg-primary-100 text-dark-100 shadow-[0_20px_50px_rgba(141,104,250,0.3)] hover:-translate-y-1 transition-all flex gap-3"
      >
        {loading ? (
          <Loader2 className="size-8 animate-spin" />
        ) : (
          <FileText className="size-8" />
        )}
        {loading ? "PREPARING..." : "START INTERVIEW"}
      </Button>
    </div>
  );
};

export default Page;
