import { useQuery } from "@tanstack/react-query";
import { Share, Bookmark, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputTabs } from "../input-tabs";
import { MessageBubble } from "./message-bubble";
import type { ChatSession, Message } from "@shared/schema";
import { AnimatedAIChat } from "./AnimatedChatArea";

interface ChatAreaProps {
  session?: ChatSession;
}

export function ChatArea({ session }: ChatAreaProps) {
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/sessions", session?.id, "messages"],
    enabled: !!session?.id,
  });

  if (!session) {
    return (
      <div className="flex mt-[5rem] justify-center h-full min-h-0">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gold mb-4">Welcome to AssistMind AI</h2>
          <p className="text-gray-400 mb-6">Start a new conversation or select an existing chat</p>
          <div className="space-y-3 max-w-md">
            <div className="bg-gray-800 rounded-2xl p-4 text-left border border-gray-700 hover:border-gold transition-colors cursor-pointer">
              <h4 className="font-medium text-gold mb-2">Market Analysis</h4>
              <p className="text-sm text-gray-400">Analyze market trends and competitive landscape</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-4 text-left border border-gray-700 hover:border-gold transition-colors cursor-pointer">
              <h4 className="font-medium text-gold mb-2">Strategic Planning</h4>
              <p className="text-sm text-gray-400">Develop comprehensive business strategies</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-4 text-left border border-gray-700 hover:border-gold transition-colors cursor-pointer">
              <h4 className="font-medium text-gold mb-2">Financial Forecast</h4>
              <p className="text-sm text-gray-400">Create detailed financial projections</p>
            </div>
          </div>
        </div>
        <div className="flex w-screen absolute bottom-0 z-50"><AnimatedAIChat /></div>
      </div>
    );
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-obsidian border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{session.title}</h2>
            <p className="text-sm text-gray-400">
              Last active {new Date(session.updatedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-gold hover:bg-gray-800">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gold hover:bg-gray-800">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gold hover:bg-gray-800">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-end">
                <div className="max-w-lg w-full">
                  <div className="h-20 bg-gray-800 rounded-2xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        ) : (
          <div className="text-center text-gray-400 py-12">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <InputTabs sessionId={session.id} />
    </>
  );
}
