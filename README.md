
<p align="center">
	<img src="logo.png" alt="AssistMind Logo" width="120" />
</p>

<h1 align="center">AssistMind AI</h1>

<p align="center">
	<b>Executive Assistant for Strategic Insights & Analysis</b>
</p>

<p align="center">
	<a href="https://opensource.org/licenses/MIT">
		<img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
	</a>
	<img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js&logoColor=white" alt="Node.js">
	<img src="https://img.shields.io/badge/React-18+-61dafb?logo=react&logoColor=white" alt="React">
	<img src="https://img.shields.io/badge/TypeScript-4+-3178c6?logo=typescript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/PostgreSQL-15+-336791?logo=postgresql&logoColor=white" alt="PostgreSQL">
	<img src="https://img.shields.io/badge/Drizzle%20ORM-0.x-8b5cf6?logo=drizzle&logoColor=white" alt="Drizzle ORM">
	<img src="https://img.shields.io/badge/Tailwind_CSS-3+-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</p>

---

AssistMind AI is a modern full-stack AI chat application designed to empower executives and teams with strategic insights and analysis. Featuring a robust chat interface, file uploads, prompt templates, message management, and real-time previews, AssistMind AI delivers a seamless and productive user experience.

---



# System Architecture

## Frontend
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="20"/> React 18 + TypeScript (Vite)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-plain.svg" width="20"/> Tailwind CSS (custom dark theme)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/radixui/radixui-original.svg" width="20"/> Radix UI primitives & shadcn/ui
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="20"/> TypeScript
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/reactquery/reactquery-original.svg" width="20"/> TanStack React Query
- Wouter (client-side routing)
- React Hook Form + Zod (form validation)

## Backend
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" width="20"/> Node.js (Express.js, ESM modules)
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" width="20"/> PostgreSQL (Drizzle ORM)
- Dual storage: in-memory (dev) & PostgreSQL (prod)
- RESTful API, structured error handling, request logging
- Vite for hot module replacement (dev)

## Database Schema
- Chat Sessions: Conversation metadata (UUID primary keys)
- Messages: Linked to sessions, role-based content (user/assistant)
- Uploaded Files: File management with MIME types, sizes
- Prompt Templates: Reusable, categorized, active/inactive

## Authentication & Security
- Session-based (connect-pg-simple, PostgreSQL)
- CORS & security headers (Express middleware)
- Input validation (Zod)

## Real-time Features
- Live message updates (React Query auto-refetch)
- Real-time chat UI: message bubbles, typing indicators
- Output preview panel for formatted responses


# Key Technologies

- <img src="https://img.shields.io/badge/React-18+-61dafb?logo=react&logoColor=white" alt="React"/> React, TypeScript, Vite
- <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white" alt="Node.js"/> Node.js, Express.js
- <img src="https://img.shields.io/badge/PostgreSQL-15+-336791?logo=postgresql&logoColor=white" alt="PostgreSQL"/> PostgreSQL, Drizzle ORM
- <img src="https://img.shields.io/badge/Tailwind_CSS-3+-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/> Tailwind CSS, Radix UI, shadcn/ui
- <img src="https://img.shields.io/badge/React_Query-5+-ff4154?logo=reactquery&logoColor=white" alt="React Query"/> TanStack React Query
- <img src="https://img.shields.io/badge/Zod-3+-5f43e9?logo=zod&logoColor=white" alt="Zod"/> Zod, React Hook Form
- <img src="https://img.shields.io/badge/Neon-Serverless-00e599?logo=neon&logoColor=white" alt="Neon"/> Neon Database
- Lucide React, Embla Carousel, Class Variance Authority, clsx, tailwind-merge, date-fns, nanoid

# Getting Started

1. **Clone the repository**
	```sh
	git clone https://github.com/fikriaf/AssistMind.git
	cd AssistMind
	```
2. **Install dependencies**
	```sh
	npm install
	```
3. **Configure environment variables**
	- Copy `.env.example` to `.env` and fill in required values.
4. **Run development server**
	```sh
	npm run dev
	```

# License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <img src="logo.png" alt="AssistMind Logo" width="60"/>
</p>