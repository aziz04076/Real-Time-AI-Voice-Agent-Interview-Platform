"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { downloadReportAction } from "@/lib/actions/pdf.action";

interface PDFDownloadButtonProps {
  feedback: any;
  interview: any;
}

const PDFDownloadButton = ({ feedback, interview }: PDFDownloadButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const base64 = await downloadReportAction(feedback, interview);
      
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${base64}`;
      link.download = `PrepWise_Assessment_${interview.role}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Assessment PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF Download Error:", error);
      toast.error("Failed to generate PDF report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isGenerating}
      className="btn-secondary flex-1 h-14 rounded-full border border-white/10 hover:bg-white/5 transition-all active:scale-95"
    >
      {isGenerating ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Download className="mr-2 h-5 w-5" />
      )}
      <span className="font-bold">Download Analysis PDF</span>
    </Button>
  );
};

export default PDFDownloadButton;
