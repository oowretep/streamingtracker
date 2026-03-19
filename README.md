Streaming Tracker
A full-stack web application that helps users discover where to watch their favorite movies and TV shows across major streaming platforms including Netflix, Hulu, Disney+, Max, Prime Video, Apple TV+, Peacock, and Paramount+.
Features include real-time search with type and decade filters, title detail pages with cast, director, ratings, and streaming availability grouped by subscription, rental, and purchase. Users can create a personal watchlist and favorites list, track watched status, and filter their lists by streaming platform. A dedicated New & Upcoming page surfaces recent additions and upcoming releases across all major platforms.
Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and shadcn/ui on the frontend. The backend uses Next.js API routes connected to a Neon serverless PostgreSQL database via Drizzle ORM. Authentication is handled by Better Auth with Google OAuth. Content data is sourced from the Watchmode and TMDB APIs. Deployed on Vercel with server-side caching for optimized API usage.

Frontend

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI

Backend

- Next.js API Routes
- Node.js (via Next.js)

Database

- Neon (serverless PostgreSQL)
- Drizzle ORM

Auth

- Better Auth (Google OAuth)

External APIs

- Watchmode API (streaming availability, releases)
- TMDB API (posters, cast, crew)

Deployment

- Vercel

Key Libraries

- next-themes (dark/light mode)
- @neondatabase/serverless
- better-auth
- drizzle-kit
- zod
