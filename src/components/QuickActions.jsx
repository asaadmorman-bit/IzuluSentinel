import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { 
  Search, 
  Map, 
  AlertTriangle, 
  Users, 
  FileText, 
  Settings,
  Plus,
  BarChart3,
  Shield
} from "lucide-react";

export default function QuickActions() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const quickActions = [
    {
      title: "Dashboard",
      icon: BarChart3,
      url: "Dashboard",
      category: "Navigation"
    },
    {
      title: "Threat Map",
      icon: Map,
      url: "ThreatMap",
      category: "Navigation"
    },
    {
      title: "Create Incident",
      icon: Plus,
      url: "Report",
      category: "Actions"
    },
    {
      title: "View Alerts",
      icon: AlertTriangle,
      url: "Alerts",
      category: "Navigation"
    },
    {
      title: "Team Management",
      icon: Users,
      url: "Team",
      category: "Navigation"
    },
    {
      title: "Intelligence Reports",
      icon: FileText,
      url: "Intelligence",
      category: "Navigation"
    },
    {
      title: "Settings",
      icon: Settings,
      url: "Settings",
      category: "Navigation"
    },
    {
      title: "Analytics",
      icon: BarChart3,
      url: "Analytics",
      category: "Navigation"
    },
    {
      title: "Drone Operations",
      icon: Shield,
      url: "DroneOperations",
      category: "Operations"
    }
  ];

  const handleSelect = (url) => {
    navigate(createPageUrl(url));
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-gray-400 hover:text-white hover:border-[#DC2626] transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">Quick Actions</span>
        <kbd className="hidden md:inline-block px-2 py-0.5 text-xs bg-[#0f0f0f] border border-[#2a2a2a] rounded">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {Object.entries(
            quickActions.reduce((acc, action) => {
              if (!acc[action.category]) acc[action.category] = [];
              acc[action.category].push(action);
              return acc;
            }, {})
          ).map(([category, actions]) => (
            <CommandGroup key={category} heading={category}>
              {actions.map((action) => (
                <CommandItem
                  key={action.url}
                  onSelect={() => handleSelect(action.url)}
                  className="cursor-pointer"
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  <span>{action.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}