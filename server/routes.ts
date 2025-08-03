import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChatSessionSchema, insertMessageSchema, insertFileSchema } from "@shared/schema";
import { z } from "zod";
import MistralClient from '@mistralai/mistralai';
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.VITE_MISTRAL_API_KEY!;
const client =  new MistralClient(apiKey);

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
      

      // Buat user message
      await storage.createMessage(data);

      // Set header streaming
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");
      res.flushHeaders();

      console.log("STARTING STREAMING...");
      // Streaming dari Mistral langsung
      const stream = await client.chatStream({
        model: "mistral-large-latest",
        messages: [{ role: "user", content: data.content }],
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        
        const delta = (chunk as any).choices?.[0]?.delta?.content;
        if (delta) {
          fullResponse += delta;
          res.write(delta);
        }
      }

      res.end();

      await storage.createMessage({
        sessionId: req.params.sessionId,
        content: fullResponse,
        role: "assistant"
      });

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



// export async function generateAIResponse(userMessage: string): Promise<string> {
//   const stream = await client.chat.stream({
//     model: 'mistral-large-latest',
//     messages: [{ role: 'user', content: userMessage }],
//   });

//   let fullResponse = '';

//   for await (const chunk of stream) {
//     const delta = (chunk as any).choices?.[0]?.delta?.content;
//     if (delta) {
//       fullResponse += delta;
//     }
//   }


//   return fullResponse;
// }
