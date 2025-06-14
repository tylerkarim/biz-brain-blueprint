
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Lightbulb, 
  FileText, 
  Rocket, 
  ListTodo, 
  History, 
  Folder 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    label: "AI Business Ideas",
    path: "/tools/idea-generator",
    icon: Lightbulb
  },
  {
    label: "Business Plans",
    path: "/tools/business-plan",
    icon: FileText
  },
  {
    label: "Launch Toolkit",
    path: "/tools/launch-toolkit", 
    icon: Rocket
  },
  {
    label: "Tasks",
    path: "/tools/tasks",
    icon: ListTodo
  },
  {
    label: "Prompt History",
    path: "/tools/prompt-history",
    icon: History
  },
  {
    label: "Resources",
    path: "/resources",
    icon: Folder
  }
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-blue-600 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold">BuildAura</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive 
                      ? "bg-blue-700 text-white font-medium" 
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-blue-500">
        <div className="flex space-x-4 text-xs text-blue-200">
          <span>Feedback</span>
          <span>Twitter</span>
          <span>Google</span>
        </div>
      </div>
    </div>
  );
};
