export const dynamic = "force-dynamic";

import { Metadata } from "next";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Advanced Analytics - PrepWise AI Admin",
  description: "View detailed time-series charts and performance metrics.",
};

export default function AnalyticsPage() {
  return (
    <div className="inner-container flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-4">
        <Button asChild variant="ghost" className="w-fit pl-0 hover:bg-transparent text-light-500 hover:text-white transition-colors group">
          <Link href="/admin">
            <ArrowLeft className="size-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Control Panel
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Advanced <span className="text-gradient">Analytics</span></h1>
          <p className="text-light-400 mt-2 text-lg">Deep dive into platform usage, growth trends, and user behavior.</p>
        </div>
      </div>

      <AnalyticsCharts />
    </div>
  );
}
