import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email notification
      await base44.integrations.Core.SendEmail({
        to: "contact@emergingdefensesolutions.com",
        subject: `Contact Form: ${formData.subject}`,
        body: `
New contact form submission from Izulu Sentinel:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Subject: ${formData.subject}

Message:
${formData.message}
        `.trim()
      });

      setSubmitted(true);
      toast.success("Message sent successfully!");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "contact@emergingdefensesolutions.com",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "United States",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10"
    },
    {
      icon: Clock,
      title: "Hours",
      value: "24/7 Emergency Support",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/50 px-4 py-2 text-xs sm:text-sm">
            Get In Touch
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Have questions about our security solutions? We're here to help 24/7
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {contactInfo.map((info, idx) => (
            <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${info.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <info.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${info.color}`} />
                </div>
                <p className="text-xs sm:text-sm text-gray-400 mb-1">{info.title}</p>
                <p className="text-xs sm:text-sm font-semibold text-white">{info.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                  Send Us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-sm sm:text-base text-gray-400">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs sm:text-sm text-gray-400 mb-2 block">Full Name</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          required
                          className="bg-[#0a0a0a] border-[#2a2a2a] text-white text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm text-gray-400 mb-2 block">Email</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          required
                          className="bg-[#0a0a0a] border-[#2a2a2a] text-white text-sm sm:text-base"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs sm:text-sm text-gray-400 mb-2 block">Phone (Optional)</label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          className="bg-[#0a0a0a] border-[#2a2a2a] text-white text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm text-gray-400 mb-2 block">Subject</label>
                        <Input
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="How can we help?"
                          required
                          className="bg-[#0a0a0a] border-[#2a2a2a] text-white text-sm sm:text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm text-gray-400 mb-2 block">Message</label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us more about your security needs..."
                        required
                        rows={6}
                        className="bg-[#0a0a0a] border-[#2a2a2a] text-white text-sm sm:text-base"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#DC2626] hover:bg-[#B91C1C] py-4 sm:py-6 text-sm sm:text-base"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg text-white">Emergency Support</CardTitle>
              </CardHeader>
              <CardContent className="text-xs sm:text-sm text-gray-400 space-y-2">
                <p>For urgent security matters, contact our 24/7 emergency hotline:</p>
                <p className="text-[#DC2626] font-bold text-base sm:text-lg">+1 (555) 911-SECURE</p>
              </CardContent>
            </Card>

            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg text-white">Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="text-xs sm:text-sm text-gray-400 space-y-1">
                <p>Monday - Friday: 8:00 AM - 6:00 PM EST</p>
                <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                <p>Sunday: Emergency Support Only</p>
              </CardContent>
            </Card>

            <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg text-white">Response Time</CardTitle>
              </CardHeader>
              <CardContent className="text-xs sm:text-sm text-gray-400">
                <p>We typically respond to all inquiries within 24 hours during business days.</p>
              </CardContent>
            </Card>
          </div>
        </div>

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