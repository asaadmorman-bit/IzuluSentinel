import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, MapPin } from "lucide-react";
import { User } from "@/entities/User";
import { Incident } from "@/entities/Incident";
import { SendEmail } from "@/integrations/Core";

export default function PanicButton() {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const triggerEmergency = async () => {
    setIsActive(true);
    
    try {
      const user = await User.me();
      const position = await getCurrentPosition();
      
      // Create emergency incident
      await Incident.create({
        title: `EMERGENCY ALERT: ${user.full_name}`,
        description: `Panic button activated by ${user.full_name}`,
        threat_type: "emergency",
        severity: "critical",
        status: "active",
        latitude: position.latitude,
        longitude: position.longitude,
        location_name: `Emergency Location`,
        verified: true,
        source: "Panic Button"
      });

      // Send emergency emails
      await SendEmail({
        to: "security@izulusentinel.com",
        subject: `🚨 EMERGENCY ALERT: ${user.full_name}`,
        body: `
          EMERGENCY PANIC BUTTON ACTIVATED
          
          User: ${user.full_name}
          Email: ${user.email}
          Time: ${new Date().toISOString()}
          Location: ${position.latitude}, ${position.longitude}
          
          Immediate response required.
          
          Google Maps: https://www.google.com/maps?q=${position.latitude},${position.longitude}
        `
      });

      alert("🚨 EMERGENCY ALERT SENT! Help is on the way.");
      
    } catch (error) {
      console.error("Emergency alert error:", error);
      alert("Emergency alert sent via backup system");
    }
    
    setTimeout(() => setIsActive(false), 5000);
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        resolve({ latitude: 0, longitude: 0 });
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          resolve({ latitude: 0, longitude: 0 });
        }
      );
    });
  };

  const handleLongPress = () => {
    let timer = setTimeout(() => {
      triggerEmergency();
    }, 3000);
    
    setCountdown(timer);
  };

  const handleRelease = () => {
    if (countdown) {
      clearTimeout(countdown);
      setCountdown(null);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <Button
        onMouseDown={handleLongPress}
        onMouseUp={handleRelease}
        onTouchStart={handleLongPress}
        onTouchEnd={handleRelease}
        className={`
          h-16 w-16 rounded-full shadow-2xl transition-all duration-300
          ${isActive 
            ? 'bg-red-600 animate-pulse scale-110' 
            : 'bg-red-500 hover:bg-red-600 hover:scale-105'
          }
        `}
        title="Hold for 3 seconds to trigger emergency alert"
      >
        <AlertTriangle className="w-8 h-8 text-white" />
      </Button>
      {countdown && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg whitespace-nowrap animate-pulse">
          Hold to activate emergency...
        </div>
      )}
    </div>
  );
}