import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Wind, Droplets, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function WeatherWidget({ latitude, longitude, locationName }) {
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWeather = useCallback(async () => {
    setIsLoading(true);
    try {
      // Using Open-Meteo API (free, no API key required)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation_probability&timezone=auto`
      );
      const data = await response.json();
      
      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        weatherCode: data.current.weather_code,
        precipitation: data.hourly.precipitation_probability[0]
      });

      // Check for severe weather
      if (data.current.wind_speed_10m > 50) {
        setAlerts([{ type: "wind", message: "High wind warning" }]);
      }
      
    } catch (error) {
      console.error("Weather fetch error:", error);
    }
    setIsLoading(false);
  }, [latitude, longitude]);

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeather();
    }
  }, [latitude, longitude, fetchWeather]);

  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun className="w-6 h-6 text-yellow-400" />;
    if (code >= 61 && code <= 67) return <CloudRain className="w-6 h-6 text-blue-400" />;
    return <Cloud className="w-6 h-6 text-gray-400" />;
  };

  if (isLoading || !weather) {
    return (
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardContent className="p-4">
          <div className="animate-pulse flex items-center gap-3">
            <div className="h-12 w-12 bg-[#1a1a1a] rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[#1a1a1a] rounded w-3/4"></div>
              <div className="h-3 bg-[#1a1a1a] rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.weatherCode)}
            <div>
              <div className="text-2xl font-bold text-white">{weather.temperature}°C</div>
              <div className="text-xs text-gray-400">{locationName}</div>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Wind className="w-3 h-3" />
              {weather.windSpeed} km/h
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Droplets className="w-3 h-3" />
              {weather.humidity}%
            </div>
          </div>
        </div>
        
        {alerts.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
            {alerts.map((alert, idx) => (
              <Badge key={idx} className="bg-amber-500/20 text-amber-400">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {alert.message}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}