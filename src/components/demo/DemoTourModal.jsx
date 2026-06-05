import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, X, Play, Shield, AlertTriangle, BarChart3, FileText, Settings, CheckCircle } from "lucide-react";

const demoSteps = [
  {
    id: "welcome",
    title: "Welcome to Izulu Sentinel",
    icon: Shield,
    description: "Experience the future of security intelligence. This guided tour will show you how to monitor threats, manage incidents, and protect your assets.",
    image: null,
    cta: "Start Tour"
  },
  {
    id: "dashboard",
    title: "Real-Time Security Dashboard",
    icon: BarChart3,
    description: "Your command center displays active threats, critical alerts, and asset status in real-time. Click any widget to drill down into detailed analytics.",
    highlights: ["Active threats monitoring", "Live threat map", "Asset tracking", "Alert notifications"]
  },
  {
    id: "incidents",
    title: "Incident Management",
    icon: AlertTriangle,
    description: "Track and manage security incidents from detection to resolution. Collaborate with your team, attach evidence, and maintain a complete audit trail.",
    highlights: ["Create and track incidents", "Severity classification", "Team collaboration", "Timeline view"]
  },
  {
    id: "intel",
    title: "Threat Intelligence Hub",
    icon: Shield,
    description: "Access real-time threat intelligence from multiple sources. AI-powered analysis helps you stay ahead of emerging threats.",
    highlights: ["Multi-source feeds", "AI threat analysis", "Geolocation tracking", "Export capabilities"]
  },
  {
    id: "reports",
    title: "Advanced Reporting",
    icon: FileText,
    description: "Generate comprehensive security reports with one click. Schedule automated reports and share insights with stakeholders.",
    highlights: ["Custom reports", "Scheduled delivery", "PDF/CSV export", "Executive summaries"]
  },
  {
    id: "settings",
    title: "Platform Configuration",
    icon: Settings,
    description: "Customize your security platform with role-based access, notification preferences, and integration settings.",
    highlights: ["Role management", "Notification settings", "API integrations", "Team management"]
  },
  {
    id: "complete",
    title: "Ready to Get Started?",
    icon: CheckCircle,
    description: "You've completed the tour! Explore the platform or contact our team for a personalized demo.",
    cta: "Start Free Trial"
  }
];

export default function DemoTourModal({ open, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const step = demoSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === demoSteps.length - 1;
  
  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-[#0f0f0f] border-[#1a1a1a]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge className="bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/50">
              Step {currentStep + 1} of {demoSteps.length}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-12 h-12 bg-[#DC2626]/20 rounded-lg flex items-center justify-center">
              <step.icon className="w-6 h-6 text-[#DC2626]" />
            </div>
            <DialogTitle className="text-2xl text-white">{step.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <p className="text-gray-300 leading-relaxed">{step.description}</p>
          
          {step.highlights && (
            <div className="bg-[#0a0a0a] rounded-lg p-4 space-y-2">
              {step.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-gray-400">{highlight}</span>
                </div>
              ))}
            </div>
          )}

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {demoSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? "w-8 bg-[#DC2626]"
                    : idx < currentStep
                    ? "w-2 bg-[#DC2626]/50"
                    : "w-2 bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            className="bg-[#DC2626] hover:bg-[#B91C1C]"
          >
            {isLastStep ? step.cta : "Next"}
            {!isLastStep && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}