import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Palette, Upload, Eye, Save, RotateCcw } from "lucide-react";
import { UploadFile } from "@/integrations/Core";

export default function WhiteLabel() {
  const [config, setConfig] = useState({
    company_name: "Izulu Sentinel",
    logo_url: "",
    favicon_url: "",
    primary_color: "#DC2626",
    secondary_color: "#0a0a0a",
    accent_color: "#06B6D4",
    custom_domain: "",
    support_email: "support@izulusentinel.com",
    copyright_text: "© 2024 Izulu Sentinel. All rights reserved."
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    const saved = localStorage.getItem('whitelabel_config');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
  };

  const handleLogoUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { file_url } = await UploadFile({ file });
      setConfig({ ...config, [type]: file_url });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const saveConfig = async () => {
    setIsSaving(true);
    localStorage.setItem('whitelabel_config', JSON.stringify(config));
    
    // Apply changes to the app
    document.documentElement.style.setProperty('--primary', config.primary_color);
    if (config.company_name) {
      document.title = config.company_name;
    }
    
    setTimeout(() => {
      setIsSaving(false);
      alert("White-label configuration saved!");
    }, 1000);
  };

  const resetToDefaults = () => {
    setConfig({
      company_name: "Izulu Sentinel",
      logo_url: "",
      favicon_url: "",
      primary_color: "#DC2626",
      secondary_color: "#0a0a0a",
      accent_color: "#06B6D4",
      custom_domain: "",
      support_email: "support@izulusentinel.com",
      copyright_text: "© 2024 Izulu Sentinel. All rights reserved."
    });
    localStorage.removeItem('whitelabel_config');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Palette className="w-8 h-8 text-[#DC2626]" />
              White-Label Configuration
            </h1>
            <p className="text-gray-400">Customize the platform with your brand</p>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400">Enterprise Feature</Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Branding */}
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Company Name</Label>
                  <Input
                    value={config.company_name}
                    onChange={(e) => setConfig({ ...config, company_name: e.target.value })}
                    placeholder="Your Company Name"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2 block">Company Logo</Label>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(e, 'logo_url')}
                        className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      />
                      {config.logo_url && (
                        <img src={config.logo_url} alt="Logo" className="h-12 object-contain" />
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Favicon</Label>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(e, 'favicon_url')}
                        className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      />
                      {config.favicon_url && (
                        <img src={config.favicon_url} alt="Favicon" className="h-8 w-8 object-contain" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Colors */}
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Color Scheme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white mb-2 block">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={config.primary_color}
                        onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        value={config.primary_color}
                        onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                        className="flex-1 bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={config.secondary_color}
                        onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        value={config.secondary_color}
                        onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                        className="flex-1 bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={config.accent_color}
                        onChange={(e) => setConfig({ ...config, accent_color: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        value={config.accent_color}
                        onChange={(e) => setConfig({ ...config, accent_color: e.target.value })}
                        className="flex-1 bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Domain & Contact */}
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Domain & Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Custom Domain</Label>
                  <Input
                    value={config.custom_domain}
                    onChange={(e) => setConfig({ ...config, custom_domain: e.target.value })}
                    placeholder="security.yourcompany.com"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Contact support to configure DNS settings
                  </p>
                </div>

                <div>
                  <Label className="text-white">Support Email</Label>
                  <Input
                    type="email"
                    value={config.support_email}
                    onChange={(e) => setConfig({ ...config, support_email: e.target.value })}
                    placeholder="support@yourcompany.com"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <Label className="text-white">Copyright Text</Label>
                  <Input
                    value={config.copyright_text}
                    onChange={(e) => setConfig({ ...config, copyright_text: e.target.value })}
                    placeholder="© 2024 Your Company. All rights reserved."
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={resetToDefaults}
                className="border-[#2a2a2a] text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button
                onClick={() => setPreviewMode(!previewMode)}
                variant="outline"
                className="border-[#2a2a2a] text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? "Exit Preview" : "Preview"}
              </Button>
              <Button
                onClick={saveConfig}
                disabled={isSaving}
                className="bg-[#DC2626] hover:bg-[#B91C1C]"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Configuration"}
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div>
            <Card className="border-[#1a1a1a] bg-[#0f0f0f] sticky top-4">
              <CardHeader>
                <CardTitle className="text-white">Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-[#1a1a1a] rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    {config.logo_url ? (
                      <img src={config.logo_url} alt="Logo" className="h-8 object-contain" />
                    ) : (
                      <div className="w-8 h-8 rounded" style={{ backgroundColor: config.primary_color }} />
                    )}
                    <h3 className="font-bold text-white">{config.company_name}</h3>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full"
                      style={{ backgroundColor: config.primary_color }}
                    >
                      Primary Button
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full"
                      style={{ borderColor: config.accent_color, color: config.accent_color }}
                    >
                      Accent Button
                    </Button>
                  </div>

                  <div className="mt-4 p-3 rounded" style={{ backgroundColor: config.secondary_color }}>
                    <p className="text-sm text-gray-300">
                      Background color preview
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  {config.copyright_text}
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded">
                  <p className="text-sm text-amber-400">
                    💡 Changes will be applied after saving
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}