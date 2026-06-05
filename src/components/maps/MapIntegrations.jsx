import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, ExternalLink, Map, Smartphone } from "lucide-react";

export default function MapIntegrations({ latitude, longitude, label, showAllOptions = true }) {
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const openDirectionsInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const openInWaze = () => {
    const url = `https://www.waze.com/ul?ll=${latitude},${longitude}&navigate=yes&zoom=17`;
    window.open(url, '_blank');
  };

  const openInAppleMaps = () => {
    const url = `http://maps.apple.com/?q=${encodeURIComponent(label || 'Location')}&ll=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const openInBingMaps = () => {
    const url = `https://www.bing.com/maps?cp=${latitude}~${longitude}&lvl=15`;
    window.open(url, '_blank');
  };

  const openInOpenStreetMap = () => {
    const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`;
    window.open(url, '_blank');
  };

  const openInHereMaps = () => {
    const url = `https://wego.here.com/?map=${latitude},${longitude},15,normal`;
    window.open(url, '_blank');
  };

  const openInMapQuest = () => {
    const url = `https://www.mapquest.com/?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const copyCoordinates = () => {
    navigator.clipboard.writeText(`${latitude}, ${longitude}`);
    // You could add a toast notification here
    alert('Coordinates copied to clipboard!');
  };

  if (!showAllOptions) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={openInGoogleMaps}
          className="text-xs"
        >
          <Map className="w-3 h-3 mr-1" />
          Google Maps
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={openInWaze}
          className="text-xs"
        >
          <Navigation className="w-3 h-3 mr-1" />
          Waze
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={openDirectionsInGoogleMaps}
          className="text-xs"
        >
          <Navigation className="w-3 h-3 mr-1" />
          Directions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-white mb-2">Open in Navigation Apps:</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={openInGoogleMaps}
            className="justify-start"
          >
            <Map className="w-4 h-4 mr-2" />
            Google Maps
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={openInWaze}
            className="justify-start"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Waze
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={openInAppleMaps}
            className="justify-start"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Apple Maps
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={openInBingMaps}
            className="justify-start"
          >
            <Map className="w-4 h-4 mr-2" />
            Bing Maps
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={openInHereMaps}
            className="justify-start"
          >
            <MapPin className="w-4 h-4 mr-2" />
            HERE Maps
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={openInOpenStreetMap}
            className="justify-start"
          >
            <Map className="w-4 h-4 mr-2" />
            OpenStreetMap
          </Button>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-white mb-2">Actions:</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={openDirectionsInGoogleMaps}
            className="justify-start"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={copyCoordinates}
            className="justify-start"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Copy Coordinates
          </Button>
        </div>
      </div>

      <div className="text-xs text-gray-400 font-mono">
        {latitude.toFixed(6)}, {longitude.toFixed(6)}
      </div>
    </div>
  );
}