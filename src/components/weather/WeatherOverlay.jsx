import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, AlertTriangle } from "lucide-react";
import { InvokeLLM } from "@/integrations/Core";

export default function WeatherOverlay({ latitude, longitude, location }) {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeather = useCallback(async () => {
    setIsLoading(true);
    try {
      const prompt = `Get current weather conditions for coordinates: ${latitude}, ${longitude} (${location || "Unknown location"}).

Provide:
- Temperature (Celsius)
- Conditions (clear/cloudy/rain/storm/etc)
- Wind speed (km/h)
- Humidity (%)
- Visibility (km)
- Weather warnings if any
- Impact on operations (how this weather affects security operations)`;

      const response = await InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            temperature: { type: "number" },
            conditions: { type: "string" },
            wind_speed: { type: "number" },
            humidity: { type: "number" },
            visibility: { type: "number" },
            warnings: {
              type: "array",
              items: { type: "string" }
            },
            operational_impact: { type: "string" }
          }
        }
      });

      setWeather(response);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
    setIsLoading(false);
  }, [latitude, longitude, location]);

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeather();
    }
  }, [latitude, longitude, fetchWeather]);

  if (isLoading) {
    return (
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-[#1a1a1a] rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-[#1a1a1a] rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  const getWeatherIcon = (conditions) => {
    const lower = conditions?.toLowerCase() || '';
    if (lower.includes('rain') || lower.includes('storm')) return CloudRain;
    if (lower.includes('cloud')) return Cloud;
    if (lower.includes('wind')) return Wind;
    return Sun;
  };

  const WeatherIcon = getWeatherIcon(weather.conditions);

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <CardTitle className="text-white text-sm flex items-center gap-2">
          <WeatherIcon className="w-4 h-4" />
          Weather Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-white">{weather.temperature}°C</p>
            <p className="text-sm text-gray-400 capitalize">{weather.conditions}</p>
          </div>
          <WeatherIcon className="w-12 h-12 text-cyan-400" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Wind</p>
              <p className="text-white font-medium">{weather.wind_speed} km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Humidity</p>
              <p className="text-white font-medium">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Visibility</p>
              <p className="text-white font-medium">{weather.visibility} km</p>
            </div>
          </div>
        </div>

        {weather.warnings && weather.warnings.length > 0 && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-400 mb-1">Weather Warnings</p>
                <ul className="space-y-1">
                  {weather.warnings.map((warning, idx) => (
                    <li key={idx} className="text-xs text-amber-300">• {warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {weather.operational_impact && (
          <div className="p-3 bg-[#1a1a1a] rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Operational Impact</p>
            <p className="text-sm text-gray-300">{weather.operational_impact}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}