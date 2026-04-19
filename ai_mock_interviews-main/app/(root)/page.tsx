"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  BarChart3, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Users,
  CheckCircle2
} from "lucide-react";
import { getCurrentUser } from "@/lib/actions/auth.action";

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getCurrentUser();
      setUser(u);
    };
    fetchUser();
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden hero-gradient">
        <div className="inner-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={stagger}
            className="flex flex-col gap-8 z-10"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 w-fit">
              <Zap className="size-4 text-primary-200 fill-primary-200" />
              <span className="text-sm font-medium text-primary-100">AI-Powered Next-Gen Interviews</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
              Master Your Next <span className="text-gradient">Big Opportunity</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl text-light-100/80 max-w-lg leading-relaxed">
              Experience the world's most advanced AI Voice interviewer. Practice real scenarios, get instant technical & communication feedback, and land your dream job with PrepWise.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-wrap gap-4 mt-4">
              <Button asChild size="lg" className="btn-primary h-14 px-8 text-lg">
                <Link href={user ? "/dashboard" : "/sign-up"}>Start Practicing Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="glass h-14 px-8 text-lg rounded-full border-white/10 hover:bg-white/5">
                <Link href="#features">See How it Works</Link>
              </Button>
            </motion.div>

            <motion.div variants={fadeIn} className="flex items-center gap-6 mt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="size-10 rounded-full border-2 border-dark-100 bg-dark-200 overflow-hidden">
                    <Image src={`/profile.svg`} alt="User" width={40} height={40} style={{ height: "auto" }} />
                  </div>
                ))}
              </div>
              <p className="text-sm text-light-400">Trusted by <span className="text-white font-semibold">10,000+</span> students across India</p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative z-10 w-full max-w-[500px] aspect-square rounded-full blue-gradient-dark p-1 flex items-center justify-center border border-white/10 shadow-[0_0_100px_rgba(202,197,254,0.15)]">
              <div className="absolute inset-0 rounded-full animate-pulse-slow bg-primary-200/5 blur-3xl" />
              <img 
                src="/robot.png" 
                alt="AI Interviewer" 
                width="450" 
                height="450" 
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-dark-100 relative">
        <div className="inner-container flex flex-col gap-20">
          <div className="text-center flex flex-col items-center gap-4 max-w-2xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold">Why Choose <span className="text-primary-200">PrepWise?</span></h2>
            <p className="text-light-100/60 text-lg">We combine cutting-edge AI with expert-level interviewing logic to give you a real competitive edge.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Mic className="size-6 text-primary-200" />}
              title="Real-time Voice AI"
              description="Native, low-latency voice interaction that feels like a real human interviewer. No awkward delays."
            />
            <FeatureCard 
              icon={<BarChart3 className="size-6 text-primary-200" />}
              title="Deep Skill Analysis"
              description="Detailed metrics on technical accuracy, communication clarity, filler words, and overall confidence."
            />
            <FeatureCard 
              icon={<FileText className="size-6 text-primary-200" />}
              title="Pro PDF Reports"
              description="Download shareable PDF assessments with strengths, improvement areas, and best-practice samples."
            />
            <FeatureCard 
              icon={<ShieldCheck className="size-6 text-primary-200" />}
              title="Role-Specific Paths"
              description="Tailored interview paths for Frontend, Fullstack, AI/ML, and niche roles like Pharmacy or Management."
            />
            <FeatureCard 
              icon={<Zap className="size-6 text-primary-200" />}
              title="Smart Follow-ups"
              description="Our AI understands your depth and asks relevant follow-up questions to test your real knowledge."
            />
            <FeatureCard 
              icon={<Users className="size-6 text-primary-200" />}
              title="Admin Insights"
              description="Enterprise-grade dashboard for mentors and colleges to track student progress at scale."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-gradient-to-b from-dark-100 to-dark-200">
        <div className="inner-container flex flex-col gap-16">
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Simple, Transparent <span className="text-gradient">Pricing</span></h2>
            <p className="text-light-100/60">Start for free, upgrade when you're ready to go pro.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
            {/* Free Tier */}
            <div className="glass-dark p-10 rounded-[2.5rem] border border-white/5 flex flex-col gap-8 flex-1">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold">Free Plan</h3>
                <p className="text-light-400">Perfect for getting started</p>
              </div>
              <div className="text-5xl font-bold text-white">$0 <span className="text-lg text-light-400 font-normal">/mo</span></div>
              <ul className="flex flex-col gap-4">
                <PricingItem text="3 Interviews per month" />
                <PricingItem text="Basic Performance Score" />
                <PricingItem text="Standard Feedback Report" />
                <PricingItem text="Access to Core Roles" />
              </ul>
              <Button asChild variant="outline" className="w-full h-12 rounded-full border-white/10 hover:bg-white/5">
                <Link href={user ? "/dashboard" : "/sign-up"}>Get Started</Link>
              </Button>
            </div>

            {/* Pro Tier */}
            <div className="blue-gradient-dark p-10 rounded-[2.5rem] border-2 border-primary-200/30 flex flex-col gap-8 flex-1 relative overflow-hidden">
              <div className="absolute top-6 right-8 px-4 py-1 rounded-full bg-primary-200 text-dark-100 text-xs font-bold">MOST POPULAR</div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold">Pro Plan</h3>
                <p className="text-primary-100">For serious job seekers</p>
              </div>
              <div className="text-5xl font-bold text-white">$9 <span className="text-lg text-primary-100/60 font-normal">/mo</span></div>
              <ul className="flex flex-col gap-4">
                <PricingItem text="Unlimited Interviews" />
                <PricingItem text="Advanced Communication Analysis" />
                <PricingItem text="Detailed PDF Growth Reports" />
                <PricingItem text="Full Access to All 50+ Roles" />
                <PricingItem text="AI-powered Resume Analysis" isPro />
              </ul>
              <Button asChild className="btn-primary w-full h-12 px-8">
                <Link href={user ? "/pricing" : "/sign-up"}>Upgrade to Pro</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="inner-container">
          <div className="blue-gradient-dark p-20 rounded-[3rem] border border-white/5 text-center flex flex-col items-center gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-200/10 via-transparent to-transparent opacity-50" />
            <h2 className="text-4xl lg:text-6xl font-bold max-w-3xl leading-tight">Ready to Land Your <span className="text-gradient">Dream Job?</span></h2>
            <p className="text-xl text-light-100/70 max-w-xl">Join thousands of students who have improved their interview skills with PrepWise.</p>
            <Button asChild size="lg" className="btn-primary h-14 px-10 text-lg relative z-10 transition-transform active:scale-95">
              <Link href={user ? "/dashboard" : "/sign-up"}>Get Pro Lifetime Access Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-dark p-8 rounded-[2rem] border border-white/5 hover:border-primary-200/30 transition-colors group"
    >
      <div className="bg-dark-200 size-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-200/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-light-400 text-base leading-relaxed">{description}</p>
    </motion.div>
  );
}

function PricingItem({ text, isPro = false }: { text: string, isPro?: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <CheckCircle2 className={`size-5 ${isPro ? "text-primary-200" : "text-light-600"}`} />
      <span className="text-light-100 text-sm">{text}</span>
    </li>
  );
}
