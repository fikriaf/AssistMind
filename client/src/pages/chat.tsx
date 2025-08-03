import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Sidebar } from "@/components/chat/sidebar";
import { ChatArea } from "@/components/chat/chat-area";
import { OutputPreview } from "@/components/chat/output-preview";
import type { ChatSession } from "@shared/schema";
import { AnimatedAIChat } from "@/components/chat/AnimatedChatArea";
import "highlight.js/styles/atom-one-dark.css";


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

  const [previewBlocks, setPreviewBlocks] = useState<string[]>([]);
  const [livePreviewBlock, setLivePreviewBlock] = useState("");

  const mergedBlocks = useMemo(
    () =>
      livePreviewBlock.trim()
        ? [...previewBlocks, livePreviewBlock]
        : previewBlocks,
    [previewBlocks, livePreviewBlock]
  );
  return (
    <div className="flex h-screen overflow-hidden bg-obsidian text-platinum">
      <Sidebar 
        sessions={sessions || []} 
        activeSessionId={activeSession?.id}
        isLoading={sessionsLoading}
      />
      
      <div className="flex-1 w-full flex flex-col">
        <ChatArea
          session={activeSession}
          previewBlocks={previewBlocks}
          setPreviewBlocks={setPreviewBlocks}
          setLivePreviewBlock={setLivePreviewBlock} 
        />
      </div>
      
      <OutputPreview blocks={mergedBlocks} />
    </div>
  );
}
