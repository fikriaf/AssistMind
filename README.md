# Overview

This is a modern full-stack AI chat application called "AssistMind AI" - an executive assistant for strategic insights and analysis. The application features a React frontend with TypeScript, Express.js backend, and PostgreSQL database with Drizzle ORM. It provides a sophisticated chat interface with features like file uploads, prompt templates, message management, and a real-time preview system.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Comprehensive design system built on Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with a custom dark theme using CSS variables for colors (obsidian, gold, platinum color palette)
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js framework using ESM modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Data Storage**: Dual storage approach with in-memory storage (MemStorage) for development and PostgreSQL for production
- **API Design**: RESTful API with structured error handling and request logging middleware
- **Development Tools**: Vite integration for hot module replacement in development mode

## Database Schema
- **Chat Sessions**: Stores conversation metadata with UUID primary keys
- **Messages**: Linked to sessions with role-based content (user/assistant) and optional metadata
- **Uploaded Files**: File management with metadata including MIME types and sizes
- **Prompt Templates**: Reusable templates organized by categories with active/inactive states

## Authentication & Security
- Currently uses session-based approach with connect-pg-simple for PostgreSQL session storage
- CORS and security headers configured through Express middleware
- Input validation using Zod schemas for type safety

## Real-time Features
- Live message updates through React Query's automatic refetching
- Real-time chat interface with message bubbles and typing indicators
- Output preview panel for displaying formatted responses

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database using @neondatabase/serverless driver
- **Drizzle Kit**: Database migration and schema management tool

## UI & Styling
- **Radix UI**: Comprehensive set of accessible UI primitives for React
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Modern icon library for consistent iconography
- **Embla Carousel**: Touch-friendly carousel component

## Development & Build Tools
- **Vite**: Fast build tool with TypeScript support and hot module replacement
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution environment for development server

## Form & Validation
- **React Hook Form**: Performant forms library with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **Hookform Resolvers**: Integration between React Hook Form and Zod

## Utilities & Libraries
- **TanStack React Query**: Powerful data synchronization for React applications
- **Class Variance Authority**: Utility for creating variant-based component APIs
- **CLSX & Tailwind Merge**: Conditional className utilities
- **Date-fns**: Modern JavaScript date utility library
- **Nanoid**: URL-safe unique string ID generator