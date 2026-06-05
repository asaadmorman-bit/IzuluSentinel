import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Play, Pause, Upload, AlertTriangle, Volume2 } from "lucide-react";

export default function VoiceIntelligence() {
  const [isRecording, setIsRecording] = useState(false);

  const audioAnalyses = [
    {
      id: "AUD-001",
      filename: "intercepted_call_031524.wav",
      duration: "3:42",
      language: "English",
      speakers: 2,
      sentiment: "negative",
      threatLevel: "high",
      keywords: ["weapon", "meeting", "tomorrow"],
      timestamp: "2 hours ago"
    },
    {
      id: "AUD-002",
      filename: "surveillance_audio_031424.mp3",
      duration: "12:15",
      language: "Arabic",
      speakers: 3,
      sentiment: "neutral",
      threatLevel: "medium",
      keywords: ["transport", "location", "confirm"],
      timestamp: "1 day ago"
    },
    {
      id: "AUD-003",
      filename: "phone_recording_031324.wav",
      duration: "5:23",
      language: "French",
      speakers: 2,
      sentiment: "positive",
      threatLevel: "low",
      keywords: ["business", "contract", "agreement"],
      timestamp: "2 days ago"
    }
  ];

  const voiceProfiles = [
    {
      name: "Subject Alpha",
      recordings: 23,
      lastHeard: "Yesterday",
      confidence: 94,
      status: "active"
    },
    {
      name: "Subject Beta",
      recordings: 15,
      lastHeard: "3 days ago",
      confidence: 87,
      status: "monitoring"
    },
    {
      name: "Unknown Speaker 1",
      recordings: 8,
      lastHeard: "1 week ago",
      confidence: 72,
      status: "unidentified"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Mic className="w-8 h-8 text-[#DC2626]" />
            Voice Intelligence
          </h1>
          <p className="text-gray-400">Audio analysis, transcription, and speaker identification</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Analyzed Files</p>
                  <p className="text-3xl font-bold text-white">847</p>
                </div>
                <Volume2 className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Voice Profiles</p>
                  <p className="text-3xl font-bold text-white">{voiceProfiles.length}</p>
                </div>
                <Mic className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Languages Supported</p>
                  <p className="text-3xl font-bold text-white">47</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Accuracy Rate</p>
                  <p className="text-3xl font-bold text-white">96.2%</p>
                </div>
                <Play className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Record Audio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center py-12 bg-[#1a1a1a] rounded-lg border-2 border-dashed border-[#2a2a2a]">
                <div className="text-center">
                  <div className={`w-24 h-24 mx-auto mb-4 rounded-full ${isRecording ? 'bg-red-500' : 'bg-[#DC2626]'} flex items-center justify-center ${isRecording ? 'animate-pulse' : ''}`}>
                    <Mic className="w-12 h-12 text-white" />
                  </div>
                  <Button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-[#DC2626] hover:bg-[#B91C1C]'} text-white`}
                  >
                    {isRecording ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-gray-400 text-sm">OR</p>
              </div>
              <Button variant="outline" className="w-full border-[#2a2a2a] text-white bg-[#1a1a1a] hover:bg-[#2a2a2a]">
                <Upload className="w-4 h-4 mr-2" />
                Upload Audio File
              </Button>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Voice Profiles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {voiceProfiles.map((profile, idx) => (
                <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{profile.name}</h3>
                      <p className="text-xs text-gray-400">Last heard: {profile.lastHeard}</p>
                    </div>
                    <Badge className={
                      profile.status === "active"
                        ? "bg-red-500/20 text-red-400"
                        : profile.status === "monitoring"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-gray-500/20 text-gray-400"
                    }>
                      {profile.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Recordings</p>
                      <p className="text-white font-medium">{profile.recordings}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Confidence</p>
                      <p className="text-white font-medium">{profile.confidence}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Recent Audio Analyses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {audioAnalyses.map((audio) => (
              <div key={audio.id} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{audio.filename}</h3>
                      <Badge variant="outline" className="text-xs">
                        {audio.id}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400">{audio.timestamp}</p>
                  </div>
                  <Badge className={
                    audio.threatLevel === "high"
                      ? "bg-red-500/20 text-red-400"
                      : audio.threatLevel === "medium"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-blue-500/20 text-blue-400"
                  }>
                    {audio.threatLevel} threat
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-400 text-xs">Duration</p>
                    <p className="text-white">{audio.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Language</p>
                    <p className="text-white">{audio.language}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Speakers</p>
                    <p className="text-white">{audio.speakers}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Sentiment</p>
                    <p className="text-white capitalize">{audio.sentiment}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Detected Keywords:</p>
                  <div className="flex flex-wrap gap-2">
                    {audio.keywords.map((keyword, i) => (
                      <Badge key={i} className="bg-[#DC2626]/20 text-[#DC2626] text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}