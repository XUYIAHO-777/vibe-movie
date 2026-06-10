# VibeMovie - Cinema of Emotions

VibeMovie is a mood-based movie recommendation web app. Instead of asking users to choose a genre, it starts from their current emotional state, asks a few reflective questions, recommends films that match the user's "vibe", and saves the result into a personal emotional archive.

Live demo: [https://vibemovie.top](https://vibemovie.top)

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
├── docs/                  # Project documentation, diagrams, and screenshots
├── prisma/                # Prisma schema and migration files
├── public/                # Static visual assets
├── src/
│   ├── app/               # Next.js pages and API routes
│   └── lib/               # Shared server-side utilities
├── .env.example           # Required environment variables
├── package.json
└── README.md
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

## Screenshots

### Home

![VibeMovie home screen](docs/screenshots/home.png)

Recommended additional screenshots before final portfolio sharing:

- `questions.png` - AI-generated reflection questions
- `recommendations.png` - movie recommendation cards
- `archive.png` - saved mood records
- `wall.png` - public emotion wall

## Development Approach

This project was built through an AI-assisted vibecoding workflow. AI tools helped rapidly prototype interface concepts, emotional copywriting, API logic, and interaction patterns. The final project combines those iterations with real API integration, database persistence, deployment, and repository cleanup so it can be presented as a complete portfolio project.

## What This Project Demonstrates

- Turning an open-ended idea into a working web product
- Designing a user journey around emotion instead of static categories
- Integrating LLM output safely with JSON validation
- Combining AI-generated content with external structured movie data
- Persisting user records with Prisma and PostgreSQL
- Building a visually distinctive, responsive Next.js interface

## Future Improvements

- Add user accounts and personal collections
- Add richer mood analytics and weekly emotion summaries
- Improve fallback recommendations when AI or TMDB requests fail
- Add automated tests for API routes and schema validation
- Split large UI files into smaller reusable components
- Add accessibility and SEO refinements
