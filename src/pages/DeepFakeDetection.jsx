import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, AlertTriangle, CheckCircle, Video, Image as ImageIcon, Mic } from "lucide-react";
import { UploadFile } from "@/integrations/Core";

export default function DeepFakeDetection() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const recentAnalyses = [
    {
      id: 1,
      type: "video",
      fileName: "executive_statement.mp4",
      authenticity: 97,
      verdict: "authentic",
      timestamp: "2 hours ago",
      anomalies: []
    },
    {
      id: 2,
      type: "audio",
      fileName: "ceo_voicemail.mp3",
      authenticity: 23,
      verdict: "deepfake",
      timestamp: "5 hours ago",
      anomalies: ["Unnatural voice modulation", "Background noise inconsistency", "Phoneme timing irregular"]
    },
    {
      id: 3,
      type: "image",
      fileName: "threat_actor_photo.jpg",
      authenticity: 89,
      verdict: "authentic",
      timestamp: "1 day ago",
      anomalies: ["Minor JPEG compression artifacts"]
    }
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAnalyzing(true);
    try {
      const { file_url } = await UploadFile({ file });
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setResult({
        fileName: file.name,
        authenticity: Math.floor(Math.random() * 100),
        verdict: Math.random() > 0.5 ? "authentic" : "deepfake",
        anomalies: [
          "Neural network layer artifacts detected",
          "Inconsistent lighting patterns",
          "Micro-expression timing anomalies"
        ]
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Video className="w-8 h-8 text-[#DC2626]" />
            DeepFake Detection AI
          </h1>
          <p className="text-gray-400">Advanced neural network analysis to detect AI-generated media manipulation</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <Video className="w-8 h-8 text-cyan-500 mb-3" />
              <p className="text-sm text-gray-400 mb-1">Videos Analyzed</p>
              <p className="text-3xl font-bold text-white">1,247</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <AlertTriangle className="w-8 h-8 text-amber-500 mb-3" />
              <p className="text-sm text-gray-400 mb-1">DeepFakes Detected</p>
              <p className="text-3xl font-bold text-white">89</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <CheckCircle className="w-8 h-8 text-emerald-500 mb-3" />
              <p className="text-sm text-gray-400 mb-1">Detection Accuracy</p>
              <p className="text-3xl font-bold text-white">99.2%</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Upload Media for Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-[#2a2a2a] rounded-lg p-12 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">Drop files here or click to upload</p>
              <p className="text-sm text-gray-400 mb-4">Supports: Video, Audio, Images (Max 500MB)</p>
              <input
                type="file"
                accept="video/*,audio/*,image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="media-upload"
              />
              <label htmlFor="media-upload">
                <Button asChild className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
                  <span>Select File</span>
                </Button>
              </label>
            </div>

            {analyzing && (
              <div className="p-6 bg-[#1a1a1a] rounded-lg text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DC2626] mx-auto mb-4"></div>
                <p className="text-white font-medium">Analyzing with Neural Networks...</p>
                <p className="text-sm text-gray-400 mt-2">Checking 47 authenticity markers</p>
              </div>
            )}

            {result && !analyzing && (
              <div className={`p-6 bg-[#1a1a1a] rounded-lg border-2 ${result.verdict === 'authentic' ? 'border-emerald-500/50' : 'border-red-500/50'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">{result.fileName}</h3>
                    <Badge className={result.verdict === 'authentic' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                      {result.verdict.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">{result.authenticity}%</p>
                    <p className="text-xs text-gray-400">Confidence Score</p>
                  </div>
                </div>
                
                {result.anomalies.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-white">Detected Anomalies:</p>
                    {result.anomalies.map((anomaly, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{anomaly}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Recent Analyses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAnalyses.map((analysis) => (
              <div key={analysis.id} className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {analysis.type === 'video' && <Video className="w-5 h-5 text-cyan-400" />}
                    {analysis.type === 'audio' && <Mic className="w-5 h-5 text-purple-400" />}
                    {analysis.type === 'image' && <ImageIcon className="w-5 h-5 text-emerald-400" />}
                    <div>
                      <p className="text-white font-medium">{analysis.fileName}</p>
                      <p className="text-xs text-gray-400">{analysis.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{analysis.authenticity}%</p>
                    <Badge className={analysis.verdict === 'authentic' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                      {analysis.verdict}
                    </Badge>
                  </div>
                </div>
                {analysis.anomalies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {analysis.anomalies.map((anomaly, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {anomaly}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}