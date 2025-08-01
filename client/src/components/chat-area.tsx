import { useQuery } from "@tanstack/react-query";
import { Share, Bookmark, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputTabs } from "./input-tabs";
import { MessageBubble } from "@/components/ui/message-bubble";
import type { ChatSession, Message } from "@shared/schema";

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
      <div className="flex-1 flex items-center justify-center bg-obsidian">
        <div className="text-center max-w-2xl px-6">
          <h2 className="text-3xl font-bold text-gold mb-4">Welcome to Luxe AI</h2>
          <p className="text-gray-400 mb-8 text-lg">Your executive assistant for strategic insights and analysis</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
            <div className="bg-gray-800 rounded-2xl p-6 text-left border border-gray-700 hover:border-gold transition-colors cursor-pointer group">
              <div className="text-gold text-2xl mb-3">📊</div>
              <h4 className="font-semibold text-platinum mb-2 group-hover:text-gold transition-colors">Market Analysis</h4>
              <p className="text-sm text-gray-400">Analyze market trends, competitive landscape, and growth opportunities</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 text-left border border-gray-700 hover:border-gold transition-colors cursor-pointer group">
              <div className="text-gold text-2xl mb-3">🎯</div>
              <h4 className="font-semibold text-platinum mb-2 group-hover:text-gold transition-colors">Strategic Planning</h4>
              <p className="text-sm text-gray-400">Develop comprehensive business strategies and implementation roadmaps</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 text-left border border-gray-700 hover:border-gold transition-colors cursor-pointer group">
              <div className="text-gold text-2xl mb-3">💰</div>
              <h4 className="font-semibold text-platinum mb-2 group-hover:text-gold transition-colors">Financial Forecast</h4>
              <p className="text-sm text-gray-400">Create detailed financial projections and budget analysis</p>
            </div>
          </div>
          <p className="text-gray-500 mt-8">Start a new conversation or select an existing chat to begin</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-obsidian border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-platinum">{session.title}</h2>
            <p className="text-sm text-gray-400">
              Last active {new Date(session.updatedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-gold hover:bg-gray-800 hover:text-yellow-400">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gold hover:bg-gray-800 hover:text-yellow-400">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gold hover:bg-gray-800 hover:text-yellow-400">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6 bg-obsidian">
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
            <div className="text-gold text-4xl mb-4">💬</div>
            <p className="text-lg">No messages yet</p>
            <p className="text-sm mt-2">Start the conversation with your executive AI assistant</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <InputTabs sessionId={session.id} />
    </>
  );
}
