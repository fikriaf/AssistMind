import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChatSessionSchema, insertMessageSchema, insertFileSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat Sessions
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getChatSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat sessions" });
    }
  });

  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getChatSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat session" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const data = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(data);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create chat session" });
    }
  });

  app.delete("/api/sessions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteChatSession(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      res.json({ message: "Chat session deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete chat session" });
    }
  });

  // Messages
  app.get("/api/sessions/:sessionId/messages", async (req, res) => {
    try {
      const messages = await storage.getMessagesBySession(req.params.sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/sessions/:sessionId/messages", async (req, res) => {
    try {
      const data = insertMessageSchema.parse({
        ...req.body,
        sessionId: req.params.sessionId
      });
      
      // Create user message
      const userMessage = await storage.createMessage(data);
      
      // Simulate AI response (in a real app, this would call an AI service)
      const aiResponse = await generateAIResponse(data.content);
      const assistantMessage = await storage.createMessage({
        sessionId: req.params.sessionId,
        content: aiResponse,
        role: "assistant"
      });
      
      res.status(201).json({ userMessage, assistantMessage });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // Files
  app.get("/api/sessions/:sessionId/files", async (req, res) => {
    try {
      const files = await storage.getFilesBySession(req.params.sessionId);
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  app.post("/api/sessions/:sessionId/files", async (req, res) => {
    try {
      const data = insertFileSchema.parse({
        ...req.body,
        sessionId: req.params.sessionId
      });
      const file = await storage.createFile(data);
      res.status(201).json(file);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid file data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFile(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json({ message: "File deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Prompt Templates
  app.get("/api/prompt-templates", async (req, res) => {
    try {
      const templates = await storage.getPromptTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prompt templates" });
    }
  });

  app.get("/api/prompt-templates/:id", async (req, res) => {
    try {
      const template = await storage.getPromptTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Prompt template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prompt template" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Simulate AI response generation
async function generateAIResponse(userMessage: string): Promise<string> {
  // In a real application, this would call an AI service like OpenAI
  // For now, we'll generate contextual responses based on keywords
  
  const message = userMessage.toLowerCase();
  
  if (message.includes("strategy") || message.includes("planning")) {
    return `## Strategic Analysis

Based on your request, here are key strategic considerations:

### Market Positioning
- Analyze current market dynamics and competitive landscape
- Identify unique value propositions and differentiation opportunities
- Assess resource allocation and capability gaps

### Implementation Framework
1. **Phase 1**: Market research and competitive analysis
2. **Phase 2**: Strategic planning and resource alignment
3. **Phase 3**: Execution and performance monitoring

### Key Performance Indicators
- Market share growth: Target 15-20% increase
- Revenue diversification: Reduce dependency on single revenue streams
- Customer acquisition cost: Optimize to industry benchmarks

Would you like me to elaborate on any specific aspect of this strategic framework?`;
  }
  
  if (message.includes("financial") || message.includes("forecast") || message.includes("revenue")) {
    return `## Financial Analysis

### Revenue Projections
- Q4 revenue forecast: Based on current trends and market conditions
- Growth trajectory: Analyzing historical performance and market indicators
- Risk factors: Economic uncertainties and competitive pressures

### Cost Structure Optimization
- Fixed costs: Review and optimize operational expenses
- Variable costs: Identify efficiency opportunities
- Capital allocation: Strategic investment priorities

### Key Financial Metrics
| Metric | Current | Target | Variance |
|--------|---------|--------|----------|
| Gross Margin | 32% | 35% | +3% |
| Operating Margin | 12% | 15% | +3% |
| ROI | 18% | 22% | +4% |

Recommendations for financial performance improvement are available upon request.`;
  }
  
  if (message.includes("market") || message.includes("analysis") || message.includes("research")) {
    return `## Market Research Insights

### Current Market Dynamics
- Market size and growth potential analysis
- Consumer behavior patterns and preferences
- Emerging trends and disruption factors

### Competitive Landscape
- Key player analysis and market positioning
- Competitive advantages and vulnerabilities
- Market share distribution and dynamics

### Opportunities & Threats
**Opportunities:**
- Emerging market segments with high growth potential
- Technology adoption creating new business models
- Regulatory changes opening new markets

**Threats:**
- Increased competition from new market entrants
- Economic uncertainty affecting consumer spending
- Rapid technological changes requiring adaptation

Would you like detailed analysis on any specific market segment?`;
  }
  
  // Default response for general queries
  return `Thank you for your inquiry. I've analyzed your request and can provide comprehensive insights.

## Executive Summary
Your query touches on important business considerations that require strategic thinking and data-driven analysis.

## Key Recommendations
1. **Immediate Actions**: Prioritize high-impact, low-effort initiatives
2. **Medium-term Strategy**: Develop comprehensive plans with clear milestones
3. **Long-term Vision**: Align initiatives with broader organizational goals

## Next Steps
I recommend we dive deeper into specific areas of interest. Please let me know which aspects you'd like to explore further:
- Strategic planning and implementation
- Financial modeling and forecasting
- Market analysis and competitive intelligence
- Risk assessment and mitigation strategies

How would you like to proceed with this analysis?`;
}
