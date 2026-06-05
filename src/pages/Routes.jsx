import React, { useState, useEffect } from "react";
import { TravelRoute, Incident } from "@/entities/all";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Clock, AlertTriangle, Users } from "lucide-react";
import { format } from "date-fns";

export default function Routes() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [routesData, incidentsData] = await Promise.all([
      TravelRoute.list("-departure_time"),
      Incident.filter({ status: "active" })
    ]);
    setRoutes(routesData);
    setIncidents(incidentsData);
    setIsLoading(false);
  };

  const getRiskColor = (risk) => {
    const colors = {
      low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
      medium: "bg-amber-500/20 text-amber-400 border-amber-500/50",
      high: "bg-orange-500/20 text-orange-400 border-orange-500/50",
      critical: "bg-red-500/20 text-red-400 border-red-500/50"
    };
    return colors[risk] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      planned: "bg-slate-500/20 text-slate-400",
      in_progress: "bg-cyan-500/20 text-cyan-400",
      completed: "bg-emerald-500/20 text-emerald-400",
      cancelled: "bg-red-500/20 text-red-400"
    };
    return colors[status] || colors.planned;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Route Planning & Management
            </h1>
            <p className="text-slate-400">Mission planning with real-time threat intelligence</p>
          </div>
          <Button
            onClick={() => navigate(createPageUrl("PlanRoute"))}
            className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Plan Route
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-800/50 bg-gradient-to-br from-cyan-500/10 to-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Active Routes</p>
                  <p className="text-3xl font-bold text-white">
                    {routes.filter(r => r.status === "in_progress").length}
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-gradient-to-br from-amber-500/10 to-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">High Risk Routes</p>
                  <p className="text-3xl font-bold text-white">
                    {routes.filter(r => r.risk_level === "high" || r.risk_level === "critical").length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-gradient-to-br from-purple-500/10 to-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Planned Today</p>
                  <p className="text-3xl font-bold text-white">
                    {routes.filter(r => {
                      const today = new Date().toDateString();
                      return new Date(r.departure_time).toDateString() === today;
                    }).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-slate-900/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {routes.map((route) => (
              <Card key={route.id} className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-900/70 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-xl mb-2">{route.name}</CardTitle>
                      <p className="text-slate-400">{route.principal || "Principal not specified"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getRiskColor(route.risk_level)} variant="outline">
                        {route.risk_level} risk
                      </Badge>
                      <Badge className={getStatusColor(route.status)}>
                        {route.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Origin</p>
                      <p className="text-white font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        {route.start_location}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Destination</p>
                      <p className="text-white font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-400" />
                        {route.end_location}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Departure Time</p>
                      <p className="text-white flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {format(new Date(route.departure_time), "MMM d, yyyy HH:mm")}
                      </p>
                    </div>
                    {route.team_members && route.team_members.length > 0 && (
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Team Size</p>
                        <p className="text-white flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {route.team_members.length} members
                        </p>
                      </div>
                    )}
                  </div>

                  {route.notes && (
                    <div className="p-3 bg-slate-800/30 rounded-lg">
                      <p className="text-sm text-slate-300">{route.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {routes.length === 0 && (
              <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
                <CardContent className="p-12 text-center">
                  <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg mb-4">No routes planned</p>
                  <Button
                    onClick={() => navigate(createPageUrl("PlanRoute"))}
                    variant="outline"
                    className="border-slate-700 text-white"
                  >
                    Create Your First Route
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}