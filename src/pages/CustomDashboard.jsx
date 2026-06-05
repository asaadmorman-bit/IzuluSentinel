import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/entities/User";
import { Incident, Asset } from "@/entities/all";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Plus, Settings, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const WIDGET_TYPES = [
  { id: "stats", name: "Quick Stats", description: "Key metrics overview" },
  { id: "recent_incidents", name: "Recent Incidents", description: "Latest threat reports" },
  { id: "assets", name: "Asset Status", description: "Protected assets overview" },
  { id: "alerts", name: "Active Alerts", description: "Current system alerts" },
  { id: "weather", name: "Weather", description: "Current weather conditions" },
  { id: "team", name: "Team Status", description: "Team member availability" }
];

export default function CustomDashboard() {
  const [widgets, setWidgets] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [assets, setAssets] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadDashboard();
    loadData();
  }, []);

  const loadDashboard = async () => {
    try {
      const user = await User.me();
      if (user.dashboard_layout) {
        setWidgets(user.dashboard_layout);
      } else {
        // Default layout
        setWidgets([
          { id: "stats", position: 0, visible: true },
          { id: "recent_incidents", position: 1, visible: true },
          { id: "assets", position: 2, visible: true },
          { id: "alerts", position: 3, visible: true }
        ]);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };

  const loadData = async () => {
    const [incidentsData, assetsData] = await Promise.all([
      Incident.list("-created_date", 5),
      Asset.list("-last_check_in", 5)
    ]);
    setIncidents(incidentsData);
    setAssets(assetsData);
  };

  const saveDashboard = async () => {
    await User.updateMyUserData({ dashboard_layout: widgets });
    setIsEditMode(false);
  };

  const toggleWidgetVisibility = (widgetId) => {
    setWidgets(widgets.map(w => 
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    ));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    setWidgets(items.map((item, index) => ({ ...item, position: index })));
  };

  const renderWidget = (widget) => {
    const widgetType = WIDGET_TYPES.find(w => w.id === widget.id);
    if (!widgetType || !widget.visible) return null;

    switch (widget.id) {
      case "stats":
        return (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-white">{incidents.length}</p>
                  <p className="text-xs text-gray-400">Active Incidents</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{assets.length}</p>
                  <p className="text-xs text-gray-400">Protected Assets</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "recent_incidents":
        return (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white text-sm">Recent Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {incidents.slice(0, 3).map((incident) => (
                  <div key={incident.id} className="p-2 bg-[#1a1a1a] rounded">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white truncate flex-1">{incident.title}</p>
                      <Badge className="bg-[#DC2626]/20 text-[#DC2626] text-xs ml-2">
                        {incident.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case "assets":
        return (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white text-sm">Asset Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assets.slice(0, 3).map((asset) => (
                  <div key={asset.id} className="p-2 bg-[#1a1a1a] rounded">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white truncate flex-1">{asset.name}</p>
                      <Badge className="bg-emerald-500/20 text-emerald-400 text-xs ml-2">
                        {asset.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white text-sm">{widgetType.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">{widgetType.description}</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Custom Dashboard</h1>
            <p className="text-gray-400">Personalize your workspace</p>
          </div>
          <div className="flex gap-2">
            {isEditMode && (
              <Button onClick={saveDashboard} className="bg-[#DC2626] hover:bg-[#B91C1C]">
                Save Layout
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setIsEditMode(!isEditMode)}
              className="border-[#2a2a2a] text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              {isEditMode ? "Cancel" : "Edit Layout"}
            </Button>
          </div>
        </div>

        {isEditMode && (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Widget Visibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {widgets.map((widget) => {
                  const widgetType = WIDGET_TYPES.find(w => w.id === widget.id);
                  return (
                    <div
                      key={widget.id}
                      className="p-4 bg-[#1a1a1a] rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="text-white font-medium">{widgetType?.name}</p>
                        <p className="text-xs text-gray-400">{widgetType?.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleWidgetVisibility(widget.id)}
                      >
                        {widget.visible ? (
                          <Eye className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="dashboard">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {widgets
                  .sort((a, b) => a.position - b.position)
                  .filter(w => w.visible)
                  .map((widget, index) => (
                    <Draggable
                      key={widget.id}
                      draggableId={widget.id}
                      index={index}
                      isDragDisabled={!isEditMode}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="relative"
                        >
                          {isEditMode && (
                            <div
                              {...provided.dragHandleProps}
                              className="absolute top-2 right-2 z-10 p-2 bg-[#1a1a1a] rounded cursor-move"
                            >
                              <GripVertical className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          {renderWidget(widget)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}