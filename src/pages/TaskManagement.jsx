import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, Plus, Trash2, Clock, User, Flag } from "lucide-react";
import { format } from "date-fns";

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    assigned_to: "",
    due_date: "",
    tags: []
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      const sampleTasks = [
        {
          id: "1",
          title: "Review security incident reports",
          description: "Review and analyze last week's incident reports",
          priority: "high",
          status: "in_progress",
          assigned_to: "John Smith",
          due_date: new Date(Date.now() + 86400000).toISOString(),
          created_date: new Date(Date.now() - 86400000).toISOString(),
          tags: ["reports", "analysis"]
        },
        {
          id: "2",
          title: "Update threat intelligence feeds",
          description: "Configure new threat intelligence feed integrations",
          priority: "medium",
          status: "todo",
          assigned_to: "Sarah Johnson",
          due_date: new Date(Date.now() + 172800000).toISOString(),
          created_date: new Date(Date.now() - 43200000).toISOString(),
          tags: ["configuration", "intelligence"]
        },
        {
          id: "3",
          title: "Conduct team security training",
          description: "Organize and conduct quarterly security awareness training",
          priority: "high",
          status: "todo",
          assigned_to: "Mike Chen",
          due_date: new Date(Date.now() + 259200000).toISOString(),
          created_date: new Date().toISOString(),
          tags: ["training", "team"]
        },
        {
          id: "4",
          title: "Test emergency protocols",
          description: "Run through emergency response procedures with the team",
          priority: "critical",
          status: "todo",
          assigned_to: "John Smith",
          due_date: new Date(Date.now() + 86400000).toISOString(),
          created_date: new Date(Date.now() - 21600000).toISOString(),
          tags: ["emergency", "testing"]
        },
        {
          id: "5",
          title: "Update asset inventory",
          description: "Verify and update all protected asset information",
          priority: "low",
          status: "done",
          assigned_to: "Sarah Johnson",
          due_date: new Date(Date.now() - 86400000).toISOString(),
          created_date: new Date(Date.now() - 259200000).toISOString(),
          completed_date: new Date(Date.now() - 43200000).toISOString(),
          tags: ["assets", "inventory"]
        }
      ];
      setTasks(sampleTasks);
      localStorage.setItem('tasks', JSON.stringify(sampleTasks));
    }
  };

  const createTask = () => {
    const task = {
      ...newTask,
      id: Date.now().toString(),
      created_date: new Date().toISOString(),
      tags: newTask.tags.filter(t => t.trim())
    };
    const updated = [...tasks, task];
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
    setShowCreateForm(false);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      assigned_to: "",
      due_date: "",
      tags: []
    });
  };

  const updateTaskStatus = (id, newStatus) => {
    const updated = tasks.map(task =>
      task.id === id
        ? {
            ...task,
            status: newStatus,
            completed_date: newStatus === "done" ? new Date().toISOString() : undefined
          }
        : task
    );
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
  };

  const deleteTask = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "low":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "done":
        return "bg-emerald-500/20 text-emerald-400";
      case "in_progress":
        return "bg-cyan-500/20 text-cyan-400";
      case "blocked":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const filteredTasks = tasks.filter(task =>
    filterStatus === "all" || task.status === filterStatus
  );

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === "todo").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    done: tasks.filter(t => t.status === "done").length
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <CheckSquare className="w-8 h-8 text-[#DC2626]" />
              Task Management
            </h1>
            <p className="text-gray-400">Organize and track security operations tasks</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="bg-[#DC2626] hover:bg-[#B91C1C]">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <CheckSquare className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">To Do</p>
                  <p className="text-3xl font-bold text-white">{stats.todo}</p>
                </div>
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-white">{stats.in_progress}</p>
                </div>
                <Flag className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-white">{stats.done}</p>
                </div>
                <CheckSquare className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {["all", "todo", "in_progress", "blocked", "done"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className={filterStatus === status ? "bg-[#DC2626] hover:bg-[#B91C1C]" : "border-[#2a2a2a] text-gray-400"}
                >
                  {status.replace("_", " ").charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Create New Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Task Title</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="What needs to be done?"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
              </div>

              <div>
                <Label className="text-white">Description</Label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Add details..."
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white h-24"
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
                  <Label className="text-white">Assigned To</Label>
                  <Input
                    value={newTask.assigned_to}
                    onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                    placeholder="Team member name"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <Label className="text-white">Due Date</Label>
                  <Input
                    type="date"
                    value={newTask.due_date.split('T')[0]}
                    onChange={(e) => setNewTask({ ...newTask, due_date: new Date(e.target.value).toISOString() })}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateForm(false)} className="border-[#2a2a2a] text-white">
                  Cancel
                </Button>
                <Button onClick={createTask} disabled={!newTask.title} className="bg-[#DC2626] hover:bg-[#B91C1C]">
                  Create Task
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Task List */}
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{task.title}</h3>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-gray-400 mb-3">{task.description}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      {task.assigned_to && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {task.assigned_to}
                        </span>
                      )}
                      {task.due_date && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Due {format(new Date(task.due_date), "MMM d, yyyy")}
                        </span>
                      )}
                    </div>

                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {task.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {task.status !== "done" && (
                      <Select
                        value={task.status}
                        onValueChange={(value) => updateTaskStatus(task.id, value)}
                      >
                        <SelectTrigger className="w-32 bg-[#1a1a1a] border-[#2a2a2a] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}