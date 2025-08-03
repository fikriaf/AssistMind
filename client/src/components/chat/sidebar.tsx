import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Search, 
  MessageSquare, 
  Folder, 
  Lightbulb, 
  Settings, 
  Plus,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import type { ChatSession } from "@shared/schema";

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId?: string;
  isLoading: boolean;
}

export function Sidebar({ sessions, activeSessionId, isLoading }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const createSessionMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await apiRequest("POST", "/api/sessions", { title });
      return response.json();
    },
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      setLocation(`/chat/${newSession.id}`);
      toast({
        title: "New chat created",
        description: "Started a new conversation",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create new chat",
        variant: "destructive",
      });
    },
  });

  const handleNewChat = () => {
    createSessionMutation.mutate("New Chat");
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItems = [
    { icon: MessageSquare, label: "Chats", path: "/chat", active: location.startsWith("/chat") },
    { icon: Folder, label: "Files", path: "/files", active: false },
    { icon: Lightbulb, label: "Prompts", path: "/prompts", active: false },
    { icon: Settings, label: "Settings", path: "/settings", active: false },
  ];

  return (
    <div className="w-64 bg-obsidian border-r border-gray-800 flex flex-col h-full min-h-0">
      {/* Logo/Brand Area */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-gold">AssistMind AI</h1>
        <p className="text-sm text-gray-400 mt-1">Executive Assistant</p>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-colors duration-200 text-left group ${
                item.active
                  ? "bg-burgundy text-white"
                  : "hover:bg-gray-800 text-platinum"
              }`}
            >
              <Icon className="h-5 w-5 text-gold" />
              <span className="font-medium">{item.label}</span>
              {item.label === "Chats" && sessions.length > 0 && (
                <span className="ml-auto bg-gold text-obsidian text-xs px-2 py-1 rounded-full">
                  {sessions.length}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Chat Sessions */}
      {location.startsWith("/chat") && (
        <div className="flex-1 flex flex-col p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-gray-800 border-gray-700 text-platinum placeholder-gray-400"
            />
            <Button
              onClick={handleNewChat}
              disabled={createSessionMutation.isPending}
              className="bg-gold text-obsidian hover:bg-yellow-400 glow-gold"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2 max-h-[10rem]">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/chat/${session.id}`}
                  className={`block p-3 rounded-xl transition-colors ${
                    activeSessionId === session.id
                      ? "bg-bronze text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-platinum"
                  }`}
                >
                  <div className="font-medium truncate">{session.title}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No chats found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
          <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-obsidian" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">Executive User</p>
            <p className="text-xs text-gray-400 truncate">Premium Account</p>
          </div>
        </div>
      </div>
    </div>
  );
}
