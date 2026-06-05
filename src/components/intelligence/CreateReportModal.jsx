import React, { useState } from "react";
import { IntelligenceReport } from "@/entities/all";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

export default function CreateReportModal({ open, onClose, onReportCreated }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    report_type: "daily_brief",
    content: "",
    classification: "internal",
    region: "",
    threat_level: "moderate",
    key_findings: [],
    recommendations: [],
    report_date: new Date().toISOString().split('T')[0],
    analyst: ""
  });
  const [newFinding, setNewFinding] = useState("");
  const [newRecommendation, setNewRecommendation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await IntelligenceReport.create(formData);
      onReportCreated();
      setFormData({
        title: "",
        report_type: "daily_brief",
        content: "",
        classification: "internal",
        region: "",
        threat_level: "moderate",
        key_findings: [],
        recommendations: [],
        report_date: new Date().toISOString().split('T')[0],
        analyst: ""
      });
    } catch (error) {
      console.error("Error creating report:", error);
    }

    setIsSubmitting(false);
  };

  const addFinding = () => {
    if (newFinding.trim()) {
      setFormData(prev => ({
        ...prev,
        key_findings: [...prev.key_findings, newFinding.trim()]
      }));
      setNewFinding("");
    }
  };

  const addRecommendation = () => {
    if (newRecommendation.trim()) {
      setFormData(prev => ({
        ...prev,
        recommendations: [...prev.recommendations, newRecommendation.trim()]
      }));
      setNewRecommendation("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-slate-900 border-orange-500/20 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Intelligence Report</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Report Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-slate-800/50 border-slate-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Report Type *</Label>
              <Select
                value={formData.report_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, report_type: value }))}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily_brief">Daily Brief</SelectItem>
                  <SelectItem value="threat_assessment">Threat Assessment</SelectItem>
                  <SelectItem value="incident_report">Incident Report</SelectItem>
                  <SelectItem value="travel_advisory">Travel Advisory</SelectItem>
                  <SelectItem value="regional_analysis">Regional Analysis</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Executive Summary *</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="bg-slate-800/50 border-slate-700 text-white h-32"
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Threat Level *</Label>
              <Select
                value={formData.threat_level}
                onValueChange={(value) => setFormData(prev => ({ ...prev, threat_level: value }))}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="substantial">Substantial</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Classification *</Label>
              <Select
                value={formData.classification}
                onValueChange={(value) => setFormData(prev => ({ ...prev, classification: value }))}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="confidential">Confidential</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Report Date *</Label>
              <Input
                type="date"
                value={formData.report_date}
                onChange={(e) => setFormData(prev => ({ ...prev, report_date: e.target.value }))}
                className="bg-slate-800/50 border-slate-700 text-white"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Region</Label>
              <Input
                value={formData.region}
                onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                placeholder="e.g., Southern Africa"
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label>Analyst Name</Label>
              <Input
                value={formData.analyst}
                onChange={(e) => setFormData(prev => ({ ...prev, analyst: e.target.value }))}
                placeholder="Your name"
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Key Findings</Label>
            <div className="flex gap-2">
              <Input
                value={newFinding}
                onChange={(e) => setNewFinding(e.target.value)}
                placeholder="Add a key finding..."
                className="bg-slate-800/50 border-slate-700 text-white"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFinding())}
              />
              <Button type="button" onClick={addFinding} variant="outline" className="border-orange-500/50">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.key_findings.length > 0 && (
              <div className="space-y-2 mt-2">
                {formData.key_findings.map((finding, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                    <span className="flex-1 text-sm">{finding}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        key_findings: prev.key_findings.filter((_, i) => i !== idx)
                      }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Recommendations</Label>
            <div className="flex gap-2">
              <Input
                value={newRecommendation}
                onChange={(e) => setNewRecommendation(e.target.value)}
                placeholder="Add a recommendation..."
                className="bg-slate-800/50 border-slate-700 text-white"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRecommendation())}
              />
              <Button type="button" onClick={addRecommendation} variant="outline" className="border-orange-500/50">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.recommendations.length > 0 && (
              <div className="space-y-2 mt-2">
                {formData.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
                    <span className="flex-1 text-sm">{rec}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        recommendations: prev.recommendations.filter((_, i) => i !== idx)
                      }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-700">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              {isSubmitting ? "Creating..." : "Create Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}