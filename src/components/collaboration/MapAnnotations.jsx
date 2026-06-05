import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus, Circle, Route, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function MapAnnotations({ annotations, incidents, user }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState({
    annotation_type: "marker",
    latitude: 0,
    longitude: 0,
    title: "",
    description: "",
    color: "red",
    priority: "medium",
    visibility: "team"
  });

  const queryClient = useQueryClient();

  const createAnnotationMutation = useMutation({
    mutationFn: (data) => base44.entities.MapAnnotation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map_annotations'] });
      setShowAddForm(false);
      resetForm();
    }
  });

  const deleteAnnotationMutation = useMutation({
    mutationFn: (id) => base44.entities.MapAnnotation.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map_annotations'] });
    }
  });

  const resetForm = () => {
    setNewAnnotation({
      annotation_type: "marker",
      latitude: 0,
      longitude: 0,
      title: "",
      description: "",
      color: "red",
      priority: "medium",
      visibility: "team"
    });
  };

  const handleCreateAnnotation = () => {
    if (!newAnnotation.title || !user) return;

    createAnnotationMutation.mutate({
      ...newAnnotation,
      created_by_name: user.full_name || user.email
    });
  };

  const getAnnotationIcon = (type) => {
    switch (type) {
      case "marker": return <MapPin className="w-4 h-4" />;
      case "circle": return <Circle className="w-4 h-4" />;
      case "route": return <Route className="w-4 h-4" />;
      case "warning": return <AlertTriangle className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      default: return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Collaborative Map Annotations</h3>
          <p className="text-sm text-gray-400">Mark locations, zones, and routes for team coordination</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#DC2626] hover:bg-[#B91C1C]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Annotation
        </Button>
      </div>

      {/* Add Annotation Form */}
      {showAddForm && (
        <Card className="border-[#DC2626] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Create Map Annotation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Annotation Type</Label>
                <Select
                  value={newAnnotation.annotation_type}
                  onValueChange={(value) => setNewAnnotation({ ...newAnnotation, annotation_type: value })}
                >
                  <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marker">Marker</SelectItem>
                    <SelectItem value="circle">Zone (Circle)</SelectItem>
                    <SelectItem value="polygon">Area (Polygon)</SelectItem>
                    <SelectItem value="route">Route</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="asset_position">Asset Position</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Priority</Label>
                <Select
                  value={newAnnotation.priority}
                  onValueChange={(value) => setNewAnnotation({ ...newAnnotation, priority: value })}
                >
                  <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
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
            </div>

            <div>
              <Label className="text-white">Title</Label>
              <Input
                value={newAnnotation.title}
                onChange={(e) => setNewAnnotation({ ...newAnnotation, title: e.target.value })}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                placeholder="e.g., Checkpoint Alpha, Evacuation Route"
              />
            </div>

            <div>
              <Label className="text-white">Description</Label>
              <Textarea
                value={newAnnotation.description}
                onChange={(e) => setNewAnnotation({ ...newAnnotation, description: e.target.value })}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                placeholder="Additional details..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Latitude</Label>
                <Input
                  type="number"
                  step="0.000001"
                  value={newAnnotation.latitude}
                  onChange={(e) => setNewAnnotation({ ...newAnnotation, latitude: parseFloat(e.target.value) })}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
              </div>
              <div>
                <Label className="text-white">Longitude</Label>
                <Input
                  type="number"
                  step="0.000001"
                  value={newAnnotation.longitude}
                  onChange={(e) => setNewAnnotation({ ...newAnnotation, longitude: parseFloat(e.target.value) })}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Color</Label>
                <Select
                  value={newAnnotation.color}
                  onValueChange={(value) => setNewAnnotation({ ...newAnnotation, color: value })}
                >
                  <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Visibility</Label>
                <Select
                  value={newAnnotation.visibility}
                  onValueChange={(value) => setNewAnnotation({ ...newAnnotation, visibility: value })}
                >
                  <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public (All Users)</SelectItem>
                    <SelectItem value="team">Team Only</SelectItem>
                    <SelectItem value="private">Private (Only Me)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateAnnotation}
                disabled={!newAnnotation.title || createAnnotationMutation.isPending}
                className="bg-[#DC2626] hover:bg-[#B91C1C]"
              >
                Create Annotation
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-[#2a2a2a] text-white"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Annotations List */}
      <div className="grid md:grid-cols-2 gap-4">
        {annotations.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Annotations Yet</h3>
            <p className="text-gray-400">Create your first map annotation to coordinate with your team</p>
          </div>
        ) : (
          annotations.map((annotation) => (
            <Card key={annotation.id} className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getAnnotationIcon(annotation.annotation_type)}
                      <div>
                        <h4 className="font-bold text-white">{annotation.title}</h4>
                        <p className="text-xs text-gray-500 capitalize">
                          {annotation.annotation_type.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(annotation.priority)}>
                      {annotation.priority}
                    </Badge>
                  </div>

                  {annotation.description && (
                    <p className="text-sm text-gray-400">{annotation.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {annotation.latitude.toFixed(4)}, {annotation.longitude.toFixed(4)}
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {annotation.visibility}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
                    <div className="text-xs text-gray-500">
                      By {annotation.created_by_name} • {format(new Date(annotation.created_date), "MMM d, HH:mm")}
                    </div>
                    {annotation.created_by === user?.email && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteAnnotationMutation.mutate(annotation.id)}
                        className="text-red-400 hover:text-white hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}