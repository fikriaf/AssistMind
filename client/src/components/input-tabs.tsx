// import { useState, useRef } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Keyboard, Upload, Lightbulb, Send, X, FileText } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { apiRequest } from "@/lib/queryClient";
// import { toast } from "@/hooks/use-toast";
// import type { PromptTemplate } from "@shared/schema";

// interface InputTabsProps {
//   sessionId: string;
// }

// type ActiveTab = "text" | "file" | "prompt";

// export function InputTabs({ sessionId }: InputTabsProps) {
//   const [activeTab, setActiveTab] = useState<ActiveTab>("text");
//   const [message, setMessage] = useState("");
//   const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: number; type: string }>>([]);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const queryClient = useQueryClient();

//   const { data: promptTemplates } = useQuery<PromptTemplate[]>({
//     queryKey: ["/api/prompt-templates"],
//   });

//   const sendMessageMutation = useMutation({
//     mutationFn: async (content: string) => {
//       const response = await apiRequest("POST", `/api/sessions/${sessionId}/messages`, {
//         content,
//         role: "user",
//       });
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["/api/sessions", sessionId, "messages"] });
//       setMessage("");
//       if (textareaRef.current) {
//         textareaRef.current.style.height = "auto";
//       }
//     },
//     onError: () => {
//       toast({
//         title: "Error",
//         description: "Failed to send message",
//         variant: "destructive",
//       });
//     },
//   });

//   const handleSendMessage = () => {
//     if (!message.trim() || sendMessageMutation.isPending) return;
//     sendMessageMutation.mutate(message.trim());
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setMessage(e.target.value);
    
//     // Auto-resize textarea
//     const textarea = e.target;
//     textarea.style.height = "auto";
//     textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     const newFiles = files.map(file => ({
//       name: file.name,
//       size: file.size,
//       type: file.type,
//     }));
//     setUploadedFiles(prev => [...prev, ...newFiles]);
    
//     // Reset input
//     e.target.value = "";
    
//     toast({
//       title: "Files uploaded",
//       description: `${files.length} file(s) uploaded successfully`,
//     });
//   };

//   const removeFile = (index: number) => {
//     setUploadedFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   const handlePromptSelect = (template: PromptTemplate) => {
//     setMessage(template.content);
//     setActiveTab("text");
//     textareaRef.current?.focus();
//   };

//   const quickActions = [
//     "Market Analysis",
//     "Financial Review", 
//     "Strategy Planning",
//     "Risk Assessment"
//   ];

//   const tabs = [
//     { id: "text" as const, icon: Keyboard, label: "Text" },
//     { id: "file" as const, icon: Upload, label: "File" },
//     { id: "prompt" as const, icon: Lightbulb, label: "Prompt" },
//   ];

//   const getFileIcon = (type: string) => {
//     if (type.includes('pdf')) return '📄';
//     if (type.includes('image')) return '🖼️';
//     if (type.includes('document') || type.includes('word')) return '📝';
//     if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
//     if (type.includes('presentation') || type.includes('powerpoint')) return '📈';
//     return '📁';
//   };

//   return (
//     <div className="border-t border-gray-800 p-6 bg-obsidian">
//       <div className="space-y-4">
//         {/* Tab Navigation */}
//         <div className="flex space-x-1 bg-gray-800 rounded-2xl p-1">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
//                   activeTab === tab.id
//                     ? "bg-gold text-obsidian shadow-lg"
//                     : "text-gray-400 hover:text-white hover:bg-gray-700"
//                 }`}
//               >
//                 <Icon className="h-4 w-4" />
//                 <span>{tab.label}</span>
//               </button>
//             );
//           })}
//         </div>

