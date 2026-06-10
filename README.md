# VibeMovie - AI Mood-Based Movie Recommendation App

Discover movies by emotional resonance instead of genre.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?logo=prisma)](https://www.prisma.io/)
[![AI](https://img.shields.io/badge/AI-DeepSeek-4B8BBE)](https://www.deepseek.com/)
[![Movie Data](https://img.shields.io/badge/Movie%20Data-TMDB-01B4E4)](https://www.themoviedb.org/)
[![Live Demo](https://img.shields.io/badge/Live-vibemovie.top-38BDF8)](https://vibemovie.top)

VibeMovie is an AI-assisted mood-based movie recommendation web app. Instead of asking users to choose a genre, it starts from their current emotional state, asks a few reflective questions, recommends films that match the user's "vibe", and saves the result into a personal emotional archive.

Live demo: [https://vibemovie.top](https://vibemovie.top)

![VibeMovie demo flow](docs/demo.gif)

## Highlights

- Emotion-first recommendation flow, not a static genre filter.
- DeepSeek-powered reflection questions and movie recommendation reasoning.
- TMDB-powered posters, ratings, and movie metadata.
- Prisma and PostgreSQL-backed archive and public wall.
- Cinematic responsive UI with visual presets and shareable result cards.

## Why VibeMovie Is Different

Most movie apps recommend films by genre, popularity, or rating. VibeMovie starts from the user's current emotional state and turns it into a cinematic recommendation journey: mood input, emotional resonance, reflective questions, curated films, archive, and public wall.

## Project Summary

Traditional movie recommendation products usually begin with genre, popularity, or ratings. VibeMovie explores a more emotional interaction model:

1. The user writes how they feel right now.
2. DeepSeek generates warm follow-up questions and an emotional category.
3. The user answers the questions to clarify the mood.
4. DeepSeek recommends three films.
5. TMDB enriches the result with poster, rating, and release data.
6. The app stores the emotional record and can display it in Archive or Wall views.

The result is a small cinematic experience that combines AI conversation, movie discovery, emotional journaling, and visual sharing.

## Features

- Mood-based input flow for natural emotional expression
- AI-generated reflective questions
- Personalized movie recommendations
- TMDB poster, rating, and release-date enrichment
- Mood archive backed by Prisma and PostgreSQL
- Public emotion wall for shared resonance
- Cinematic UI with animated transitions and visual presets
- Shareable poster generation for selected recommendations

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Required services:

- DeepSeek API key
- TMDB API key
- PostgreSQL database

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js App Router |
| Language | TypeScript |
| UI | React, Tailwind CSS, Framer Motion |
| AI | DeepSeek Chat Completions API |
| Movie data | TMDB API |
| Database | PostgreSQL |
| ORM | Prisma |
| Deployment | Custom domain: vibemovie.top |

## User Flow

```mermaid
flowchart LR
  A["Mood input"] --> B["AI emotional questions"]
  B --> C["User answers"]
  C --> D["AI movie recommendation"]
  D --> E["TMDB enrichment"]
  E --> F["Recommendation cards"]
  F --> G["Selected movie poster"]
  F --> H["Mood archive"]
  H --> I["Public wall"]
```

## Architecture

```mermaid
flowchart TB
  U["User browser"] --> N["Next.js App Router"]
  N --> Q["/api/questions"]
  N --> M["/api/movies"]
  N --> A["/api/archive"]
  N --> W["/api/wall"]
  Q --> DS["DeepSeek API"]
  M --> DS
  M --> TMDB["TMDB API"]
  A --> P["Prisma Client"]
  W --> P
  P --> DB["PostgreSQL database"]
```

## Repository Structure

```txt
.
+-- docs/                  # Project documentation, diagrams, and screenshots
+-- prisma/                # Prisma schema and migration files
+-- public/                # Static visual assets
+-- src/
|   +-- app/               # Next.js pages and API routes
|   +-- lib/               # Shared server-side utilities
+-- .env.example           # Required environment variables
+-- package.json
+-- README.md
```

## API Overview

| Route | Purpose |
| --- | --- |
| `POST /api/questions` | Converts a mood input into reflective questions, a healing message, and a mood category |
| `POST /api/movies` | Generates movie recommendations and enriches them with TMDB data |
| `GET /api/archive` | Lists saved emotional movie records |
| `POST /api/archive` | Saves a selected mood/movie record |
| `PATCH /api/archive` | Updates a user's memo for a record |
| `GET /api/wall` | Lists public wall records |
| `PATCH /api/archive/[id]` | Updates public/private visibility |

## Database Model

```prisma
model Record {
  id             String   @id @default(uuid())
  createdAt      DateTime @default(now())
  initialMood    String
  moodCategory   String
  healingMessage String
  movieTitle     String
  userMemo       String?
  isPublic       Boolean  @default(false)
}
```

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
DEEPSEEK_API_KEY="your_deepseek_api_key"
TMDB_API_KEY="your_tmdb_api_key"
```

## Useful Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npx prisma generate
npx prisma migrate deploy
```

## Roadmap

- [ ] Add a short narrated demo video for social sharing.
- [ ] Add user accounts and personal movie collections.
- [ ] Add fallback recommendations when DeepSeek or TMDB is unavailable.
- [ ] Add API route tests and response schema validation tests.
- [ ] Add mood analytics, weekly summaries, and exportable archive cards.
- [ ] Continue splitting the remaining large UI sections into focused components.

## Contributing

This is a portfolio-first side project, but feedback and small improvements are welcome. Good first contributions include README improvements, UI polish, fallback states, accessibility fixes, and tests for API response parsing.

## Screenshots

The screenshots below show the full user journey from mood input to recommendation, archive, public wall, and mobile layout.

| Home | Emotional Resonance |
| --- | --- |
| ![VibeMovie home screen](docs/screenshots/home.png) | ![VibeMovie resonance screen](docs/screenshots/resonance.png) |

| AI Questions | Movie Recommendations |
| --- | --- |
| ![AI-generated reflection questions](docs/screenshots/questions.png) | ![Personalized movie recommendation cards](docs/screenshots/recommendations.png) |

| Selected Result | Archive |
| --- | --- |
| ![Selected movie result screen](docs/screenshots/poster.png) | ![Saved mood archive](docs/screenshots/archive.png) |

| Public Wall | Mobile Layout |
| --- | --- |
| ![Public emotion wall](docs/screenshots/wall.png) | ![Responsive mobile homepage](docs/screenshots/mobile.png) |

## Development Approach

This project was built through an AI-assisted vibecoding workflow. AI tools helped rapidly prototype interface concepts, emotional copywriting, API logic, and interaction patterns. The final project combines those iterations with real API integration, database persistence, deployment, and repository cleanup so it can be presented as a complete portfolio project.

## What This Project Demonstrates

- Turning an open-ended idea into a working web product
- Designing a user journey around emotion instead of static categories
- Integrating LLM output safely with JSON validation
- Combining AI-generated content with external structured movie data
- Persisting user records with Prisma and PostgreSQL
- Building a visually distinctive, responsive Next.js interface

## Share This Project

If you like the idea of recommending movies by mood instead of genre, consider starring the repository or sharing the live demo with someone who loves cinema.
