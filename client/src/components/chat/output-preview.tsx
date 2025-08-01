import { useQuery } from "@tanstack/react-query";
import { Copy, Download, ExpandIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";

export function OutputPreview() {
  // This would typically get the latest AI response for preview
  // For now, we'll show a static preview panel

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

  return (
    <div className="w-96 border-l border-gray-800 bg-gray-900 flex flex-col">
      {/* Preview Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gold">Output Preview</h3>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-gold hover:bg-gray-800"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-gold hover:bg-gray-800"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {/* Markdown Output Preview */}
        <div className="bg-obsidian rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gold font-medium">MARKDOWN OUTPUT</span>
            <span className="text-xs text-gray-400">Live Preview</span>
          </div>
          <div className="text-sm text-platinum leading-relaxed space-y-3">
            <h4 className="text-gold font-semibold">Strategic Analysis Framework</h4>
            <p>AI-generated insights and recommendations will appear here when you interact with the assistant.</p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Real-time markdown rendering</li>
              <li>Code syntax highlighting</li>
              <li>Table and chart support</li>
              <li>Export functionality</li>
            </ul>
          </div>
        </div>

        {/* Data Table Preview */}
        <div className="bg-obsidian rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gold font-medium">DATA TABLE</span>
            <span className="text-xs text-gray-400">Live Data</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-gold">Metric</th>
                  <th className="text-right py-2 text-gold">Value</th>
                  <th className="text-right py-2 text-gold">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800">
                  <td className="py-2">Response Time</td>
                  <td className="text-right py-2">1.2s</td>
                  <td className="text-right py-2 text-green-400">Good</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2">Accuracy</td>
                  <td className="text-right py-2">98%</td>
                  <td className="text-right py-2 text-green-400">Excellent</td>
                </tr>
                <tr>
                  <td className="py-2">Processing</td>
                  <td className="text-right py-2">Active</td>
                  <td className="text-right py-2 text-yellow-400">Running</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Visualization Placeholder */}
        <div className="bg-obsidian rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gold font-medium">VISUALIZATION</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gold hover:text-yellow-400"
            >
              <ExpandIcon className="h-3 w-3" />
            </Button>
          </div>
          <div className="h-32 bg-gray-800 rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm">Charts and visualizations will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