//         {/* Text Input Tab */}
//         {activeTab === "text" && (
//           <div className="space-y-4">
//             <div className="relative">
//               <Textarea
//                 ref={textareaRef}
//                 placeholder="Ask me anything about strategy, analysis, or planning..."
//                 value={message}
//                 onChange={handleTextareaChange}
//                 onKeyDown={handleKeyDown}
//                 className="w-full bg-gray-800 border-gray-700 rounded-2xl px-6 py-4 pr-14 text-platinum placeholder-gray-400 resize-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 min-h-[100px]"
//                 disabled={sendMessageMutation.isPending}
//               />
//               <Button
//                 onClick={handleSendMessage}
//                 disabled={!message.trim() || sendMessageMutation.isPending}
//                 className="absolute bottom-4 right-4 w-10 h-10 bg-gold text-obsidian rounded-xl hover:bg-yellow-400 glow-gold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Send className="h-4 w-4" />
//               </Button>
//             </div>

//             {/* Quick Actions */}
//             <div className="flex items-center justify-between">
//               <div className="flex flex-wrap gap-2">
//                 {quickActions.map((action) => (
//                   <Button
//                     key={action}
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setMessage(`Please help me with ${action.toLowerCase()}.`)}
//                     className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:border-gold transition-all duration-200"
//                   >
//                     {action}
//                   </Button>
//                 ))}
//               </div>
//               <div className="flex items-center space-x-4 text-sm text-gray-400">
//                 <span className="flex items-center space-x-1">
//                   <Keyboard className="h-3 w-3" />
//                   <span>Enter to send</span>
//                 </span>
//                 <span>Shift + Enter for new line</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* File Upload Tab */}
//         {activeTab === "file" && (
//           <div className="space-y-4">
//             <div className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center hover:border-gold transition-colors group">
//               <Upload className="h-12 w-12 text-gold mx-auto mb-4 group-hover:scale-110 transition-transform" />
//               <p className="text-lg font-medium mb-2 text-platinum">Drop files here or click to upload</p>
//               <p className="text-sm text-gray-400 mb-6">Supports PDF, DOC, XLS, PPT, and images up to 25MB</p>
//               <label className="inline-block">
//                 <input
//                   type="file"
//                   multiple
//                   onChange={handleFileUpload}
//                   className="hidden"
//                   accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif"
//                 />
//                 <Button className="bg-gold text-obsidian hover:bg-yellow-400 glow-gold transition-all duration-200 font-medium px-6 py-3">
//                   Choose Files
//                 </Button>
//               </label>
//             </div>

//             {/* Uploaded Files List */}
//             {uploadedFiles.length > 0 && (
//               <div className="space-y-3">
//                 <h4 className="text-sm font-medium text-gold">Uploaded Files ({uploadedFiles.length})</h4>
//                 {uploadedFiles.map((file, index) => (
//                   <div key={index} className="flex items-center space-x-3 bg-gray-800 rounded-xl p-4 border border-gray-700">
//                     <div className="text-2xl">{getFileIcon(file.type)}</div>
//                     <div className="flex-1">
//                       <p className="font-medium text-platinum truncate">{file.name}</p>
//                       <p className="text-sm text-gray-400">
//                         {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
//                       </p>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => removeFile(index)}
//                       className="text-gold hover:text-yellow-400 hover:bg-gray-700"
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Prompt Template Tab */}
//         {activeTab === "prompt" && (
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {promptTemplates?.map((template) => (
//                 <button
//                   key={template.id}
//                   onClick={() => handlePromptSelect(template)}
//                   className="bg-gray-800 rounded-2xl p-6 text-left hover:bg-gray-700 transition-all duration-200 border border-gray-700 hover:border-gold group"
//                 >
//                   <div className="flex items-start space-x-3">
//                     <div className="text-2xl text-gold">💡</div>
//                     <div className="flex-1">
//                       <h4 className="font-semibold text-gold mb-2 group-hover:text-yellow-400 transition-colors">
//                         {template.title}
//                       </h4>
//                       <p className="text-sm text-gray-400 mb-3">{template.description}</p>
//                       <span className="inline-block bg-bronze/20 text-bronze text-xs px-2 py-1 rounded-full">
//                         {template.category}
//                       </span>
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>
            
//             {(!promptTemplates || promptTemplates.length === 0) && (
//               <div className="text-center py-8 text-gray-400">
//                 <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
//                 <p>No prompt templates available</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
