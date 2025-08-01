import { useQuery } from "@tanstack/react-query";
import { Copy, Download, ExpandIcon, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";

export function OutputPreview() {
  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
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
      description: "Export functionality coming soon",
    });
  };

  const sampleMarkdown = `# Strategic Analysis Framework

## Executive Summary
AI-generated insights and recommendations appear here when you interact with the assistant.

## Key Features
- Real-time markdown rendering
- Code syntax highlighting  
- Table and chart support
- Export functionality

## Implementation Status
✅ Core functionality complete
🔄 Advanced features in progress
📊 Analytics dashboard ready`;

  const performanceMetrics = [
    { label: "Response Time", value: "1.2s", status: "Excellent", color: "text-green-400" },
    { label: "Accuracy", value: "98%", status: "Excellent", color: "text-green-400" },
    { label: "Processing", value: "Active", status: "Running", color: "text-yellow-400" },
    { label: "Uptime", value: "99.9%", status: "Stable", color: "text-green-400" }
  ];

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
              onClick={() => handleCopy(sampleMarkdown)}
              className="text-gold hover:bg-gray-800 hover:text-yellow-400"
            >
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

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {/* Markdown Output Preview */}
        <div className="bg-obsidian rounded-2xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gold font-medium uppercase tracking-wide">Markdown Output</span>
            <span className="text-xs text-gray-400">Live Preview</span>
          </div>
          <div className="text-sm text-platinum leading-relaxed space-y-3">
            <h4 className="text-gold font-semibold text-base">Strategic Analysis Framework</h4>
            <p className="text-gray-300">AI-generated insights and recommendations will appear here when you interact with the assistant.</p>
            <div className="space-y-2">
              <h5 className="text-gold font-medium">Key Features:</h5>
              <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                <li>Real-time markdown rendering</li>
                <li>Code syntax highlighting</li>
                <li>Table and chart support</li>
                <li>Export functionality</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-obsidian rounded-2xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gold font-medium uppercase tracking-wide">Performance Metrics</span>
            <TrendingUp className="h-4 w-4 text-gold" />
          </div>
          <div className="space-y-3">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{metric.label}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-platinum">{metric.value}</span>
                  <span className={`text-xs ${metric.color}`}>{metric.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Table Preview */}
        <div className="bg-obsidian rounded-2xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gold font-medium uppercase tracking-wide">Analysis Results</span>
            <BarChart3 className="h-4 w-4 text-gold" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-gold text-xs uppercase tracking-wide">Category</th>
                  <th className="text-right py-2 text-gold text-xs uppercase tracking-wide">Score</th>
                  <th className="text-right py-2 text-gold text-xs uppercase tracking-wide">Trend</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800">
                  <td className="py-2">Market Position</td>
                  <td className="text-right py-2 font-medium">8.5</td>
                  <td className="text-right py-2 text-green-400">↗ +12%</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2">Financial Health</td>
                  <td className="text-right py-2 font-medium">9.2</td>
                  <td className="text-right py-2 text-green-400">↗ +8%</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2">Innovation Index</td>
                  <td className="text-right py-2 font-medium">7.8</td>
                  <td className="text-right py-2 text-yellow-400">→ 0%</td>
                </tr>
                <tr>
                  <td className="py-2">Risk Factor</td>
                  <td className="text-right py-2 font-medium">3.2</td>
                  <td className="text-right py-2 text-green-400">↘ -15%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Visualization Placeholder */}
        <div className="bg-obsidian rounded-2xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gold font-medium uppercase tracking-wide">Visualization</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gold hover:text-yellow-400 p-1"
            >
              <ExpandIcon className="h-3 w-3" />
            </Button>
          </div>
          <div className="h-40 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700 hover:border-gold transition-colors">
            <div className="text-center text-gray-500">
              <div className="text-3xl mb-3 text-gold">📊</div>
              <p className="text-sm font-medium text-gray-400">Interactive Charts</p>
              <p className="text-xs text-gray-500 mt-1">Visualizations will appear here</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-obsidian rounded-2xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gold font-medium uppercase tracking-wide">Session Stats</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-platinum">24</div>
              <div className="text-xs text-gray-400">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-platinum">5.2k</div>
              <div className="text-xs text-gray-400">Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-platinum">3</div>
              <div className="text-xs text-gray-400">Files</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-platinum">12m</div>
              <div className="text-xs text-gray-400">Duration</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
