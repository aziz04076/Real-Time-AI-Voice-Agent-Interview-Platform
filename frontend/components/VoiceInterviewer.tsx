"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface VoiceInterviewerProps {
  userName: string;
  interviewId: string;
  userId: string;
  role?: string;
  techstack?: string[];
}

export default function VoiceInterviewer({
  userName,
  role = "Software Engineer",
  techstack = ["General"],
}: VoiceInterviewerProps) {
  const router = useRouter();
  
  // -- State --
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "active">("idle");
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState<string[]>([]);
  const [sessionAnswers, setSessionAnswers] = useState<string[]>([]);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);

  // -- Refs for Browser APIs --
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // -- Initialize Speech APIs --
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };

        recognitionRef.current.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const final = event.results[i][0].transcript;
              setTranscript((prev) => (prev ? prev + " " + final : final).trim());
            }
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("[SPEECH_RECOGNITION_ERROR]", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // -- TTS Helper --
  const speakText = useCallback((text: string, onDone?: () => void) => {
    if (!synthRef.current || !text.trim()) return;
    
    setIsAISpeaking(true);
    synthRef.current.cancel();

    const cleanText = text.replace(/[*#_]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Select best English voice
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google")) || voices.find(v => v.lang.startsWith("en"));
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => {
      setIsAISpeaking(false);
      onDone?.();
    };
    
    synthRef.current.speak(utterance);
  }, []);

  // -- AI Question Generation (Retry Logic) --
  const startTimeRef = useRef<number | null>(null);

  // -- Perform End Session and Save --
  const performEndSession = useCallback(async (questionsList: string[], answersList: string[]) => {
    recognitionRef.current?.stop();
    synthRef.current?.cancel();
    setCallStatus("idle");
    setIsSaving(true);
    
    const loadingToast = toast.loading("AI is analyzing your entire interview session...");

    try {
      // 1. Get Session Evaluation
      const evalRes = await fetch('/api/ai/evaluate-full', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          jobRole: role, 
          questions: questionsList, 
          answers: answersList 
        })
      });
      
      if (!evalRes.ok) throw new Error("Evaluation request failed");
      const evalData = await evalRes.json();
      
      const { 
        overallScore: score, 
        communicationScore,
        technicalScore,
        problemSolvingScore,
        confidenceScore,
        hiringRecommendation,
        recommendedTopics,
        strengths, 
        weaknesses, 
        improvementSuggestions: areasToImprove, 
        overallFeedback,
        questionEvaluations
      } = evalData;

      // Calculate duration
      let elapsedSeconds = 300;
      if (startTimeRef.current) {
        elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      }

      // 3. Save Session
      const saveRes = await fetch('/api/interviews/save', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobRole: role,
          field: techstack[0],
          questions: questionsList,
          answers: questionEvaluations.map((ev: any) => ({
            question: ev.question,
            answer: ev.answer,
            score: ev.score,
            technicalCorrectness: ev.technicalCorrectness,
            strengths: ev.strengths,
            weaknesses: ev.weaknesses,
            missingPoints: ev.missingPoints,
            improvementSuggestions: ev.improvementSuggestions,
            betterAnswer: ev.betterAnswer
          })),
          score,
          communicationScore,
          technicalScore,
          problemSolvingScore,
          confidenceScore,
          hiringRecommendation,
          recommendedTopics,
          overallFeedback,
          strengths,
          weaknesses,
          areasToImprove,
          duration: elapsedSeconds,
          resumeSummary: techstack.join(", ")
        })
      });

      if (!saveRes.ok) throw new Error("Save failed");
      const saveData = await saveRes.json();

      toast.dismiss(loadingToast);
      toast.success("Interview securely saved! Redirecting to report...");
      router.push(`/interview/${saveData.interviewId}/feedback`);
    } catch (e: any) {
      toast.dismiss(loadingToast);
      console.error("[END_SESSION_ERROR]", e);
      toast.error("Failed to process final evaluation. Please try again.");
      setIsSaving(false);
    }
  }, [role, techstack, router]);

  // -- AI Question Generation (Retry Logic) --
  const askNextQuestion = useCallback(async (history: string[], answersHistory: string[] = [], retryCount = 0) => {
    setIsAISpeaking(true);
    setTranscript("");

    // Automatically complete after 10 questions if needed
    if (history.length >= 10) {
       speakText("Thank you. That completes our interview. Please wait while I redirect you to the report...", () => {
          performEndSession(history, answersHistory);
       });
       return;
    }

    try {
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      
      const res = await fetch("/api/ai/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobRole: role,
          resumeSummary: techstack.join(", "),
          field: techstack[0],
          company: techstack[1] || "",
          previousQuestions: history,
          previousAnswers: answersHistory
        })
      });

      if (!res.ok) throw new Error("API Failure");

      const fullText = await res.text();
      
      setMessages(prev => {
        const newM = [...prev];
        newM[newM.length - 1].content = fullText;
        return newM;
      });

      setPreviousQuestions(p => [...p, fullText]);
      setSessionQuestions(p => [...p, fullText]);
      speakText(fullText);

    } catch (e) {
      console.error("[AI_REQUEST_FAILED]", e);
      if (retryCount < 2) {
        askNextQuestion(history, answersHistory, retryCount + 1);
      } else {
        toast.error("Generation failed. Using fallback question.");
        const fallbackQ = "Can you tell me about your experience with complex problem solving?";
        setMessages(prev => {
          const newM = [...prev];
          newM[newM.length - 1].content = fallbackQ;
          return newM;
        });
        setPreviousQuestions(p => [...p, fallbackQ]);
        setSessionQuestions(p => [...p, fallbackQ]);
        speakText(fallbackQ);
      }
    }
  }, [role, techstack, speakText, performEndSession]);

  // -- User Answer Submission --
  const submitAnswer = useCallback(async (userText: string) => {
    if (!userText.trim()) return;
    
    setTranscript("");
    setMessages(prev => [...prev, { role: "user", content: userText }]);
    
    const updatedAnswers = [...sessionAnswers, userText];
    setSessionAnswers(updatedAnswers);
    
    // Stop listening
    recognitionRef.current?.stop();

    const maxQuestions = 10;
    if (updatedAnswers.length >= maxQuestions) {
      setIsAISpeaking(true);
      speakText("Thank you. That completes our interview. Please wait while I analyze your responses and generate your report.", () => {
        setIsAISpeaking(false);
        performEndSession(sessionQuestions, updatedAnswers);
      });
    } else {
      // Move to next question after a short natural pause
      setIsAISpeaking(true);
      setTimeout(() => {
        askNextQuestion(previousQuestions, updatedAnswers);
      }, 1000);
    }
  }, [previousQuestions, askNextQuestion, sessionQuestions, sessionAnswers, speakText, performEndSession]);

  // -- Actions --
  const startInterview = async () => {
    setCallStatus("connecting");
    if (!recognitionRef.current) {
      toast.error("Speech Recognition not supported in this browser.");
      setCallStatus("idle");
      return;
    }

    setCallStatus("active");
    startTimeRef.current = Date.now();
    recognitionRef.current.start();
    askNextQuestion([], []);
  };

  const endSession = async () => {
    await performEndSession(sessionQuestions, sessionAnswers);
  };

  return (
    <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto items-center py-10 px-4">
      {/* Visual State Indicators */}
      <div className="flex gap-4 items-center">
        <div className={cn(
          "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all",
          isListening ? "bg-red-500/10 border-red-500/50 text-red-500" : "bg-white/5 border-white/10 text-white/30"
        )}>
          {isListening ? "● Recording" : "Mic Standby"}
        </div>
        <div className={cn(
          "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all",
          isAISpeaking ? "bg-primary-500/10 border-primary-500/50 text-primary-200" : "bg-white/5 border-white/10 text-white/30"
        )}>
          {isAISpeaking ? "● AI Speaking" : "AI Silent"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Interviewer Card */}
        <div className={cn(
          "glass-dark p-8 rounded-[2.5rem] border flex flex-col items-center justify-center relative overflow-hidden transition-all duration-700 h-64",
          isAISpeaking ? "border-primary-200/40 shadow-[0_0_50px_rgba(139,92,246,0.1)]" : "border-white/5"
        )}>
          <div className={cn(
            "size-24 rounded-full flex items-center justify-center relative transition-transform duration-500 bg-black/40",
            isAISpeaking && "scale-110"
          )}>
             <Image src="/ai-avatar.png" alt="AI" width={60} height={60} className={cn("opacity-80", isAISpeaking && "animate-pulse")} />
             {isAISpeaking && <div className="absolute inset-0 rounded-full border-2 border-primary-200 animate-ping opacity-20" />}
          </div>
          <h3 className="mt-6 text-lg font-bold text-white/90">AI Interviewer</h3>
          <p className="text-xs text-primary-100/40 mt-1 uppercase tracking-widest">{isAISpeaking ? "Responding..." : "Ready"}</p>
        </div>

        {/* User Card */}
        <div className={cn(
          "glass-dark p-8 rounded-[2.5rem] border flex flex-col items-center justify-center relative overflow-hidden transition-all duration-700 h-64",
          isListening ? "border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.05)]" : "border-white/5"
        )}>
           <div className={cn(
            "size-24 rounded-full flex items-center justify-center relative transition-transform duration-500 bg-black/40",
            isListening && "scale-110"
          )}>
            <Image src="/user-avatar.png" alt="User" width={80} height={80} className="rounded-full" />
            {isListening && <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-20" />}
          </div>
          <h3 className="mt-6 text-lg font-bold text-white/90">{userName}</h3>
          <p className="text-xs text-red-100/40 mt-1 uppercase tracking-widest">{isListening ? "Listening..." : "Waiting"}</p>
        </div>
      </div>

      {/* Transcript Log */}
      <div className="w-full glass rounded-[2.5rem] p-8 min-h-[120px] border border-white/5 relative bg-white/[0.01]">
         <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between opacity-40">
               <span className="text-[10px] font-black uppercase tracking-widest">Live Transcript</span>
               {isListening && <Mic className="size-3 text-red-500 animate-pulse" />}
            </div>
            <p className="text-xl font-medium leading-relaxed min-h-[4rem]">
              {transcript || (callStatus === "active" 
                ? isAISpeaking ? "..." : "I'm listening. Describe your answer clearly..."
                : "Click 'Join Session' to start the interview."
              )}
            </p>
         </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {callStatus === "idle" ? (
          <Button onClick={startInterview} className="btn-primary rounded-full px-12 h-14 text-md font-bold group">
            <Send className="mr-2 size-4 group-hover:translate-x-1 transition-transform" />
            Join Secure Interview
          </Button>
        ) : (
          <>
            <Button 
               onClick={() => {
                 if (isListening) recognitionRef.current?.stop();
                 else recognitionRef.current?.start();
               }}
               variant="outline"
               disabled={isSaving}
               className={cn("rounded-full size-14 p-0 border-white/10", isListening && "border-red-500/50 bg-red-500/5")}
            >
              {isListening ? <MicOff className="size-5 text-red-500" /> : <Mic className="size-5 text-white/60" />}
            </Button>
            
            <Button 
              onClick={() => submitAnswer(transcript)} 
              disabled={!transcript || isAISpeaking || isSaving} 
              className="btn-primary rounded-full px-10 h-14 font-bold"
            >
               Submit Answer
            </Button>

            <Button 
              onClick={endSession} 
              disabled={isSaving}
              variant="destructive" 
              className="rounded-full px-10 h-14 font-bold bg-white/5 hover:bg-white/10 text-white border-white/10"
            >
               {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
               {isSaving ? "Analyzing..." : "Complete Session"}
            </Button>
          </>
        )}
      </div>

      {/* History Log */}
      {messages.length > 0 && (
        <div className="w-full mt-10 space-y-4">
           {messages.filter(m => m.content).map((m, i) => (
             <div key={i} className={cn(
               "p-6 rounded-3xl border text-sm transition-all max-w-[90%]",
               m.role === "assistant" ? "glass-dark border-white/5 self-start" : "bg-white/5 border-white/10 self-end ml-auto"
             )}>
                <p className="font-black text-[10px] uppercase tracking-tighter opacity-30 mb-2">{m.role === "assistant" ? "AI INTERVIEWER" : "YOUR ANSWER"}</p>
                <div className="whitespace-pre-wrap leading-relaxed opacity-80">{m.content}</div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
