import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Keyboard, Upload, Lightbulb, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import type { PromptTemplate } from "@shared/schema";

export interface InputTabsProps {
  sessionId: string;
  setStreamingResponse: React.Dispatch<React.SetStateAction<string>>;
  streamingResponse: string;
  isStructuredFormat: boolean;
  setIsStructuredFormat: React.Dispatch<React.SetStateAction<boolean>>;
  previewBlocks: string[];
  setPreviewBlocks: React.Dispatch<React.SetStateAction<string[]>>;
  setLivePreviewBlock: React.Dispatch<React.SetStateAction<string>>; 
}



type ActiveTab = "text" | "file" | "prompt";

export function InputTabs({ sessionId, setStreamingResponse, streamingResponse, isStructuredFormat, setIsStructuredFormat, previewBlocks, setPreviewBlocks, setLivePreviewBlock}: InputTabsProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("text");
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: number; type: string }>>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();



  const { data: promptTemplates } = useQuery<PromptTemplate[]>({
    queryKey: ["/api/prompt-templates"],
  });
  
  const handleSendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const optimisticMessage = {
      id: crypto.randomUUID(),
      content: trimmed,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    queryClient.setQueryData(
      ["/api/sessions", sessionId, "messages"],
      (old: any) => {
        const messages = Array.isArray(old) ? old : [];
        return [...messages, optimisticMessage];
      }
    );

    setMessage("");
    setStreamingResponse("");
    const res = await fetch(`/api/sessions/${sessionId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: trimmed, role: "user" }),
    });

    if (!res.body) throw new Error("No response body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    
    let fullResponse = "";
    let codeBlockOpen = false;
    let currentBlockBuffer = "";
    let backtickBuffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);

      for (let i = 0; i < chunk.length; i++) {
        const char = chunk[i];

        if (char === '`') {
          backtickBuffer += '`';

          if (backtickBuffer === '```') {
            backtickBuffer = ""; // Reset langsung

            if (codeBlockOpen) {
              // END BLOCK
              const final = currentBlockBuffer;
              setLivePreviewBlock(final); // jaga agar tetap tampil
              setPreviewBlocks((prev) => [...prev, final]);

              setTimeout(() => {
                setLivePreviewBlock(""); // kosongkan setelah render
              }, 0);

              currentBlockBuffer = "";
              codeBlockOpen = false;
              setIsStructuredFormat(false);
            } else {
              // START BLOCK
              let lang = "";
              let j = i + 1;

              while (j < chunk.length && /[a-zA-Z]/.test(chunk[j])) {
                lang += chunk[j];
                j++;
              }

              if (chunk[j] === '\n') j++; // Lewati newline

              i = j - 1; // Pastikan posisi benar

              currentBlockBuffer = `\`\`\`${lang}`;
              codeBlockOpen = true;
              setIsStructuredFormat(true);
            }

            continue;
          }
        continue;
      }


    if (backtickBuffer.length > 0) {
      const all = backtickBuffer + char;
      backtickBuffer = "";
      if (codeBlockOpen) {
        currentBlockBuffer += all;
      } else {
        fullResponse += all;
        setStreamingResponse((prev) => prev + all);
      }
      continue;
    }

    if (codeBlockOpen) {
      currentBlockBuffer += char;
      setLivePreviewBlock(currentBlockBuffer.slice());
    } else {
      setStreamingResponse((prev) => {
        const updated = prev + char;
        fullResponse = updated;
        return updated;
      });
    }
  }
}

// Terakhir, simpan message asisten
queryClient.setQueryData(
  ["/api/sessions", sessionId, "messages"],
  (old: any) => {
    const messages = Array.isArray(old) ? old : [];
    return [
      ...messages,
      {
        id: crypto.randomUUID(),
        content: fullResponse,
        role: "assistant",
        createdAt: new Date().toISOString(),
      },
    ];
  }
);

setStreamingResponse("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Reset input
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePromptSelect = (template: PromptTemplate) => {
    setMessage(template.content);
    setActiveTab("text");
    textareaRef.current?.focus();
  };

  const quickActions = [
    "Market Analysis",
    "Financial Review",
    "Strategy Planning",
  ];

  const tabs = [
    { id: "text" as const, icon: Keyboard, label: "Text" },
    { id: "file" as const, icon: Upload, label: "File" },
    { id: "prompt" as const, icon: Lightbulb, label: "Prompt" },
  ];

  return (
    <div className="border-t border-gray-800 p-6">
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 rounded-2xl p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === tab.id
                    ? "bg-gold text-obsidian"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Text Input Tab */}
        {activeTab === "text" && (
          <div className="space-y-3">
            <div className="flex space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Ask me anything about strategy, analysis, or planning..."
                    value={message}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-gray-800 border-gray-700 rounded-2xl px-6 py-4 pr-14 text-platinum placeholder-gray-400 resize-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-colors min-h-[80px]"
                    // disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    // disabled={!message.trim() || sendMessageMutation.isPending}
                    className="absolute bottom-3 right-3 w-10 h-10 bg-gold text-obsidian rounded-xl hover:bg-yellow-400 glow-gold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {quickActions.map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage(`Please help me with ${action.toLowerCase()}.`)}
                    className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    {action}
                  </Button>
                ))}
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <span>Enter to send</span>
                <span>↑ for history</span>
              </div>
            </div>
          </div>
        )}

        {/* File Upload Tab */}
        {activeTab === "file" && (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center hover:border-gold transition-colors">
              <Upload className="h-12 w-12 text-gold mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
              <p className="text-sm text-gray-400 mb-4">Supports PDF, DOC, XLS, PPT, and images up to 25MB</p>
              <label className="inline-block">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif"
                />
                <Button className="bg-gold text-obsidian hover:bg-yellow-400 glow-gold transition-all">
                  Choose Files
                </Button>
              </label>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gray-800 rounded-xl p-3">
                    <div className="flex-1">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-gold hover:text-yellow-400"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Prompt Template Tab */}
        {activeTab === "prompt" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {promptTemplates?.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handlePromptSelect(template)}
                  className="bg-gray-800 rounded-2xl p-4 text-left hover:bg-gray-700 transition-colors border border-gray-700 hover:border-gold"
                >
                  <h4 className="font-medium text-gold mb-2">{template.title}</h4>
                  <p className="text-sm text-gray-400">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
