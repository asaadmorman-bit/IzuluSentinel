import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Drone, DroneOperation } from "@/entities/all";
import { Radio, Battery, MapPin, Settings, Plus, Play, Pause, AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Drones() {
  const [drones, setDrones] = useState([]);
  const [operations, setOperations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDrone, setSelectedDrone] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [dronesData, operationsData] = await Promise.all([
        Drone.list("-created_date"),
        DroneOperation.filter({ status: "in_progress" }, "-actual_start")
      ]);
      setDrones(dronesData);
      setOperations(operationsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      available: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
      in_flight: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
      maintenance: "bg-amber-500/20 text-amber-400 border-amber-500/50",
      charging: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      offline: "bg-gray-500/20 text-gray-400 border-gray-500/50",
      emergency: "bg-red-500/20 text-red-400 border-red-500/50"
    };
    return colors[status] || colors.offline;
  };

  const getBatteryColor = (level) => {
    if (level >= 70) return "text-emerald-400";
    if (level >= 30) return "text-amber-400";
    return "text-red-400";
  };

  const filteredDrones = drones.filter(d => {
    const matchesSearch = !searchQuery || 
      d.drone_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.model?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeOperations = operations.length;
  const availableDrones = drones.filter(d => d.status === "available").length;
  const dronesInFlight = drones.filter(d => d.status === "in_flight").length;
  const maintenanceRequired = drones.filter(d => d.status === "maintenance").length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Radio className="w-8 h-8 text-[#DC2626]" />
              Drone Fleet Management
            </h1>
            <p className="text-gray-400">Real-time drone monitoring and control</p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl("DroneOperations")}>
              <Button className="bg-[#DC2626] hover:bg-[#B91C1C]">
                <Play className="w-4 h-4 mr-2" />
                Manage Operations
              </Button>
            </Link>
            <Button variant="outline" className="border-[#2a2a2a] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Drone
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Fleet</p>
                  <p className="text-3xl font-bold text-white">{drones.length}</p>
                </div>
                <Radio className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">In Flight</p>
                  <p className="text-3xl font-bold text-white">{dronesInFlight}</p>
                </div>
                <Play className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Available</p>
                  <p className="text-3xl font-bold text-white">{availableDrones}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Maintenance</p>
                  <p className="text-3xl font-bold text-white">{maintenanceRequired}</p>
                </div>
                <Settings className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search drones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
              <div className="flex gap-2">
                {["all", "available", "in_flight", "maintenance", "charging"].map((status) => (
                  <Button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    variant={statusFilter === status ? "default" : "outline"}
                    className={statusFilter === status ? "bg-[#DC2626]" : "border-[#2a2a2a] text-white"}
                    size="sm"
                  >
                    {status.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drone Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-80 bg-[#0f0f0f] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrones.map((drone) => {
              const currentOp = operations.find(op => op.drone_id === drone.id);
              
              return (
                <Card 
                  key={drone.id}
                  className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-all cursor-pointer"
                  onClick={() => setSelectedDrone(drone)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{drone.drone_id}</CardTitle>
                        <p className="text-sm text-gray-400 mt-1">{drone.model}</p>
                      </div>
                      <Badge className={getStatusColor(drone.status)} variant="outline">
                        {drone.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Battery className={`w-5 h-5 ${getBatteryColor(drone.battery_level || 0)}`} />
                        <span className="text-white font-medium">{drone.battery_level || 0}%</span>
                      </div>
                      {drone.status === "in_flight" && (
                        <Badge className="bg-cyan-500/20 text-cyan-400">
                          <Play className="w-3 h-3 mr-1" />
                          Live
                        </Badge>
                      )}
                    </div>

                    {drone.current_latitude && drone.current_longitude && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {drone.current_latitude.toFixed(4)}, {drone.current_longitude.toFixed(4)}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Range</p>
                        <p className="text-white font-medium">{drone.max_range_km || 0} km</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Altitude</p>
                        <p className="text-white font-medium">{drone.current_altitude_m || 0} m</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Flights</p>
                        <p className="text-white font-medium">{drone.total_flights || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Flight Time</p>
                        <p className="text-white font-medium">{drone.flight_time_minutes || 0} min</p>
                      </div>
                    </div>

                    {drone.capabilities && drone.capabilities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {drone.capabilities.slice(0, 3).map((cap, idx) => (
                          <Badge key={idx} variant="outline" className="border-[#2a2a2a] text-gray-400 text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {currentOp && (
                      <div className="pt-3 border-t border-[#1a1a1a]">
                        <p className="text-xs text-gray-400 mb-1">Current Mission</p>
                        <p className="text-white font-medium text-sm">{currentOp.mission_name}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 border-[#2a2a2a] text-white">
                        <MapPin className="w-3 h-3 mr-1" />
                        Track
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-[#2a2a2a] text-white">
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!isLoading && filteredDrones.length === 0 && (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-12 text-center">
              <Radio className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-4">No drones found</p>
              <Button variant="outline" className="border-[#2a2a2a] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Drone
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}