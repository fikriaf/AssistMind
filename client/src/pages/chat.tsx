import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Sidebar } from "@/components/chat/sidebar";
import { ChatArea } from "@/components/chat/chat-area";
import { OutputPreview } from "@/components/chat/output-preview";
import type { ChatSession } from "@shared/schema";

export default function Chat() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  
  const { data: sessions, isLoading: sessionsLoading } = useQuery<ChatSession[]>({
    queryKey: ["/api/sessions"],
  });

  const { data: currentSession } = useQuery<ChatSession>({
    queryKey: ["/api/sessions", sessionId],
    enabled: !!sessionId,
  });

  const activeSession = sessionId ? currentSession : sessions?.[0];

  return (
    <div className="flex h-screen bg-obsidian text-platinum">
      <Sidebar 
        sessions={sessions || []} 
        activeSessionId={activeSession?.id}
        isLoading={sessionsLoading}
      />
      
      <div className="flex-1 flex flex-col">
        <ChatArea session={activeSession} />
      </div>
      
      <OutputPreview />
    </div>
  );
}
