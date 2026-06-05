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
import { Plus, CheckSquare, Clock, Users, MapPin, AlertTriangle, Check } from "lucide-react";
import { format } from "date-fns";

export default function TaskBoard({ tasks, incidents, user }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    assigned_to: [],
    incident_id: ""
  });

  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: (data) => base44.entities.CollaborativeTask.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborative_tasks'] });
      setShowAddForm(false);
      resetForm();
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CollaborativeTask.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborative_tasks'] });
    }
  });

  const resetForm = () => {
    setNewTask({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      assigned_to: [],
      incident_id: ""
    });
  };

  const handleCreateTask = () => {
    if (!newTask.title) return;
    createTaskMutation.mutate(newTask);
  };

  const handleStatusChange = (task, newStatus) => {
    updateTaskMutation.mutate({
      id: task.id,
      data: { status: newStatus }
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      default: return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-emerald-500/20 text-emerald-400";
      case "in_progress": return "bg-cyan-500/20 text-cyan-400";
      case "blocked": return "bg-red-500/20 text-red-400";
      case "cancelled": return "bg-gray-500/20 text-gray-400";
      default: return "bg-amber-500/20 text-amber-400";
    }
  };

  const tasksByStatus = {
    pending: tasks.filter(t => t.status === "pending"),
    in_progress: tasks.filter(t => t.status === "in_progress"),
    completed: tasks.filter(t => t.status === "completed"),
    blocked: tasks.filter(t => t.status === "blocked")
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Task Coordination Board</h3>
          <p className="text-sm text-gray-400">Manage and track security operation tasks</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#DC2626] hover:bg-[#B91C1C]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <Card className="border-[#DC2626] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Create New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Task Title</Label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                placeholder="e.g., Secure perimeter at Gate B"
              />
            </div>

            <div>
              <Label className="text-white">Description</Label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                placeholder="Task details and requirements..."
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="text-white">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
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

              <div>
                <Label className="text-white">Status</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) => setNewTask({ ...newTask, status: value })}
                >
                  <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Link to Incident</Label>
                <Select
                  value={newTask.incident_id}
                  onValueChange={(value) => setNewTask({ ...newTask, incident_id: value })}
                >
                  <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                    <SelectValue placeholder="Optional" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidents.map((incident) => (
                      <SelectItem key={incident.id} value={incident.id}>
                        {incident.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateTask}
                disabled={!newTask.title || createTaskMutation.isPending}
                className="bg-[#DC2626] hover:bg-[#B91C1C]"
              >
                Create Task
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

      {/* Task Board Columns */}
      <div className="grid lg:grid-cols-4 gap-6">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <div key={status}>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-white capitalize flex items-center gap-2">
                  {status === "pending" && <Clock className="w-4 h-4 text-amber-400" />}
                  {status === "in_progress" && <AlertTriangle className="w-4 h-4 text-cyan-400" />}
                  {status === "completed" && <CheckSquare className="w-4 h-4 text-emerald-400" />}
                  {status === "blocked" && <AlertTriangle className="w-4 h-4 text-red-400" />}
                  {status.replace("_", " ")}
                </h4>
                <Badge className={getStatusColor(status)}>
                  {statusTasks.length}
                </Badge>
              </div>
              <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    status === "completed" ? "bg-emerald-500" :
                    status === "in_progress" ? "bg-cyan-500" :
                    status === "blocked" ? "bg-red-500" : "bg-amber-500"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-3">
              {statusTasks.length === 0 ? (
                <Card className="border-[#1a1a1a] bg-[#0f0f0f]/50">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 text-sm">No tasks</p>
                  </CardContent>
                </Card>
              ) : (
                statusTasks.map((task) => (
                  <Card key={task.id} className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-all">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h5 className="font-semibold text-white text-sm">{task.title}</h5>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>

                        {task.description && (
                          <p className="text-xs text-gray-400 line-clamp-2">{task.description}</p>
                        )}

                        {task.assigned_to && task.assigned_to.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Users className="w-3 h-3" />
                            {task.assigned_to.length} assigned
                          </div>
                        )}

                        {task.due_date && (
                          <div className="flex items-center gap-1 text-xs text-amber-400">
                            <Clock className="w-3 h-3" />
                            {format(new Date(task.due_date), "MMM d")}
                          </div>
                        )}

                        <div className="flex gap-1 pt-2 border-t border-[#1a1a1a]">
                          {status !== "in_progress" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusChange(task, "in_progress")}
                              className="text-xs text-cyan-400 hover:text-white hover:bg-cyan-600"
                            >
                              Start
                            </Button>
                          )}
                          {status !== "completed" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStatusChange(task, "completed")}
                              className="text-xs text-emerald-400 hover:text-white hover:bg-emerald-600"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Complete
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
        ))}
      </div>
    </div>
  );
}