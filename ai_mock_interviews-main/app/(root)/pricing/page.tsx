"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Zap, ShieldCheck, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
        const response = await fetch("/api/stripe/checkout", {
            method: "POST",
            body: JSON.stringify({ email: "user@example.com", userId: "test-user-id" }),
        });
        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            toast.error("Stripe integration requires valid API keys in .env.local");
        }
    } catch (err) {
        toast.error("Failed to initiate checkout");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="inner-container flex flex-col gap-20 py-10">
      <div className="text-center flex flex-col items-center gap-6 max-w-3xl mx-auto">
        <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight">
          Invest in Your <span className="text-gradient">Future</span>
        </h1>
        <p className="text-xl text-light-100/60 leading-relaxed">
          Choose the plan that fits your career goals. From casual practice to intensive interview bootcamps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto w-full">
        {/* Free Plan */}
        <div className="glass-dark p-12 rounded-[3rem] border border-white/5 flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold">Free</h2>
            <p className="text-light-400">Get a taste of AI interviewing</p>
          </div>
          <div className="text-6xl font-bold text-white leading-none">$0</div>
          <ul className="flex flex-col gap-5 text-light-100/80">
            <li className="flex gap-3"><CheckCircle2 className="size-6 text-light-600" /> 3 Interviews / month</li>
            <li className="flex gap-3"><CheckCircle2 className="size-6 text-light-600" /> Basic AI feedback</li>
            <li className="flex gap-3"><CheckCircle2 className="size-6 text-light-600" /> Standard dashboard</li>
          </ul>
          <Button asChild variant="outline" className="h-14 rounded-full border-white/10 hover:bg-white/5 text-lg">
            <Link href="/sign-up">Start Free</Link>
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="blue-gradient-dark p-12 rounded-[3rem] border-2 border-primary-200/40 flex flex-col gap-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-primary-200 px-6 py-2 rounded-bl-3xl text-dark-100 font-bold text-sm tracking-widest uppercase">Best Value</div>
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold">Pro</h2>
            <p className="text-primary-100/80">For serious career growth</p>
          </div>
          <div className="text-6xl font-bold text-white leading-none">$9<span className="text-2xl font-normal opacity-50">/mo</span></div>
          <ul className="flex flex-col gap-5 text-white/90">
            <li className="flex gap-3"><CheckCircle2 className="size-6 text-primary-200" /> Unlimited Interviews</li>
            <li className="flex gap-3"><Zap className="size-6 text-primary-200 fill-primary-200" /> Advanced Voice Logic</li>
            <li className="flex gap-3"><ShieldCheck className="size-6 text-primary-200" /> Downloadable PDF Reports</li>
            <li className="flex gap-3"><BarChart3 className="size-6 text-primary-200" /> Filler Word & Pace Analysis</li>
            <li className="flex gap-3"><Users className="size-6 text-primary-200" /> Priority Support</li>
          </ul>
          <Button 
            onClick={handleUpgrade}
            disabled={loading}
            className="btn-primary h-14 text-lg shadow-[0_10px_30px_rgba(202,197,254,0.3)] hover:shadow-none transition-all active:scale-95"
          >
            {loading ? "Processing..." : "Upgrade to Pro"}
          </Button>
        </div>
      </div>

      <div className="glass p-12 rounded-[3rem] border-white/5 text-center flex flex-col items-center gap-8">
         <h3 className="text-3xl font-bold">Frequently Asked Questions</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left w-full max-w-4xl">
            <FAQItem q="Can I cancel anytime?" a="Yes! You can cancel your subscription at anytime from your profile settings." />
            <FAQItem q="Which roles are supported?" a="We support 50+ roles across Engineering, Pharmacy, Management, and Arts." />
            <FAQItem q="Is the feedback accurate?" a="Our AI uses state-of-the-art models (GPT-4) to provide hiring-manager level feedback." />
            <FAQItem q="What is the PDF report?" a="It's a professional 3-page assessment you can share with mentors or add to your portfolio." />
         </div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
    return (
        <div className="flex flex-col gap-2">
            <p className="font-bold text-primary-100">{q}</p>
            <p className="text-sm text-light-100/60 leading-relaxed">{a}</p>
        </div>
    );
}
