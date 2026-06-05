import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, AlertTriangle, Users, Activity, BarChart3 } from "lucide-react";
import { LayoutDashboard, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

export default function VoiceCommands() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [recognition, setRecognition] = useState(null);

  const speak = useCallback((text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  const processCommand = useCallback((command) => {
    const lowerCommand = command.toLowerCase();
    
    setCommandHistory(prev => [...prev, {
      command,
      timestamp: new Date(),
      status: "processing"
    }]);

    if (lowerCommand.includes("show") && lowerCommand.includes("dashboard")) {
      navigate(createPageUrl("Dashboard"));
      speak("Opening dashboard");
    } else if (lowerCommand.includes("show") && lowerCommand.includes("threats")) {
      navigate(createPageUrl("Threats"));
      speak("Opening threats page");
    } else if (lowerCommand.includes("show") && lowerCommand.includes("map")) {
      navigate(createPageUrl("ThreatMap"));
      speak("Opening threat map");
    } else if (lowerCommand.includes("show") && lowerCommand.includes("analytics")) {
      navigate(createPageUrl("Analytics"));
      speak("Opening analytics");
    } else if (lowerCommand.includes("show") && lowerCommand.includes("team")) {
      navigate(createPageUrl("Team"));
      speak("Opening team management");
    } else if (lowerCommand.includes("emergency") || lowerCommand.includes("alert")) {
      speak("Initiating emergency protocol. Alerting all team members.");
    } else if (lowerCommand.includes("status") && lowerCommand.includes("all")) {
      speak("All systems operational. No critical threats detected.");
    } else if (lowerCommand.includes("help") || lowerCommand.includes("commands")) {
      speak("Available commands: Show dashboard, Show threats, Show map, Show analytics, Show team, Emergency alert, Status all");
    } else {
      speak("Command not recognized. Say help for available commands.");
    }
  }, [navigate, speak]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);

        if (event.results[current].isFinal) {
          processCommand(transcript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [processCommand]);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      speak("Voice commands activated. How can I help you?");
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      speak("Voice commands deactivated");
    }
  };

  const availableCommands = [
    { command: "Show Dashboard", description: "Navigate to main dashboard", icon: LayoutDashboard },
    { command: "Show Threats", description: "View all threats", icon: AlertTriangle },
    { command: "Show Map", description: "Open threat map", icon: MapPin },
    { command: "Show Analytics", description: "View analytics page", icon: BarChart3 },
    { command: "Show Team", description: "Open team management", icon: Users },
    { command: "Emergency Alert", description: "Trigger emergency protocol", icon: AlertTriangle },
    { command: "Status All", description: "Get system status", icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Mic className="w-8 h-8 text-[#DC2626]" />
            Voice Commands
          </h1>
          <p className="text-gray-400">Hands-free control with voice recognition</p>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              <Button
                onClick={isListening ? stopListening : startListening}
                size="lg"
                className={`h-24 w-24 rounded-full ${isListening ? 'bg-[#DC2626] hover:bg-[#B91C1C] animate-pulse' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {isListening ? (
                  <Mic className="w-12 h-12" />
                ) : (
                  <MicOff className="w-12 h-12" />
                )}
              </Button>

              <div className="text-center">
                <Badge className={isListening ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}>
                  {isListening ? "Listening..." : "Click to activate"}
                </Badge>
                {transcript && (
                  <p className="text-white mt-4 text-lg">{transcript}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Available Commands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {availableCommands.map((cmd, idx) => (
                <div key={idx} className="p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#1a1a1a]/80 transition-colors">
                  <p className="text-white font-medium mb-1">"{cmd.command}"</p>
                  <p className="text-sm text-gray-400">{cmd.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {commandHistory.length > 0 && (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Command History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {commandHistory.slice(-10).reverse().map((item, idx) => (
                <div key={idx} className="p-2 bg-[#1a1a1a] rounded flex items-center justify-between">
                  <span className="text-white text-sm">{item.command}</span>
                  <span className="text-xs text-gray-400">
                    {format(item.timestamp, "HH:mm:ss")}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}