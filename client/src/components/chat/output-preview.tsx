import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Copy, Download, ExpandIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface OutputPreviewProps {
  blocks: string[];
}

export function OutputPreview({ blocks }: OutputPreviewProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("Sample content");
      toast({
        title: "Copied",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download",
      description: "Feature coming soon",
    });
  };
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!messagesEndRef.current || !messagesEndRef.current.parentElement) return;

    const container = messagesEndRef.current.parentElement;

    // Clear timeout agar tidak tumpang tindih
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Gunakan scroll langsung (tanpa animasi) saat streaming aktif
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "auto", // gunakan "auto" agar tidak memantul
    });

    // Lalu aktifkan "smooth" setelah delay (anggap streaming sudah berhenti)
    scrollTimeoutRef.current = setTimeout(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }, 200); // delay 200ms setelah update terakhir
  }, [blocks]);



  return (
    <div className="w-96 border-l border-gray-800 bg-gray-900 flex flex-col h-full min-h-0">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gold">Output Preview</h3>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={handleCopy} className="text-gold hover:bg-gray-800">
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-gold hover:bg-gray-800 hover:text-yellow-400"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 max-h-screen">
        {blocks.every((block) => block.trim() === "") ? (
          <div className="bg-obsidian rounded-2xl p-4 mb-4 text-gray-500 text-sm">
            Structured output will appear here...
          </div>
        ) : (
          blocks.map((content, index) => (
            <div key={index} className="bg-obsidian rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Block #{index + 1}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gold font-medium">MARKDOWN OUTPUT</span>
                <span className="text-xs text-gray-400">Live Preview</span>
              </div>
              <div className="text-sm text-platinum leading-relaxed space-y-3 prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                  components={{
                  code({ node, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    const lang = match?.[1];

                    // Render inline code (misal: `const x = 5`)
                    if (!className) {
                      return (
                        <code className="bg-[#333] px-1 py-0.5 rounded text-gold text-sm">
                          {children}
                        </code>
                      );
                    }

                    // Render code block dengan language header
                    return (
                      <div className="relative rounded-xl bg-[#1e1e1e] overflow-hidden">
                        {lang && (
                          <div className="px-4 py-2 text-xs font-mono text-gold bg-[#2d2d2d] border-b border-gray-800">
                            {lang}
                          </div>
                        )}
                        <pre className="p-0 m-0 overflow-x-auto border rounded-b-xl rounded-t-none">
                          <code className={`p-0 m-0 ${className}`} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    );
                  },
                }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
