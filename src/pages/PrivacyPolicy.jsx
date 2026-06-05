import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Database, UserCheck, FileText, Scale, AlertTriangle } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: Database,
      title: "3. Data Collection & Purpose",
      content: [
        "Categories Assessed (NIST ID.IM-P): We document personal data types, data subjects, and processing purposes",
        "User authentication and account management",
        "Service delivery and platform functionality",
        "Communications and customer support",
        "Legal compliance and regulatory requirements"
      ]
    },
    {
      icon: FileText,
      title: "4. Data Inventory & Mapping",
      content: [
        "We maintain inventory of data assets per NIST ID.IM-P guidance",
        "Documentation of processing systems and data flows",
        "Geographic storage locations tracked and monitored",
        "Regular audits of data asset inventory"
      ]
    },
    {
      icon: Scale,
      title: "5. Legal Basis",
      content: [
        "User consent for voluntary data collection",
        "Contractual necessity for service delivery",
        "Legal obligation compliance (aligned with NIST ID.GV-P0)",
        "Legitimate business interests with privacy safeguards"
      ]
    },
    {
      icon: Shield,
      title: "6. Data Minimization",
      content: [
        "Only collect data necessary for stated purposes",
        "Aligned with NIST's privacy core functions (Identify & Protect)",
        "Regular review of data collection practices",
        "Deletion of unnecessary or outdated information"
      ]
    },
    {
      icon: Lock,
      title: "7. Data Security",
      content: [
        "Technical measures: encryption, access controls, monitoring",
        "Organizational controls aligned with NIST CSF Protect function",
        "Detection capabilities per NIST CSF Detect guidelines",
        "Regular security assessments and penetration testing",
        "24/7 security monitoring and incident response"
      ]
    },
    {
      icon: Eye,
      title: "8. Third-Party Sharing",
      content: [
        "Data shared with processing partners under contractual safeguards",
        "All third-party sharing reflects NIST supply chain rules",
        "Privacy rules maintained across vendor relationships",
        "We do not sell personal information",
        "Legal compliance and law enforcement requests honored"
      ]
    },
    {
      icon: FileText,
      title: "9. Retention",
      content: [
        "Data retained as necessary to fulfill stated purposes",
        "Compliance with legal and regulatory obligations",
        "Secure deletion when retention period expires",
        "Backup retention for disaster recovery purposes"
      ]
    },
    {
      icon: UserCheck,
      title: "10. User Rights",
      content: [
        "Request access to your personal data",
        "Request correction of inaccurate information",
        "Request deletion of your data (right to be forgotten)",
        "Request data portability in machine-readable format",
        "Object to data processing activities",
        "Submit requests via privacy@eds-360.com"
      ]
    },
    {
      icon: AlertTriangle,
      title: "11. Security Incident Response",
      content: [
        "Response procedures following NIST CSF Respond guidelines",
        "Timely notification to affected parties",
        "Coordination with appropriate authorities",
        "Post-incident analysis and remediation",
        "Continuous improvement of security controls"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/50 px-4 py-2 text-xs sm:text-sm">
            Privacy Policy
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Your Privacy Matters
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
            Effective Date: January 6, 2026
          </p>
          <p className="text-sm sm:text-base text-gray-400 max-w-3xl mx-auto">
            Izulu Sentinel is committed to protecting your privacy in compliance with the NIST Privacy Framework and NIST CSF principles.
          </p>
        </div>

        {/* Introduction */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4">
              Izulu Sentinel ("we", "our") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard personal information in compliance with the NIST Privacy Framework and NIST CSF principles and applicable commercial and private-sector standards.
            </p>
            <div className="mt-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">2. Scope & Responsibility</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
                <li>• Applies to all users and visitors of izulusentinel.com</li>
                <li>• Compliance aligns with NIST Privacy Framework Core, including governance and data protection practices at scale</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#DC2626]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#DC2626]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3">{section.title}</h2>
                    <ul className="space-y-2">
                      {section.content.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2">
                          <span className="text-[#DC2626] mt-1.5">•</span>
                          <span className="text-xs sm:text-sm text-gray-400">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-4 sm:p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">12. International Transfers</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Where applicable, we use appropriate safeguards to ensure protection of data transferred internationally. All transfers comply with NIST Privacy Framework guidelines and applicable data protection regulations.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">13. Changes to This Policy</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Changes to this Privacy Policy will be communicated via website notice and email notification. Continued use of our services after updates indicates acceptance of the revised policy.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Compliance References</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-2">
                This Privacy Policy aligns with:
              </p>
              <ul className="space-y-1 text-xs sm:text-sm text-gray-400 ml-4">
                <li>• NIST Privacy Framework Core Functions</li>
                <li>• NIST Cybersecurity Framework (CSF) Standards</li>
                <li>• Federal, state, and local privacy regulations</li>
                <li>• Commercial and private-sector data protection standards</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Contact Information</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-2">
                For privacy-related inquiries, data subject rights requests, or security incidents:
              </p>
              <ul className="space-y-1 text-xs sm:text-sm text-gray-400 ml-4">
                <li>• Email: privacy@eds-360.com</li>
                <li>• Website: izulusentinel.com</li>
                <li>• Mail: Emerging Defense Solutions, United States</li>
              </ul>
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