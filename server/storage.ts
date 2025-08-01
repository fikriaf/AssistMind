import { 
  type ChatSession, 
  type Message, 
  type UploadedFile, 
  type PromptTemplate,
  type InsertChatSession,
  type InsertMessage,
  type InsertFile,
  type InsertPromptTemplate
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Chat Sessions
  getChatSessions(): Promise<ChatSession[]>;
  getChatSession(id: string): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined>;
  deleteChatSession(id: string): Promise<boolean>;

  // Messages
  getMessagesBySession(sessionId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  deleteMessage(id: string): Promise<boolean>;

  // Files
  getFilesBySession(sessionId: string): Promise<UploadedFile[]>;
  getFile(id: string): Promise<UploadedFile | undefined>;
  createFile(file: InsertFile): Promise<UploadedFile>;
  deleteFile(id: string): Promise<boolean>;

  // Prompt Templates
  getPromptTemplates(): Promise<PromptTemplate[]>;
  getPromptTemplate(id: string): Promise<PromptTemplate | undefined>;
  createPromptTemplate(template: InsertPromptTemplate): Promise<PromptTemplate>;
  updatePromptTemplate(id: string, updates: Partial<PromptTemplate>): Promise<PromptTemplate | undefined>;
  deletePromptTemplate(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private chatSessions: Map<string, ChatSession> = new Map();
  private messages: Map<string, Message> = new Map();
  private files: Map<string, UploadedFile> = new Map();
  private promptTemplates: Map<string, PromptTemplate> = new Map();

  constructor() {
    // Initialize with default prompt templates
    this.initializePromptTemplates();
  }

  private initializePromptTemplates() {
    const defaultTemplates: InsertPromptTemplate[] = [
      {
        title: "SWOT Analysis",
        description: "Analyze strengths, weaknesses, opportunities, and threats",
        content: "Please conduct a comprehensive SWOT analysis for [TOPIC]. Include specific examples and actionable insights for each category.",
        category: "Strategy"
      },
      {
        title: "Financial Forecast",
        description: "Generate revenue and expense projections",
        content: "Create a detailed financial forecast for [TIMEFRAME] including revenue projections, expense breakdown, and key financial metrics.",
        category: "Finance"
      },
      {
        title: "Competitive Analysis",
        description: "Compare market position and strategies",
        content: "Analyze the competitive landscape for [INDUSTRY/MARKET]. Compare key players, their strategies, strengths, and market positioning.",
        category: "Market Research"
      },
      {
        title: "Risk Assessment",
        description: "Identify and evaluate potential risks",
        content: "Conduct a thorough risk assessment for [PROJECT/INITIATIVE]. Include risk identification, probability assessment, impact analysis, and mitigation strategies.",
        category: "Risk Management"
      }
    ];

    defaultTemplates.forEach(template => {
      this.createPromptTemplate(template);
    });
  }

  // Chat Sessions
  async getChatSessions(): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const now = new Date();
    const session: ChatSession = {
      ...insertSession,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined> {
    const session = this.chatSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: new Date()
    };
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }

  async deleteChatSession(id: string): Promise<boolean> {
    const deleted = this.chatSessions.delete(id);
    if (deleted) {
      // Delete associated messages and files
      const sessionMessages = Array.from(this.messages.values()).filter(m => m.sessionId === id);
      const sessionFiles = Array.from(this.files.values()).filter(f => f.sessionId === id);
      
      sessionMessages.forEach(m => this.messages.delete(m.id));
      sessionFiles.forEach(f => this.files.delete(f.id));
    }
    return deleted;
  }

  // Messages
  async getMessagesBySession(sessionId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.sessionId === sessionId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date(),
      metadata: null
    };
    this.messages.set(id, message);
    
    // Update session timestamp
    await this.updateChatSession(insertMessage.sessionId, { updatedAt: new Date() });
    
    return message;
  }

  async deleteMessage(id: string): Promise<boolean> {
    return this.messages.delete(id);
  }

  // Files
  async getFilesBySession(sessionId: string): Promise<UploadedFile[]> {
    return Array.from(this.files.values())
      .filter(f => f.sessionId === sessionId)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  async getFile(id: string): Promise<UploadedFile | undefined> {
    return this.files.get(id);
  }

  async createFile(insertFile: InsertFile): Promise<UploadedFile> {
    const id = randomUUID();
    const file: UploadedFile = {
      ...insertFile,
      id,
      uploadedAt: new Date()
    };
    this.files.set(id, file);
    return file;
  }

  async deleteFile(id: string): Promise<boolean> {
    return this.files.delete(id);
  }

  // Prompt Templates
  async getPromptTemplates(): Promise<PromptTemplate[]> {
    return Array.from(this.promptTemplates.values())
      .filter(t => t.isActive)
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  async getPromptTemplate(id: string): Promise<PromptTemplate | undefined> {
    return this.promptTemplates.get(id);
  }

  async createPromptTemplate(insertTemplate: InsertPromptTemplate): Promise<PromptTemplate> {
    const id = randomUUID();
    const template: PromptTemplate = {
      ...insertTemplate,
      id,
      isActive: true
    };
    this.promptTemplates.set(id, template);
    return template;
  }

  async updatePromptTemplate(id: string, updates: Partial<PromptTemplate>): Promise<PromptTemplate | undefined> {
    const template = this.promptTemplates.get(id);
    if (!template) return undefined;
    
    const updatedTemplate = { ...template, ...updates };
    this.promptTemplates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deletePromptTemplate(id: string): Promise<boolean> {
    return this.promptTemplates.delete(id);
  }
}

export const storage = new MemStorage();
