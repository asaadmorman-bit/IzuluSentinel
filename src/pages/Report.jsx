import React, { useState } from "react";
import { Incident } from "@/entities/all";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Upload, Send } from "lucide-react";
import { UploadFile } from "@/integrations/Core";

export default function Report() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    severity: "medium",
    status: "active",
    latitude: "",
    longitude: "",
    location_name: "",
    affected_area_km2: "",
    reported_date: new Date().toISOString(),
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await Incident.create({
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        affected_area_km2: formData.affected_area_km2 ? parseFloat(formData.affected_area_km2) : null,
      });

      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error creating incident:", error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Report Incident
          </h1>
          <p className="text-slate-400">Submit new environmental incident to the system</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Incident Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Incident Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Brief incident title"
                    className="bg-slate-800/50 border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-white">Incident Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                    required
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wildfire">Wildfire</SelectItem>
                      <SelectItem value="flood">Flood</SelectItem>
                      <SelectItem value="drought">Drought</SelectItem>
                      <SelectItem value="pollution">Pollution</SelectItem>
                      <SelectItem value="deforestation">Deforestation</SelectItem>
                      <SelectItem value="wildlife">Wildlife</SelectItem>
                      <SelectItem value="storm">Storm</SelectItem>
                      <SelectItem value="earthquake">Earthquake</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Detailed description of the incident"
                  className="bg-slate-800/50 border-slate-700 text-white h-32"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="severity" className="text-white">Severity *</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) => handleInputChange("severity", value)}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affected_area" className="text-white">Affected Area (km²)</Label>
                  <Input
                    id="affected_area"
                    type="number"
                    step="0.01"
                    value={formData.affected_area_km2}
                    onChange={(e) => handleInputChange("affected_area_km2", e.target.value)}
                    placeholder="e.g. 25.5"
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location Coordinates *
                </Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Latitude (e.g. -26.2041)"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange("latitude", e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white"
                    required
                  />
                  <Input
                    placeholder="Longitude (e.g. 28.0473)"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange("longitude", e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white"
                    required
                  />
                </div>
                <Input
                  placeholder="Location name (e.g. Johannesburg, South Africa)"
                  value={formData.location_name}
                  onChange={(e) => handleInputChange("location_name", e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-white flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Image (Optional)
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="mt-2 rounded-lg max-h-48 object-cover"
                  />
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl("Dashboard"))}
                  className="border-slate-700 text-white hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}