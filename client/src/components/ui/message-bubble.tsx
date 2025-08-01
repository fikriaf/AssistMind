import { useState } from "react";
import { Bot, Copy, ThumbsUp, Check, CheckCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast({
        title: "Copied",
        description: "Message copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      });
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    toast({
      title: liked ? "Like removed" : "Message liked",
      description: liked ? "Feedback removed" : "Thank you for your feedback",
    });
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderContent = (content: string) => {
    // Enhanced markdown rendering
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inList = false;
    let listItems: string[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <div key={`code-${index}`} className="bg-gray-800 rounded-lg p-3 my-3 font-mono text-sm overflow-x-auto">
              <code className="text-green-400">
                {codeLines.join('\n')}
              </code>
            </div>
          );
          inCodeBlock = false;
          codeLines = [];
        } else {
          // Start code block
          if (inList) {
            elements.push(
              <ul key={`list-${index}`} className="list-disc list-inside space-y-1 mb-3">
                {listItems.map((item, i) => (
                  <li key={i} className="text-sm">{item}</li>
                ))}
              </ul>
            );
            inList = false;
            listItems = [];
          }
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      if (line.startsWith('## ')) {
        if (inList) {
          elements.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-1 mb-3">
              {listItems.map((item, i) => (
                <li key={i} className="text-sm">{item}</li>
              ))}
            </ul>
          );
          inList = false;
          listItems = [];
        }
        elements.push(
          <h4 key={index} className="font-bold text-gold mb-3 mt-4 first:mt-0 text-lg">
            {line.replace('## ', '')}
          </h4>
        );
      } else if (line.startsWith('### ')) {
        if (inList) {
          elements.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-1 mb-3">
              {listItems.map((item, i) => (
                <li key={i} className="text-sm">{item}</li>
              ))}
            </ul>
          );
          inList = false;
          listItems = [];
        }
        elements.push(
          <h5 key={index} className="font-semibold text-gold mb-2 mt-3">
            {line.replace('### ', '')}
          </h5>
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          inList = true;
        }
        listItems.push(line.replace(/^[*-] /, ''));
      } else if (line.includes('|') && line.includes('---')) {
        // Skip table separator lines
        return;
      } else if (line.includes('|')) {
        // Simple table row rendering
        const cells = line.split('|').filter(cell => cell.trim());
        if (cells.length > 1) {
          elements.push(
            <div key={index} className="flex space-x-4 text-sm py-1 border-b border-gray-700 last:border-b-0">
              {cells.map((cell, i) => (
                <span key={i} className={`flex-1 ${i === 0 ? "font-medium text-gold" : "text-gray-300"}`}>
                  {cell.trim()}
                </span>
              ))}
            </div>
          );
        }
      } else if (line.trim()) {
        if (inList) {
          elements.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-1 mb-3 text-gray-300">
              {listItems.map((item, i) => (
                <li key={i} className="text-sm">{item}</li>
              ))}
            </ul>
          );
          inList = false;
          listItems = [];
        }

        // Handle bold text **text**
        let processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gold">$1</strong>');
        // Handle inline code `code`
        processedLine = processedLine.replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-green-400 font-mono text-sm">$1</code>');
        
        elements.push(
          <p key={index} className="leading-relaxed mb-3 text-gray-300" dangerouslySetInnerHTML={{ __html: processedLine }} />
        );
      }
    });

    // Handle remaining list items
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key="final-list" className="list-disc list-inside space-y-1 text-gray-300">
          {listItems.map((item, i) => (
            <li key={i} className="text-sm">{item}</li>
          ))}
        </ul>
      );
    }

    return elements;
  };

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-2xl">
          <div className="flex items-end space-x-2">
            <div className="bg-burgundy text-white rounded-2xl rounded-br-md px-6 py-4 shadow-lg">
              <p className="leading-relaxed">{message.content}</p>
            </div>
            <div className="w-8 h-8 bg-burgundy rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex items-center justify-end mt-2 space-x-2 pr-10">
            <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
            <CheckCheck className="h-3 w-3 text-gold" />
          </div>
        </div>
      </div>
    );
  }

  if (isAssistant) {
    return (
      <div className="flex justify-start">
        <div className="max-w-4xl">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="h-4 w-4 text-obsidian" />
            </div>
            <div className="bg-bronze text-white rounded-2xl rounded-tl-md px-6 py-4 shadow-lg">
              <div className="space-y-3">
                {renderContent(message.content)}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-start mt-3 ml-11 space-x-3">
            <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-xs text-gold hover:text-yellow-400 hover:bg-gray-800 transition-colors"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`h-7 px-2 text-xs transition-colors ${
                liked 
                  ? "text-yellow-400 bg-yellow-400/10" 
                  : "text-gold hover:text-yellow-400 hover:bg-gray-800"
              }`}
            >
              <ThumbsUp className={`h-3 w-3 ${liked ? "fill-current" : ""}`} />
              <span className="ml-1">{liked ? "Liked" : "Like"}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
