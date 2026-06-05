import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Server, AlertTriangle, Shield, Trash2, Edit, Globe, Lock, Zap } from "lucide-react";

export default function CriticalServices() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['criticalServices'],
    queryFn: () => base44.entities.CriticalService.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CriticalService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['criticalServices'] });
      setIsAddModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CriticalService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['criticalServices'] });
      setEditingService(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CriticalService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['criticalServices'] });
    }
  });

  const getCriticalityColor = (level) => {
    switch (level) {
      case 'HIGH': return 'bg-red-500/20 text-red-400';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-400';
      case 'LOW': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getExposureIcon = (exposure) => {
    switch (exposure) {
      case 'INTERNET': return <Globe className="w-4 h-4 text-red-400" />;
      case 'INTERNAL': return <Lock className="w-4 h-4 text-green-400" />;
      case 'HYBRID': return <Zap className="w-4 h-4 text-amber-400" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Critical Services</h1>
            <p className="text-gray-400">
              Define business-critical services for AI-powered threat correlation
            </p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#DC2626] hover:bg-[#B91C1C]">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f0f0f] border-[#1a1a1a]">
              <DialogHeader>
                <DialogTitle className="text-white">Add Critical Service</DialogTitle>
              </DialogHeader>
              <ServiceForm
                onSubmit={(data) => createMutation.mutate(data)}
                isSubmitting={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Services</p>
                  <p className="text-2xl font-bold text-white">{services.length}</p>
                </div>
                <Server className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">High Criticality</p>
                  <p className="text-2xl font-bold text-red-400">
                    {services.filter(s => s.business_criticality === 'HIGH').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Internet-Facing</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {services.filter(s => s.exposure_type === 'INTERNET' || s.exposure_type === 'HYBRID').length}
                  </p>
                </div>
                <Globe className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Internal Only</p>
                  <p className="text-2xl font-bold text-green-400">
                    {services.filter(s => s.exposure_type === 'INTERNAL').length}
                  </p>
                </div>
                <Lock className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services List */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Registered Services</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-400">Loading services...</p>
            ) : services.length === 0 ? (
              <div className="text-center py-12">
                <Server className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No critical services defined yet</p>
                <p className="text-sm text-gray-500 mb-4">
                  Add your first critical service to enable threat correlation
                </p>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-[#DC2626] hover:bg-[#B91C1C]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getExposureIcon(service.exposure_type)}
                          <h3 className="text-lg font-semibold text-white">
                            {service.service_name}
                          </h3>
                          <Badge className={getCriticalityColor(service.business_criticality)}>
                            {service.business_criticality}
                          </Badge>
                          <Badge variant="outline">{service.category}</Badge>
                          <Badge variant="outline">{service.exposure_type}</Badge>
                        </div>
                        {service.description && (
                          <p className="text-sm text-gray-400 mb-2">{service.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {service.owner_email && (
                            <span>Owner: {service.owner_email}</span>
                          )}
                          <span>Added: {new Date(service.created_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingService(service)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-[#0f0f0f] border-[#1a1a1a]">
                            <DialogHeader>
                              <DialogTitle className="text-white">Edit Service</DialogTitle>
                            </DialogHeader>
                            <ServiceForm
                              initialData={service}
                              onSubmit={(data) => updateMutation.mutate({ id: service.id, data })}
                              isSubmitting={updateMutation.isPending}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Delete this critical service?')) {
                              deleteMutation.mutate(service.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ServiceForm({ initialData, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState(initialData || {
    service_name: '',
    category: 'Other',
    business_criticality: 'MEDIUM',
    exposure_type: 'INTERNAL',
    description: '',
    owner_email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-white">Service Name *</Label>
        <Input
          value={formData.service_name}
          onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
          placeholder="e.g., Customer Authentication API"
          required
          className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
        />
      </div>

      <div>
        <Label className="text-white">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger className="bg-[#0a0a0a] border-[#1a1a1a] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Authentication">Authentication</SelectItem>
            <SelectItem value="Payments">Payments</SelectItem>
            <SelectItem value="Data Storage">Data Storage</SelectItem>
            <SelectItem value="API Gateway">API Gateway</SelectItem>
            <SelectItem value="Admin Portal">Admin Portal</SelectItem>
            <SelectItem value="Customer Portal">Customer Portal</SelectItem>
            <SelectItem value="Email Services">Email Services</SelectItem>
            <SelectItem value="Messaging">Messaging</SelectItem>
            <SelectItem value="Analytics">Analytics</SelectItem>
            <SelectItem value="Infrastructure">Infrastructure</SelectItem>
            <SelectItem value="CI/CD">CI/CD</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-white">Business Criticality *</Label>
          <Select
            value={formData.business_criticality}
            onValueChange={(value) => setFormData({ ...formData, business_criticality: value })}
          >
            <SelectTrigger className="bg-[#0a0a0a] border-[#1a1a1a] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white">Exposure *</Label>
          <Select
            value={formData.exposure_type}
            onValueChange={(value) => setFormData({ ...formData, exposure_type: value })}
          >
            <SelectTrigger className="bg-[#0a0a0a] border-[#1a1a1a] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INTERNET">Internet-Facing</SelectItem>
              <SelectItem value="INTERNAL">Internal Only</SelectItem>
              <SelectItem value="HYBRID">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-white">Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Service description and dependencies..."
          className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
          rows={3}
        />
      </div>

      <div>
        <Label className="text-white">Owner Email</Label>
        <Input
          type="email"
          value={formData.owner_email}
          onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
          placeholder="service.owner@company.com"
          className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#DC2626] hover:bg-[#B91C1C]"
      >
        {isSubmitting ? 'Saving...' : initialData ? 'Update Service' : 'Add Service'}
      </Button>
    </form>
  );
}