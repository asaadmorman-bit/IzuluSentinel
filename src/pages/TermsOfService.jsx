import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertTriangle, Shield, Users, Scale, Ban } from "lucide-react";

export default function TermsOfService() {
  const sections = [
    {
      icon: Users,
      title: "3. User Eligibility",
      content: "You must be at least 18 years of age and legally authorized to enter into binding agreements to use our services. By using Izulu Sentinel, you represent and warrant that you meet these eligibility requirements."
    },
    {
      icon: FileText,
      title: "4. Account Registration",
      content: "Users must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized access or security breach."
    },
    {
      icon: Shield,
      title: "5. Acceptable Use",
      content: "Usage must comply with all applicable federal, state, and local laws. Prohibited behaviors include unauthorized access, service disruption, or any activities that violate NIST Cybersecurity Framework (CSF) security standards. You may not use the service to compromise security systems or networks."
    },
    {
      icon: Scale,
      title: "6. Intellectual Property",
      content: "All site content, including software, design, text, graphics, and logos, belongs to Izulu Sentinel or its licensors and is protected by intellectual property laws. Users receive a limited, non-exclusive, non-transferable license to access and use the service. Redistribution or unauthorized use is strictly prohibited."
    },
    {
      icon: Lock,
      title: "7. Privacy",
      content: "Your personal data is handled in accordance with our Privacy Policy and NIST Privacy Framework guidelines. We implement technical and organizational measures consistent with NIST CSF standards to protect your information. By using our services, you consent to data collection and processing as described in our Privacy Policy."
    },
    {
      icon: AlertTriangle,
      title: "8. Third-Party Links",
      content: "Our service may contain links to third-party websites or services not owned or controlled by Izulu Sentinel. We are not responsible for the content, privacy policies, or practices of third-party sites. Links are provided for convenience only."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/50 px-4 py-2 text-xs sm:text-sm">
            Terms of Service
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Terms & Conditions
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
            Effective Date: January 6, 2026
          </p>
          <p className="text-sm sm:text-base text-gray-400 max-w-3xl mx-auto">
            Please read these Terms carefully before accessing or using our services.
          </p>
        </div>

        {/* Introduction */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4">
              By accessing our website or services at izulusentinel.com, you accept and agree to be bound by these Terms of Service. Please read them carefully.
            </p>
            <div className="mt-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">2. Services Provided</h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Izulu Sentinel offers comprehensive security intelligence services including threat monitoring, incident response, real-time alerts, and advanced security analytics for residential, enterprise, and government sectors.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#DC2626]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#DC2626]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3">{section.title}</h2>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Terms */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-4 sm:p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">9. Disclaimers & Liability</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-2">
                <strong>Disclaimer:</strong> Services are provided "as is" without warranties of any kind, express or implied. We do not guarantee fitness for a particular purpose, availability, or uninterrupted service.
              </p>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                <strong>Liability Limitation:</strong> To the maximum extent permitted by law, our liability is limited to direct damages not exceeding the amount you paid for services in the 12 months preceding the claim.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">10. Indemnification</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                You agree to indemnify and hold harmless Izulu Sentinel, Emerging Defense Solutions, and their officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from your misuse of the service or breach of these Terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">11. Termination</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-2">
                We may suspend or terminate your account for violations of these Terms, illegal activities, or security threats. Upon termination:
              </p>
              <ul className="space-y-1 text-xs sm:text-sm text-gray-400 ml-4">
                <li>• Your access rights immediately cease</li>
                <li>• You remain liable for outstanding obligations</li>
                <li>• Provisions that by nature survive termination will remain in effect</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">12. Governing Law & Dispute Resolution</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                These Terms are governed by the laws of the United States and applicable state laws. Disputes will be resolved through binding arbitration in accordance with federal and state arbitration rules, with venue in the United States.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">13. Modifications to Terms</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                We reserve the right to change these Terms at any time with reasonable notice via website notification and email. Continued use of the service after updates constitutes acceptance of the revised Terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Compliance Framework</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-2">
                These Terms incorporate security and compliance standards from:
              </p>
              <ul className="space-y-1 text-xs sm:text-sm text-gray-400 ml-4">
                <li>• NIST Cybersecurity Framework (CSF)</li>
                <li>• NIST Privacy Framework</li>
                <li>• Federal, state, and local regulations</li>
                <li>• Industry security best practices</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Contact for Inquiries</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-2">
                For questions about these Terms of Service:
              </p>
              <ul className="space-y-1 text-xs sm:text-sm text-gray-400 ml-4">
                <li>• Email: info@eds-360.com</li>
                <li>• Website: izulusentinel.com</li>
                <li>• Business: Emerging Defense Solutions</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#1a1a1a]">
              <p className="text-xs text-gray-500 leading-relaxed">
                By using Izulu Sentinel, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6 border-t border-[#1a1a1a]">
          <p className="text-gray-500 text-xs sm:text-sm">
            Owned, built and maintained by Emerging Defense Solutions
          </p>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">© 2026 All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}