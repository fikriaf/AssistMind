import { useState } from "react";
import { Bot, Copy, ThumbsUp, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
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

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderContent = (content: string) => {
    // Basic markdown rendering for headings and lists
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inList = false;
    let listItems: string[] = [];

    lines.forEach((line, index) => {
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
          <h4 key={index} className="font-semibold text-gold mb-2 mt-4 first:mt-0">
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
          <h5 key={index} className="font-medium text-gold mb-2">
            {line.replace('### ', '')}
          </h5>
        );
      } else if (line.startsWith('- ')) {
        if (!inList) {
          inList = true;
        }
        listItems.push(line.replace('- ', ''));
      } else if (line.includes('|') && line.includes('---')) {
        // Skip table separator lines
        return;
      } else if (line.includes('|')) {
        // Simple table row rendering
        const cells = line.split('|').filter(cell => cell.trim());
        if (cells.length > 1) {
          elements.push(
            <div key={index} className="flex space-x-4 text-sm py-1">
              {cells.map((cell, i) => (
                <span key={i} className={i === 0 ? "font-medium" : ""}>{cell.trim()}</span>
              ))}
            </div>
          );
        }
      } else if (line.trim()) {
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
          <p key={index} className="leading-relaxed mb-3">
            {line}
          </p>
        );
      }
    });

    // Handle remaining list items
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key="final-list" className="list-disc list-inside space-y-1">
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
        <div className="max-w-lg">
          <div className="bg-burgundy text-white rounded-2xl rounded-tr-md px-6 py-4 shadow-lg">
            <p className="leading-relaxed">{message.content}</p>
          </div>
          <div className="flex items-center justify-end mt-2 space-x-2">
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
        <div className="max-w-2xl">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="h-4 w-4 text-obsidian" />
            </div>
            <div className="bg-bronze text-white rounded-2xl rounded-tl-md px-6 py-4 shadow-lg">
              <div className="space-y-3">
                <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    ol: (props) => <ol className="list-decimal pl-5" {...props} />,
    ul: (props) => <ul className="list-disc pl-5" {...props} />,
    li: (props) => <li className="mb-1" {...props} />,
    table: (props) => (
      <table className="table-auto border-collapse border border-[--burgundy] my-3" {...props} />
    ),
    th: (props) => <th className="border border-[--burgundy] px-2 py-1 bg-[--burgundy]" {...props} />,
    td: (props) => <td className="border border-[--burgundy] px-2 py-1" {...props} />,
    blockquote: (props) => <blockquote className="border-l-4 border-[--burgundy] pl-4 italic text-gray-600" {...props} />,
    h1: (props) => <h1 className="text-2xl font-bold text-[--primary] my-2" {...props} />,
    h2: (props) => <h2 className="text-xl font-semibold text-[--primary] my-2" {...props} />,
    h3: (props) => <h3 className="text-lg font-semibold text-[--primary] my-1" {...props} />,
  }}
>
  {message.content}
</ReactMarkdown>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-start mt-2 ml-11 space-x-2">
            <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-2 text-xs text-gold hover:text-yellow-400 hover:bg-transparent"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-gold hover:text-yellow-400 hover:bg-transparent"
            >
              <ThumbsUp className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
