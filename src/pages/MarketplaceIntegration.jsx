import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Store, Smartphone, Globe, Download, ExternalLink, Package, Rocket, CheckCircle, AlertCircle } from "lucide-react";

export default function MarketplaceIntegration() {
  const [publishStatus, setPublishStatus] = useState({
    appStore: "ready",
    playStore: "ready",
    webApp: "live",
    enterprise: "ready"
  });

  const marketplaces = [
    {
      id: "app_store",
      name: "Apple App Store",
      icon: "🍎",
      status: publishStatus.appStore,
      requirements: [
        "Apple Developer Account ($99/year)",
        "TestFlight Beta Testing",
        "App Review Guidelines Compliance",
        "Privacy Policy & Terms",
        "Screenshots & App Preview Videos"
      ],
      link: "https://developer.apple.com/app-store/",
      publishLink: "https://appstoreconnect.apple.com"
    },
    {
      id: "play_store",
      name: "Google Play Store",
      icon: "📱",
      status: publishStatus.playStore,
      requirements: [
        "Google Play Developer Account ($25 one-time)",
        "App Signing Certificate",
        "Content Rating Questionnaire",
        "Privacy Policy URL",
        "Feature Graphic & Screenshots"
      ],
      link: "https://play.google.com/console/",
      publishLink: "https://play.google.com/console/developers"
    },
    {
      id: "web_app",
      name: "Progressive Web App",
      icon: "🌐",
      status: publishStatus.webApp,
      requirements: [
        "Service Worker Implementation",
        "HTTPS Certificate",
        "Manifest.json File",
        "Responsive Design",
        "Offline Functionality"
      ],
      link: "https://web.dev/progressive-web-apps/",
      installable: true
    },
    {
      id: "microsoft_store",
      name: "Microsoft Store",
      icon: "🪟",
      status: "planned",
      requirements: [
        "Microsoft Developer Account",
        "Windows App Certification Kit",
        "Age Ratings",
        "Store Listing Assets"
      ],
      link: "https://developer.microsoft.com/microsoft-store/"
    },
    {
      id: "enterprise",
      name: "Enterprise Distribution",
      icon: "🏢",
      status: publishStatus.enterprise,
      requirements: [
        "Apple Enterprise Program ($299/year)",
        "Google Enterprise Mobility Management",
        "MDM Integration",
        "Custom Deployment Options"
      ],
      link: "#"
    },
    {
      id: "amazon",
      name: "Amazon Appstore",
      icon: "📦",
      status: "planned",
      requirements: [
        "Amazon Developer Account (Free)",
        "APK File (Android)",
        "Store Assets",
        "Testing on Fire Devices"
      ],
      link: "https://developer.amazon.com/appstore"
    }
  ];

  const appDetails = {
    name: "Izulu Sentinel",
    tagline: "Enterprise Protection Intelligence Platform",
    category: "Business / Security",
    version: "1.0.0",
    minOS: {
      ios: "14.0+",
      android: "8.0+",
      windows: "10+"
    },
    size: {
      ios: "~85 MB",
      android: "~62 MB",
      web: "~15 MB"
    },
    languages: ["English", "Spanish", "French", "Arabic", "Chinese", "Russian", "Portuguese", "German", "Japanese", "Korean", "Italian", "Hindi"],
    features: [
      "Real-time Threat Intelligence",
      "AI-Powered Risk Assessment",
      "Route Planning & Optimization",
      "Team Collaboration Tools",
      "Executive Protection Management",
      "Law Enforcement Integration",
      "Offline Mode Support",
      "Multi-Language Support",
      "End-to-End Encryption",
      "Role-Based Access Control"
    ]
  };

  const screenshots = {
    mobile: [
      { title: "Dashboard", url: "https://via.placeholder.com/400x800/DC2626/FFFFFF?text=Dashboard" },
      { title: "Threat Map", url: "https://via.placeholder.com/400x800/DC2626/FFFFFF?text=Threat+Map" },
      { title: "Alerts", url: "https://via.placeholder.com/400x800/DC2626/FFFFFF?text=Alerts" },
      { title: "Routes", url: "https://via.placeholder.com/400x800/DC2626/FFFFFF?text=Routes" },
      { title: "Analytics", url: "https://via.placeholder.com/400x800/DC2626/FFFFFF?text=Analytics" }
    ],
    desktop: [
      { title: "Dashboard", url: "https://via.placeholder.com/1920x1080/DC2626/FFFFFF?text=Dashboard" },
      { title: "Intelligence", url: "https://via.placeholder.com/1920x1080/DC2626/FFFFFF?text=Intelligence" },
      { title: "Case Management", url: "https://via.placeholder.com/1920x1080/DC2626/FFFFFF?text=Cases" }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "live": return "bg-emerald-500/20 text-emerald-400";
      case "ready": return "bg-cyan-500/20 text-cyan-400";
      case "planned": return "bg-amber-500/20 text-amber-400";
      case "in_review": return "bg-purple-500/20 text-purple-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "live": return <CheckCircle className="w-4 h-4" />;
      case "ready": return <Rocket className="w-4 h-4" />;
      case "planned": return <AlertCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Store className="w-8 h-8 text-[#DC2626]" />
            Marketplace Integration & Distribution
          </h1>
          <p className="text-gray-400">Publish and distribute Izulu Sentinel across multiple platforms</p>
        </div>

        {/* App Overview */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">App Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{appDetails.name}</h3>
                <p className="text-gray-400 mb-4">{appDetails.tagline}</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-400">Category:</span>
                    <span className="text-white ml-2">{appDetails.category}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Version:</span>
                    <span className="text-white ml-2">{appDetails.version}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Languages:</span>
                    <span className="text-white ml-2">{appDetails.languages.length} supported</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Platform Requirements</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded">
                    <span className="text-gray-400">iOS</span>
                    <span className="text-white">{appDetails.minOS.ios} • {appDetails.size.ios}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded">
                    <span className="text-gray-400">Android</span>
                    <span className="text-white">{appDetails.minOS.android} • {appDetails.size.android}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded">
                    <span className="text-gray-400">Web App</span>
                    <span className="text-white">Modern Browsers • {appDetails.size.web}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marketplaces Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketplaces.map((marketplace) => (
            <Card key={marketplace.id} className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{marketplace.icon}</span>
                    <div>
                      <CardTitle className="text-white text-lg">{marketplace.name}</CardTitle>
                      <Badge className={`${getStatusColor(marketplace.status)} mt-1`}>
                        {getStatusIcon(marketplace.status)}
                        <span className="ml-1 capitalize">{marketplace.status}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Requirements:</h4>
                  <ul className="space-y-1">
                    {marketplace.requirements.map((req, idx) => (
                      <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  {marketplace.publishLink && (
                    <Button 
                      size="sm"
                      className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C]"
                      onClick={() => window.open(marketplace.publishLink, '_blank')}
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Publish
                    </Button>
                  )}
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-[#2a2a2a]"
                    onClick={() => window.open(marketplace.link, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </div>
                {marketplace.installable && (
                  <Button 
                    size="sm"
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Install PWA
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Publishing Guide */}
        <Tabs defaultValue="app_store" className="w-full">
          <TabsList className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
            <TabsTrigger value="app_store">🍎 App Store</TabsTrigger>
            <TabsTrigger value="play_store">📱 Play Store</TabsTrigger>
            <TabsTrigger value="pwa">🌐 PWA</TabsTrigger>
            <TabsTrigger value="enterprise">🏢 Enterprise</TabsTrigger>
          </TabsList>

          <TabsContent value="app_store" className="space-y-6 mt-6">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Apple App Store Publishing Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-white mb-3">Step 1: Prepare Your App</h3>
                  <div className="space-y-2 pl-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-white">Create App Bundle</p>
                        <p className="text-sm text-gray-400">Build iOS app with Xcode, sign with distribution certificate</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-white">Test with TestFlight</p>
                        <p className="text-sm text-gray-400">Invite beta testers, collect feedback, fix issues</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-white">Prepare Assets</p>
                        <p className="text-sm text-gray-400">Screenshots (all device sizes), app preview videos, app icon</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-3">Step 2: App Store Connect</h3>
                  <div className="p-4 bg-[#1a1a1a] rounded-lg space-y-3">
                    <div>
                      <label className="text-sm text-gray-400">App Name</label>
                      <Input value="Izulu Sentinel" readOnly className="mt-1 bg-[#0a0a0a] border-[#2a2a2a] text-white" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Subtitle</label>
                      <Input value="Protection Intelligence Platform" readOnly className="mt-1 bg-[#0a0a0a] border-[#2a2a2a] text-white" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Description</label>
                      <Textarea 
                        value="Izulu Sentinel is the leading enterprise protection intelligence platform. Real-time threat monitoring, AI-powered risk assessment, and comprehensive security operations management."
                        readOnly 
                        className="mt-1 bg-[#0a0a0a] border-[#2a2a2a] text-white h-24"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Keywords</label>
                      <Input value="security, protection, intelligence, threat, monitoring, enterprise" readOnly className="mt-1 bg-[#0a0a0a] border-[#2a2a2a] text-white" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-3">Step 3: Submit for Review</h3>
                  <Button className="bg-[#DC2626] hover:bg-[#B91C1C]" onClick={() => window.open('https://appstoreconnect.apple.com', '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Go to App Store Connect
                  </Button>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <h4 className="font-semibold text-amber-400 mb-2">Important Notes:</h4>
                  <ul className="space-y-1 text-sm text-amber-300">
                    <li>• Review process typically takes 1-3 days</li>
                    <li>• Ensure compliance with App Store Review Guidelines</li>
                    <li>• Include clear privacy policy and terms of service</li>
                    <li>• Respond promptly to any review team questions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="play_store" className="space-y-6 mt-6">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Google Play Store Publishing Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-white mb-3">Step 1: Build APK/AAB</h3>
                  <div className="space-y-2 pl-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-white">Generate Signed Bundle</p>
                        <p className="text-sm text-gray-400">Create Android App Bundle (.aab) with release signing</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-white">Test on Multiple Devices</p>
                        <p className="text-sm text-gray-400">Test on various Android versions and screen sizes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-white">Optimize APK Size</p>
                        <p className="text-sm text-gray-400">Use ProGuard, remove unused resources, enable app bundles</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-3">Step 2: Play Console Setup</h3>
                  <div className="p-4 bg-[#1a1a1a] rounded-lg space-y-3">
                    <div>
                      <label className="text-sm text-gray-400">App Name</label>
                      <Input value="Izulu Sentinel" readOnly className="mt-1 bg-[#0a0a0a] border-[#2a2a2a] text-white" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Short Description</label>
                      <Textarea 
                        value="Enterprise protection intelligence platform with real-time threat monitoring and AI-powered risk assessment."
                        readOnly 
                        className="mt-1 bg-[#0a0a0a] border-[#2a2a2a] text-white h-20"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Full Description</label>
                      <Textarea 
                        value={`Izulu Sentinel - Enterprise Protection Intelligence

Comprehensive security operations platform for organizations requiring advanced physical security capabilities.

KEY FEATURES:
• Real-time threat intelligence and monitoring
• AI-powered predictive analytics
• Route planning with threat avoidance
• Executive protection management
• Law enforcement integration
• Team collaboration tools
• Offline mode support
• Multi-language support (12+ languages)

IDEAL FOR:
• Corporate Security Teams
• Executive Protection Details
• Law Enforcement Agencies
• Private Security Companies
• NGOs and Aid Organizations
• Government Agencies

SECURITY:
• End-to-end encryption
• Role-based access control
• Secure data storage
• Compliance ready`}
                        readOnly 
                        className="mt-1 bg-[#0a0a0a] border-[#2a2a2a] text-white h-48"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-3">Step 3: Content Rating & Review</h3>
                  <Button className="bg-[#DC2626] hover:bg-[#B91C1C]" onClick={() => window.open('https://play.google.com/console/developers', '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Go to Play Console
                  </Button>
                </div>

                <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <h4 className="font-semibold text-cyan-400 mb-2">Pro Tips:</h4>
                  <ul className="space-y-1 text-sm text-cyan-300">
                    <li>• Use Google Play's internal testing track first</li>
                    <li>• Respond to pre-launch reports</li>
                    <li>• Enable staged rollouts for safer deployment</li>
                    <li>• Monitor crash reports and ANR rates</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pwa" className="space-y-6 mt-6">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Progressive Web App Deployment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <h4 className="font-semibold text-emerald-400">PWA is Live!</h4>
                  </div>
                  <p className="text-sm text-emerald-300">Your app is already accessible as a Progressive Web App</p>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-3">PWA Features Enabled:</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "✓ Service Worker for offline support",
                      "✓ Web App Manifest configured",
                      "✓ HTTPS enabled",
                      "✓ Responsive design",
                      "✓ Add to Home Screen capability",
                      "✓ Push notifications ready",
                      "✓ App-like experience",
                      "✓ Fast loading with caching"
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-[#1a1a1a] rounded">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-white text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-3">Installation Instructions:</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-[#1a1a1a] rounded-lg">
                      <h4 className="font-semibold text-white mb-2">On Mobile (Chrome/Safari):</h4>
                      <ol className="space-y-1 text-sm text-gray-400 list-decimal list-inside">
                        <li>Open izulusentinel.com in browser</li>
                        <li>Tap the share/menu icon</li>
                        <li>Select "Add to Home Screen"</li>
                        <li>Tap "Add" to confirm</li>
                      </ol>
                    </div>
                    <div className="p-4 bg-[#1a1a1a] rounded-lg">
                      <h4 className="font-semibold text-white mb-2">On Desktop (Chrome/Edge):</h4>
                      <ol className="space-y-1 text-sm text-gray-400 list-decimal list-inside">
                        <li>Visit izulusentinel.com</li>
                        <li>Click the install icon in address bar</li>
                        <li>Click "Install" in the prompt</li>
                        <li>App opens in standalone window</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                  <Download className="w-4 h-4 mr-2" />
                  Install Izulu Sentinel PWA Now
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enterprise" className="space-y-6 mt-6">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Enterprise Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-white mb-3">Distribution Options:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#1a1a1a] rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Apple Business Manager</h4>
                      <ul className="space-y-1 text-sm text-gray-400">
                        <li>• Volume Purchase Program</li>
                        <li>• Custom B2B App Distribution</li>
                        <li>• MDM Integration</li>
                        <li>• Managed Apple IDs</li>
                      </ul>
                      <Button size="sm" className="mt-3 bg-[#DC2626] hover:bg-[#B91C1C]" onClick={() => window.open('https://business.apple.com', '_blank')}>
                        Learn More
                      </Button>
                    </div>
                    <div className="p-4 bg-[#1a1a1a] rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Google Enterprise Mobility</h4>
                      <ul className="space-y-1 text-sm text-gray-400">
                        <li>• Managed Google Play</li>
                        <li>• Private App Publishing</li>
                        <li>• EMM Console Integration</li>
                        <li>• Device Policies</li>
                      </ul>
                      <Button size="sm" className="mt-3 bg-[#DC2626] hover:bg-[#B91C1C]" onClick={() => window.open('https://www.android.com/enterprise/', '_blank')}>
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-3">Self-Hosted Options:</h3>
                  <div className="p-4 bg-[#1a1a1a] rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">On-Premise Deployment</p>
                        <p className="text-sm text-gray-400">Host Izulu Sentinel on your own infrastructure with full control</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">Private Cloud</p>
                        <p className="text-sm text-gray-400">Deploy on AWS, Azure, or GCP with dedicated instances</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">Air-Gapped Networks</p>
                        <p className="text-sm text-gray-400">Offline deployment for maximum security environments</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <h4 className="font-semibold text-purple-400 mb-2">Contact Enterprise Sales:</h4>
                  <p className="text-sm text-purple-300 mb-3">Get custom deployment options, volume licensing, and dedicated support</p>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Request Enterprise Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Screenshots Section */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">App Store Screenshots</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-white mb-3">Mobile Screenshots</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {screenshots.mobile.map((screenshot, idx) => (
                  <div key={idx} className="space-y-2">
                    <img 
                      src={screenshot.url} 
                      alt={screenshot.title}
                      className="w-full rounded-lg border border-[#2a2a2a]"
                    />
                    <p className="text-xs text-gray-400 text-center">{screenshot.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Desktop Screenshots</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {screenshots.desktop.map((screenshot, idx) => (
                  <div key={idx} className="space-y-2">
                    <img 
                      src={screenshot.url} 
                      alt={screenshot.title}
                      className="w-full rounded-lg border border-[#2a2a2a]"
                    />
                    <p className="text-xs text-gray-400 text-center">{screenshot.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Features for Store Listing */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Key Features (for Store Listings)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {appDetails.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-[#1a1a1a] rounded-lg">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-white text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}